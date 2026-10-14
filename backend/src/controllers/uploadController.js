import { describeUpload } from '../services/uploadService.js';

export const upload = (req, res) => {
  res.json(describeUpload(req.file));
};
