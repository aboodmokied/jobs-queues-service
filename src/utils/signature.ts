import * as crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SIGNATURE_SECRET_KEY;

/**
 * Sign a payload with a secret key using HMAC.
 *
 * @param payload - The payload to sign, either as an object or a string
 * @returns The hexadecimal digest of the signature
 */
export function signPayload(
  payload: any,
): string {
  // Convert object payload to JSON string
  const payloadStr = JSON.stringify(payload)
  // Create the signature using HMAC and the hexadecimal digest 
  const signature = crypto.createHmac('sha256', SECRET_KEY!).update(payloadStr!).digest('hex');
  return signature;
}