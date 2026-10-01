import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { api } from './api.js';

const useList = (k) => { const [l, s] = useState([]); useEffect(() => { api(k).then(d => Array.isArray(d) && s(d)).catch(() => {}); }, [k]); return l; };

function Reveal({ children, i = 0 }) {
  return <div className="rv" style={{ animationDelay: i * 70 + 'ms' }}>{children}</div>;
}

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, [pathname]);
  const links = [['/projects', 'Projects'], ['/team', 'Team'], ['/events', 'Events'], ['/gallery', 'Gallery'], ['/sponsors', 'Sponsors'], ['/about', 'About'], ['/contact', 'Contact']];
  if (pathname === '/') return <Outlet />;
  return (<>
    <header className="nav"><Link to="/" className="plogo"><span className="badge"><img src="/logo.jpg" alt="Vyuastra Robotics home" /></span><span><b>Vyuastra</b><i>Robotics</i></span></Link>
      <nav>{links.map(([to, t]) => <NavLink key={to} to={to}>{t}</NavLink>)}</nav></header>
    <main key={pathname} className="page"><Outlet /></main>
    <footer className="foot"><Social /><div className="edition"><small>Student robotics team</small><b>Vyuastra Robotics</b></div></footer>
  </>);
}

const Page = ({ title, children }) => <section className="sec"><h2>{title}</h2>{children}</section>;
const Empty = ({ list, text }) => !list.length && <p className="empty">{text}</p>;
const ProjectCard = ({ p, i }) => <Reveal i={i}><article className="card"><h3>{p.title}</h3><p>{p.desc}</p>
  <div className="tags">{(p.tags || '').split(',').filter(Boolean).map(t => <span key={t}>{t.trim()}</span>)}</div></article></Reveal>;

const SOCIAL = { instagram: '#', linkedin: '#', youtube: '#', x: '#', location: '#' }; // put your real links here
const ICON = {
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  linkedin: 'M4 9h4v11H4zM6 4a1.800 1.800 0 1 0 0 3.600A1.800 1.800 0 0 0 6 4zM10 9h4v1.600c.8-1.200 2-1.900 3.600-1.900 3 0 3.400 2 3.400 4.400V20h-4v-6c0-1.300-.3-2.200-1.600-2.200S14 12.700 14 14v6h-4z',
  youtube: 'M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM10 9v6l5-3z',
  x: 'M4 4l16 16M20 4L4 20',
  location: 'M12 21s-6-5.500-6-11a6 6 0 0 1 12 0c0 5.500-6 11-6 11zM12 7.500a2.500 2.500 0 1 0 0 5 2.500 2.500 0 0 0 0-5z',
};
const OPEN = [['/contact', 'Join the team'], ['/contact', 'Sponsor us']];
const MENU = [['/projects', 'Projects'], ['/events', 'Events'], ['/team', 'Team'], ['/gallery', 'Gallery'], ['/sponsors', 'Sponsors'], ['/about', 'About us'], ['/contact', 'Contact']];
const Tile = ({ to, t }) => <Link className="tile" to={to}>{t}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg></Link>;

const Social = () => <div className="social">{Object.entries(SOCIAL).map(([k, href]) => <a key={k} href={href} aria-label={k} target="_blank" rel="noreferrer">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d={ICON[k]} /></svg></a>)}</div>;

export function Home() {
  return (<div className="portal">
    <Link to="/" className="plogo"><span className="badge"><img src="/logo.jpg" alt="Vyuastra Robotics logo" /></span><span><b>Vyuastra</b><i>Robotics</i></span></Link>
    <div className="orbit" aria-hidden="true"><i className="r r1" /><i className="r r2" /><i className="r r3" /><span className="core"><img src="/logo.jpg" alt="" /></span></div>
    <nav className="menu" aria-label="Main">
      <h2 className="lbl"><span className="dot" />Recruitment open</h2>
      <div className="tiles">{OPEN.map(([to, t]) => <Tile key={t} to={to} t={t} />)}</div>
      <h2 className="lbl">The team</h2>
      <div className="tiles">{MENU.map(([to, t]) => <Tile key={t} to={to} t={t} />)}</div>
    </nav>
    <Social />
    <div className="edition"><small>Student robotics team</small><h1>Vyuastra Robotics</h1></div>
  </div>);
}

export function SponsorsPage() {
  const l = useList('sponsors');
  return <Page title="Sponsors and partners"><div className="sponsors">{l.map((s, i) => <Reveal key={s._id} i={i}>
    <a href={s.link || '#'} target="_blank" rel="noreferrer" title={s.name}>{s.img ? <img src={s.img} alt={s.name} /> : s.name}</a></Reveal>)}</div>
    <Empty list={l} text="No sponsors yet." /><Link className="btn" to="/contact">Sponsor us</Link></Page>;
}

export function AboutPage() {
  return <Page title="About us"><div className="about"><p>Vyuastra Robotics is a student engineering team that designs, builds and tests robots for national competitions and research projects.</p>
    <p>Our members work across mechanical design, electronics, embedded software and automation, and learn by shipping real machines.</p>
    <Link className="btn" to="/contact">Join the team</Link></div></Page>;
}

export function ProjectsPage() {
  const l = useList('projects');
  return <Page title="Projects"><div className="grid">{l.map((p, i) => <ProjectCard key={p._id} p={p} i={i} />)}</div><Empty list={l} text="No projects yet." /></Page>;
}

export function TeamPage() {
  const l = useList('members');
  return <Page title="Team"><div className="grid">{l.map((m, i) => <Reveal key={m._id} i={i}><article className="member">
    <div className="avatar">{m.img ? <img src={m.img} alt={m.name} /> : m.name?.[0]}</div><h3>{m.name}</h3><b>{m.role}</b><p>{m.bio}</p></article></Reveal>)}</div>
    <Empty list={l} text="No team members yet." /></Page>;
}

export function EventsPage() {
  const l = useList('events');
  return <Page title="Events and competitions"><ul className="events">{l.map((e, i) => <li key={e._id}><Reveal i={i}><div className="ev"><time>{e.date}</time><div><h3>{e.title}</h3><p>{e.desc}</p></div></div></Reveal></li>)}</ul>
    <Empty list={l} text="No events yet." /></Page>;
}

export function GalleryPage() {
  const l = useList('gallery'); const [open, setOpen] = useState(null);
  useEffect(() => { const k = (e) => e.key === 'Escape' && setOpen(null); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);
  return <Page title="Gallery"><div className="gallery">{l.map((g, i) => <Reveal key={g._id} i={i % 6}>
    <button className="shot" onClick={() => setOpen(g)}><img src={g.img} alt={g.caption} loading="lazy" /><span>{g.caption}</span></button></Reveal>)}</div>
    <Empty list={l} text="No photos yet." />
    {open && <div className="lightbox" onClick={() => setOpen(null)} role="dialog"><img src={open.img} alt={open.caption} /><p>{open.caption}</p></div>}</Page>;
}

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', text: '' }); const [sent, setSent] = useState('');
  const send = async (e) => {
    e.preventDefault();
    try { await api('messages', 'POST', form); setSent('Message sent. We will reply soon.'); setForm({ name: '', email: '', text: '' }); }
    catch (err) { setSent(err.message); }
  };
  return <Page title="Contact"><form className="contact" onSubmit={send}>
    <input required placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
    <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
    <textarea required rows="4" placeholder="How can we help?" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} />
    <button className="btn">Send message</button>{sent && <p role="status">{sent}</p>}</form></Page>;
}
