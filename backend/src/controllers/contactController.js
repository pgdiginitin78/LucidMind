import { asyncHandler } from '../utils/http.js';
import { sendContactEmail } from '../services/contactService.js';
import { validateContact } from '../validators/contact.js';

export const send = asyncHandler(async (req, res) => {
  const fields = validateContact(req.body);
  await sendContactEmail(fields);
  res.json({ success: true, message: 'Message sent successfully.' });
});
