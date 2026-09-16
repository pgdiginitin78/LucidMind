import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.model.js';

const DB_FILE = path.join(process.cwd(), 'backend', 'data', 'db.json');

const getLocalUser = (username) => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      return data.users?.find((u) => u.username === username) || null;
    }
  } catch (err) {
    console.error('Error reading local db.json:', err.message);
  }
  return null;
};

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'lucidmind_super_secret_key_change_this_in_production',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

const loginUser = async ({ username, password }) => {
  let user = null;

  if (mongoose.connection.readyState === 1) {
    user = await User.findOne({ username });
  } else {
    user = getLocalUser(username);
  }

  if (!user) {
    throw new Error('Invalid username or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid username or password');
  }

  const userId = user._id || user.id;
  const token = generateToken(userId);

  return {
    user: {
      id: userId,
      username: user.username,
    },
    token,
  };
};

export default { loginUser, generateToken };
