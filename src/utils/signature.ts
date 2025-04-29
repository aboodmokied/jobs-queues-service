import * as crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Sign a payload with a secret key using HMAC SHA-256.
 *
 * @param payload - The payload to sign (object or primitive value)
 * @param secret - The secret key used for signing
 * @returns Object containing both the signature and the stringified payload
 */
export function signPayload(
  payload: any,
  secret: string
) {
  // Convert payload to JSON string
  const payloadStr = JSON.stringify(payload);
  
  // Create signature using HMAC SHA-256 and convert to hexadecimal
  const signature = crypto.createHmac('sha256', secret).update(payloadStr).digest('hex');
  
  return { signature, payloadStr };
}