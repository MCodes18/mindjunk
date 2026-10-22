import { useEffect, useState } from "react";
import { HashRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Desktop from "./components/Desktop/Desktop";
import Window from "./components/Window/Window";
import DesktopIcon from "./components/DesktopIcon/DesktopIcon";
import Taskbar from "./components/Taskbar/Taskbar";
import AppPage from "./components/AppPage/AppPage";
import ContactForm from "./components/ContactForm/ContactForm";
import Captures from "./pages/Captures";
import MindJunk from "./pages/MindJunk";
import About from "./pages/About";
import { applications } from "./data/applications";
import MusicPlayer from "./components/MusicPlayer/MusicPlayer";
import QuoteNote from "./components/QuoteNote/QuoteNote";
import Doodle from "./components/Doodle/Doodle";

function Home({ openApp, welcomeOpen, setWelcomeOpen }) {
  return <Desktop>
    <div className="desktop-workspace">
      <nav className="desktop-icons" aria-label="Applications">{applications.map(app => <DesktopIcon key={app.id} {...app} onClick={() => openApp(app.id)} />)}</nav>
      <div className="desktop-arrangement">
        {welcomeOpen ? <Window title="welcome.txt" onClose={() => setWelcomeOpen(false)}>
          <Doodle kind="orbit" className="welcome-doodle" /><h1 className="welcome-title">MS OS v1.0</h1>
          <p>Welcome to my little corner of the internet!</p>
          <p>Click any of the icons on the left to explore more.</p>
        </Window> : <button className="ui-button reopen" onClick={() => setWelcomeOpen(true)}>welcome.txt</button>}
      </div>
    </div>
    <QuoteNote />
  </Desktop>;
}
function currentApplication() {
  const path = window.location.hash.slice(1) || '/';
  const id = path.split('/')[1]?.split('?')[0];
  return applications.some(app => app.id === id) ? { [id]: path } : {};
}
function Shell() {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const activePage = pathname.split('/')[1] || 'desktop';
  const app = applications.find(item => item.id === activePage);
  const [opened, setOpened] = useState(currentApplication);
  const [welcomeOpen, setWelcomeOpen] = useState(true);
  const [contactDraft, setContactDraft] = useState({from_email:'', message:''});
  // Also register apps reached through a direct link or browser Back/Forward.
  useEffect(() => {
    const syncOpened = () => setOpened(previous => ({...previous, ...currentApplication()}));
    window.addEventListener('hashchange', syncOpened);
    return () => window.removeEventListener('hashchange', syncOpened);
  }, []);
  useEffect(() => { document.title = `${app?.label || 'Home'} · Mind Junk`; }, [app]);
  const openPaths = app ? {...opened, [activePage]: pathname + search} : opened;
  function openApp(id) {
    const path = openPaths[id] || `/${id}`;
    setOpened(previous => ({...previous, ...openPaths, [id]:path}));
    navigate(path);
  }
  function goHome() {
    setOpened(openPaths);
    navigate('/');
  }
  function closeApp() {
    setOpened(previous => Object.fromEntries(Object.entries(previous).filter(([id]) => id !== activePage)));
    if (activePage === 'contact') setContactDraft({from_email:'', message:''});
    navigate('/');
  }
  return <>
    <button className="skip-link" onClick={() => document.getElementById('main')?.focus()}>Skip to content</button>
    {pathname === '/' ? <main id="main" tabIndex={-1}><Home openApp={openApp} welcomeOpen={welcomeOpen} setWelcomeOpen={setWelcomeOpen} /></main> : <AppPage key={activePage} title={app?.filename || 'not-found.txt'} goHome={closeApp}>
      <Routes>
        <Route path="/mindjunk/*" element={<MindJunk />} />
        <Route path="/about" element={<About />} />
        <Route path="/captures" element={<Captures />} />
        <Route path="/captures/:year" element={<Captures />} />
        <Route path="/contact" element={<ContactForm form={contactDraft} setForm={setContactDraft} />} />
        <Route path="*" element={<div className="empty-state"><h1>404</h1><button className="ui-button" onClick={goHome}>Return to desktop</button></div>} />
      </Routes>
    </AppPage>}
    <MusicPlayer visible={pathname === '/'} />
    <Taskbar activePage={activePage} openedIds={Object.keys(openPaths)} goHome={goHome} openApp={openApp} />
  </>;
}
export default function App() { return <HashRouter><Shell /></HashRouter>; }
