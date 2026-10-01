import mongoose from 'mongoose';
const mk = (name, shape) => mongoose.model(name, new mongoose.Schema(shape, { timestamps: true }));
// Collection name (API route) -> Mongoose model
export const models = {
  members: mk('Member', { name: String, role: String, img: String, bio: String }),
  projects: mk('Project', { title: String, desc: String, tags: String }),
  events: mk('Event', { title: String, date: String, desc: String }),
  sponsors: mk('Sponsor', { name: String, img: String, link: String }),
  gallery: mk('Photo', { caption: String, img: String }),
  messages: mk('Message', { name: String, email: String, text: String }),
};
