import CryptoJS from 'crypto-js';

const SECRET_KEY =
  process.env.PAYLOAD_SECRET ||
  process.env.NEXT_PUBLIC_PAYLOAD_SECRET ||
  'lucidmind_payload_secret_key_2026';

/**
 * Decrypt incoming encrypted payload back to data object
 */
export const decryptPayload = (ciphertext) => {
  try {
    if (!ciphertext || typeof ciphertext !== 'string') return null;
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedStr) return null;
    try {
      return JSON.parse(decryptedStr);
    } catch {
      return decryptedStr;
    }
  } catch (error) {
    console.error('Payload decryption failed:', error.message);
    return null;
  }
};

/**
 * Encrypt data object or string
 */
export const encryptPayload = (data) => {
  try {
    const stringified = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringified, SECRET_KEY).toString();
  } catch (error) {
    console.error('Payload encryption failed:', error.message);
    return null;
  }
};

export default { decryptPayload, encryptPayload };
