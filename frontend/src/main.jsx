import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout, Home, ProjectsPage, TeamPage, EventsPage, GalleryPage, ContactPage, SponsorsPage, AboutPage } from './Site.jsx';
import './styles.css';
class Boundary extends React.Component {
  state = { err: null };
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (!this.state.err) return this.props.children;
    return <div style={{ padding: 40, color: '#fff' }}><h2>Something went wrong</h2>
      <pre style={{ whiteSpace: 'pre-wrap', color: '#8fd0ff' }}>{String(this.state.err.stack || this.state.err)}</pre>
      <button className="btn" onClick={() => location.reload()}>Reload</button></div>;
  }
}
createRoot(document.getElementById('root')).render(
  <Boundary><BrowserRouter><Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} /><Route path="/projects" element={<ProjectsPage />} /><Route path="/team" element={<TeamPage />} />
      <Route path="/events" element={<EventsPage />} /><Route path="/gallery" element={<GalleryPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/sponsors" element={<SponsorsPage />} /><Route path="/about" element={<AboutPage />} />
    </Route>
  </Routes></BrowserRouter></Boundary>
);
