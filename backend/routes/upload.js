import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { auth } from '../middleware/auth.js';

fs.mkdirSync('uploads', { recursive: true });
const up = multer({
  storage: multer.diskStorage({ destination: 'uploads', filename: (q, f, cb) => cb(null, Date.now() + path.extname(f.originalname).toLowerCase()) }),
  limits: { fileSize: 5e6 },
  fileFilter: (q, f, cb) => cb(null, /^image\/(png|jpe?g|webp|gif)$/.test(f.mimetype)),
});
const r = express.Router();
r.post('/', auth, up.single('file'), (q, s) =>
  q.file ? s.json({ url: '/uploads/' + q.file.filename }) : s.status(400).json({ error: 'Upload a PNG, JPG, WEBP or GIF under 5 MB' }));
export default r;
