import express from 'express';
import { auth } from '../middleware/auth.js';

// Public: read (members, projects, events, sponsors, gallery) + send a message. Admin only: everything else.
export default (key, M) => {
  const r = express.Router(), isMsg = key === 'messages';
  r.get('/', ...(isMsg ? [auth] : []), async (_, res) => res.json(await M.find().sort({ createdAt: isMsg ? -1 : 1 })));
  r.post('/', ...(isMsg ? [] : [auth]), async (q, s) => s.status(201).json(await M.create(q.body)));
  r.put('/:id', auth, async (q, s) => s.json(await M.findByIdAndUpdate(q.params.id, q.body, { new: true })));
  r.delete('/:id', auth, async (q, s) => { await M.findByIdAndDelete(q.params.id); s.json({ ok: true }); });
  return r;
};
