import { useEffect, useState } from 'react';
import { api, upload } from './api.js';

const TABS = {
  members: { label: 'Team members', fields: ['name', 'role', 'img', 'bio'], title: 'name' },
  projects: { label: 'Projects', fields: ['title', 'desc', 'tags'], title: 'title' },
  events: { label: 'Events', fields: ['title', 'date', 'desc'], title: 'title' },
  sponsors: { label: 'Sponsors', fields: ['name', 'img', 'link'], title: 'name' },
  gallery: { label: 'Gallery', fields: ['caption', 'img'], title: 'caption' },
  messages: { label: 'Messages', fields: [], title: 'name' },
};

export default function Admin() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('vy_token'));
  const [tab, setTab] = useState('members');
  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  return (<div className="admin">
    <aside><h2>Admin</h2>{Object.entries(TABS).map(([k, t]) => <button key={k} className={k === tab ? 'on' : ''} onClick={() => setTab(k)}>{t.label}</button>)}
      <button onClick={() => { localStorage.removeItem('vy_token'); setAuthed(false); }}>Log out</button><a href="http://localhost:5173">View site</a></aside>
    <main><Manager key={tab} k={tab} cfg={TABS[tab]} /></main></div>);
}

function Login({ onDone }) {
  const [f, setF] = useState({ email: '', password: '' }); const [err, setErr] = useState('');
  const go = async (e) => { e.preventDefault(); try { const { token } = await api('login', 'POST', f); localStorage.setItem('vy_token', token); onDone(); } catch (x) { setErr(x.message); } };
  return <form className="login" onSubmit={go}><h2>Admin login</h2>
    <input placeholder="Email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
    <input type="password" placeholder="Password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} />
    <button className="btn">Log in</button>{err && <p role="alert">{err}</p>}</form>;
}

function Manager({ k, cfg }) {
  const [items, setItems] = useState([]); const [form, setForm] = useState({}); const [editId, setEditId] = useState(null);
  const load = () => api(k).then(setItems).catch(() => { localStorage.removeItem('vy_token'); location.reload(); });
  useEffect(() => { load(); }, [k]);
  const save = async (e) => { e.preventDefault(); await api(editId ? `${k}/${editId}` : k, editId ? 'PUT' : 'POST', form); setForm({}); setEditId(null); load(); };
  const del = async (id) => { if (confirm('Delete this item?')) { await api(`${k}/${id}`, 'DELETE'); load(); } };
  return (<>
    <h2>{cfg.label}</h2>
    {cfg.fields.length > 0 && <form className="row" onSubmit={save}>
      {cfg.fields.map(f => f === 'img' ? <Upload key={f} value={form.img} onChange={u => setForm({ ...form, img: u })} /> : <input key={f} placeholder={f} value={form[f] || ''} onChange={e => setForm({ ...form, [f]: e.target.value })} />)}
      <button className="btn">{editId ? 'Save changes' : 'Add'}</button></form>}
    <ul className="list">{items.map(i => <li key={i._id}><div><b>{i[cfg.title]}</b><small>{k === 'messages' ? `${i.email}: ${i.text}` : cfg.fields.slice(1).map(f => i[f]).join(' | ')}</small></div>
      <span>{cfg.fields.length > 0 && <button onClick={() => { setEditId(i._id); setForm(i); }}>Edit</button>}<button onClick={() => del(i._id)}>Delete</button></span></li>)}</ul>
    {!items.length && <p className="empty">Nothing here yet.</p>}
  </>);
}

function Upload({ value, onChange }) {
  const [msg, setMsg] = useState('');
  const pick = async (e) => {
    const file = e.target.files[0]; if (!file) return; setMsg('Uploading...');
    try { const { url } = await upload(file); onChange(url); setMsg('Uploaded'); } catch (x) { setMsg(x.message); }
  };
  return <label className="up">{value ? <img src={value} alt="" /> : <span>Choose image</span>}<input type="file" accept="image/*" onChange={pick} /><small>{msg}</small></label>;
}
