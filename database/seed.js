// Optional: fills EMPTY collections with sample content. Run: npm run seed (from repo root)
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, models } from './index.js';
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../backend/.env') });

const sample = {
  projects: [
    { title: 'Line Follower Bot', desc: 'PID-based line follower built for speed runs.', tags: 'Arduino, PID, Sensors' },
    { title: 'Robo Soccer', desc: 'Remote-operated robot for 2v2 robo soccer.', tags: 'RC, Motors, CAD' },
    { title: 'Maze Solver', desc: 'Autonomous bot that maps and solves a maze.', tags: 'ESP32, Algorithms' },
  ],
  members: [
    { name: 'Sample Captain', role: 'Team Captain', bio: 'Replace me from the admin panel.' },
    { name: 'Sample Lead', role: 'Electronics Lead', bio: 'Replace me from the admin panel.' },
  ],
  events: [{ title: 'Sample Competition', date: '2026-12-01', desc: 'Replace me from the admin panel.' }],
};
await connectDB(process.env.MONGO_URI);
for (const [k, rows] of Object.entries(sample)) {
  if (!(await models[k].countDocuments())) { await models[k].insertMany(rows); console.log('Seeded', k); }
}
process.exit(0);
