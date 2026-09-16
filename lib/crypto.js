/* global process */
import CryptoJS from 'crypto-js';

const SECRET_KEY =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_PAYLOAD_SECRET) ||
  'lucidmind_payload_secret_key_2026';

/**
 * Encrypt any JS object or string for secure payload transmission
 */
export const encryptPayload = (data) => {
  try {
    const stringified = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringified, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

/**
 * Decrypt ciphertext back to object or string
 */
export const decryptPayload = (ciphertext) => {
  try {
    if (!ciphertext) return null;
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedStr) return null;
    try {
      return JSON.parse(decryptedStr);
    } catch {
      return decryptedStr;
    }
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};
