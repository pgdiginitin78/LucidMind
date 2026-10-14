import { asyncHandler } from '../utils/http.js';
import * as auth from '../services/authService.js';
import { parseLoginBody } from '../validators/auth.js';

export const login = asyncHandler(async (req, res) => {
  const creds = parseLoginBody(req.body ?? {});
  const { token, user } = await auth.login(creds);
  res.json({ message: 'Login successful', token, user });
});

export const me = asyncHandler(async (req, res) => {
  const user = await auth.getMe(req.user.id);
  res.json({ user });
});
