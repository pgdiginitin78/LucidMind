import mongoose from 'mongoose';
import authService from '../services/auth.service.js';
import { decryptPayload } from '../utils/crypto.utils.js';

const login = async (req, res) => {
  try {
    let { username, password, payload } = req.body;

    // If request payload is encrypted
    if (payload) {
      const decrypted = decryptPayload(payload);
      if (decrypted && typeof decrypted === 'object') {
        username = decrypted.username;
        password = decrypted.password;
      }
    } else {
      // Check if username or password individually were encrypted
      if (username && typeof username === 'string' && username.startsWith('U2FsdGVkX1')) {
        const decUser = decryptPayload(username);
        if (decUser) username = decUser;
      }
      if (password && typeof password === 'string' && password.startsWith('U2FsdGVkX1')) {
        const decPass = decryptPayload(password);
        if (decPass) password = decPass;
      }
    }

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const result = await authService.loginUser({ username, password });
    return res.status(200).json({ message: 'Login successful', ...result });
  } catch (error) {
    return res.status(401).json({ message: error.message || 'Invalid username or password' });
  }
};

const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};

export default { login, getMe };
