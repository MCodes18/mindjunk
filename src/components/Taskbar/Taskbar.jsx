import './Taskbar.css';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { useEffect, useRef, useState } from 'react';
import { applications } from '../../data/applications';

export default function Taskbar({ activePage, openedIds, goHome, openApp }) {
  const [time, setTime] = useState(new Date());
  const activeButton = useRef(null);
  useEffect(() => { activeButton.current?.scrollIntoView({block:'nearest',inline:'nearest'}); }, [activePage, openedIds.length]);
  useEffect(() => { const timer = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(timer); }, []);
  return <footer className="taskbar">
    <button className="start-button" onClick={goHome} aria-label="MS OS desktop" aria-current={activePage === 'desktop' ? 'page' : undefined}><span aria-hidden="true">✳</span> MS OS</button>
    <nav className="taskbar-apps" aria-label="Open applications">{openedIds.map(id => {
      const app = applications.find(item => item.id === id);
      return app && <button ref={activePage === id ? activeButton : null} key={id} className={`taskbar-app ${activePage === id ? 'active' : ''}`} aria-label={app.label} aria-current={activePage === id ? 'page' : undefined} onClick={() => openApp(id)}><img src={app.icon} alt="" /><span>{app.label}</span></button>;
    })}</nav>
    <ThemeToggle />
    <time className="taskbar-time" dateTime={time.toISOString()}>{time.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</time>
  </footer>;
}
