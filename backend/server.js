import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { connectDB, models } from 'vyuastra-database';
import crud from './routes/crud.js';
import upload from './routes/upload.js';

const { MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, PORT = 5000 } = process.env;
const app = express();
app.use(cors(), express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/upload', upload);

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Wrong email or password' });
  res.json({ token: jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '8h' }) });
});
for (const [key, M] of Object.entries(models)) app.use(`/api/${key}`, crud(key, M));

await connectDB(MONGO_URI);
app.listen(PORT, () => console.log(`API on :${PORT}`));
