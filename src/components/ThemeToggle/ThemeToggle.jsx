import { useLayoutEffect, useState } from 'react';

const storageKey = 'mind-junk-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light'; }
    catch { return 'light'; }
  });
  const dark = theme === 'dark';
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(storageKey, theme); } catch { /* Theme still works when storage is unavailable. */ }
  }, [theme]);
  return <button className="theme-toggle" type="button" aria-label="Dark mode" aria-pressed={dark} title={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setTheme(dark ? 'light' : 'dark')}>
    <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" shapeRendering="crispEdges" fill="currentColor">
      {dark ? <path d="M7 1h3v2H8v3h2v2h3V6h2v5h-2v2h-2v2H5v-2H3v-2H1V5h2V3h4z" /> : <path d="M7 0h2v3H7zM7 13h2v3H7zM0 7h3v2H0zM13 7h3v2h-3zM2 2h2v2H2zM12 2h2v2h-2zM2 12h2v2H2zM12 12h2v2h-2zM6 4h4v2h2v4h-2v2H6v-2H4V6h2z" />}
    </svg>
  </button>;
}
