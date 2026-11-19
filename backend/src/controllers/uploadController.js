import { describeUpload } from '../services/uploadService.js';

export const upload = async (req, res) => {
  res.json(await describeUpload(req.file));
};
