
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
// import { signPayload } from '../utils/signature';

dotenv.config();

const SECRET_KEY = process.env.SIGNATURE_SECRET_KEY;

/**
 * Middleware to verify the X-Signature header
 * The signature is expected to be a HMAC SHA256 hash of the request body
 * using the SECRET_KEY
 */
export const verifySignature = (req:any, res: Response, next: NextFunction):void => {
  // Get the signature from the headers
  const signature = req.headers['x-signature'] as string;

  if (!signature) {
    res.status(401).json({ error: 'X-Signature header is missing' });
    return;
  }

  if (!SECRET_KEY) {
    console.error('SIGNATURE_SECRET_KEY is not defined in environment variables');
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  // Get the raw body (assuming body-parser is configured to provide it)
  const rawBody = req.rawBody || '';
  // Compute the expected signature
  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY!)
    .update(rawBody)
    .digest('hex');
  // Compare the signatures
  const bufferA = Buffer.from(expectedSignature, 'utf8');
  const bufferB = Buffer.from(signature, 'utf8');
  if (bufferA.length !== bufferB.length){
    res.status(401).json({ error: 'Invalid signature' });
    return;
  }
  if(!crypto.timingSafeEqual(bufferA, bufferB)){
    res.status(401).json({ error: 'Invalid signature' });
    return;
  }
  next();
};