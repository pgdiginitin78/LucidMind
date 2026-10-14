import { HttpError } from '../utils/http.js';
import { decryptCryptoJsAES } from '../utils/cryptoJs.js';
import config from '../config/env.js';
import { empty } from '../utils/php.js';

/** Returns { username, password } from an encrypted `payload` or plaintext fallback. */
export function parseLoginBody(body = {}) {
  let username = '';
  let password = '';

  if (!empty(body.payload) && typeof body.payload === 'string') {
    const decrypted = decryptCryptoJsAES(body.payload, config.payloadSecret);
    if (decrypted) {
      try {
        const decoded = JSON.parse(decrypted);
        username = typeof decoded?.username === 'string' ? decoded.username.trim() : '';
        password = typeof decoded?.password === 'string' ? decoded.password : '';
      } catch {
        /* fall through to plaintext */
      }
    }
  }

  if (empty(username)) username = typeof body.username === 'string' ? body.username.trim() : '';
  if (empty(password)) password = typeof body.password === 'string' ? body.password : '';

  if (empty(username) || empty(password)) {
    throw new HttpError(400, 'Username and password are required');
  }
  return { username, password };
}
