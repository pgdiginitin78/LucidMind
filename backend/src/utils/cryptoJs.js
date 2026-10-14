import crypto from 'node:crypto';

/**
 * Decrypt a CryptoJS.AES.encrypt(passphrase) string (OpenSSL "Salted__" format,
 * EVP_BytesToKey with MD5, AES-256-CBC). Returns null on any failure.
 */
export function decryptCryptoJsAES(ciphertextB64, passphrase) {
  try {
    const raw = Buffer.from(ciphertextB64, 'base64');
    if (raw.length < 17 || raw.subarray(0, 8).toString('latin1') !== 'Salted__') return null;

    const salt = raw.subarray(8, 16);
    const body = raw.subarray(16);

    let derived = Buffer.alloc(0);
    let prev = Buffer.alloc(0);
    while (derived.length < 48) {
      prev = crypto
        .createHash('md5')
        .update(Buffer.concat([prev, Buffer.from(passphrase, 'utf8'), salt]))
        .digest();
      derived = Buffer.concat([derived, prev]);
    }

    const decipher = crypto.createDecipheriv('aes-256-cbc', derived.subarray(0, 32), derived.subarray(32, 48));
    return Buffer.concat([decipher.update(body), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}
