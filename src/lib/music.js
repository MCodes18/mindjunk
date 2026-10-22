// Validate and strip sharing/tracking parameters from public song links.
export function musicLink(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return null;
    if (parsed.hostname === 'open.spotify.com') {
      const id = parsed.pathname.match(/^\/(?:intl-[a-z]+\/)?track\/([a-zA-Z0-9]+)\/?$/)?.[1];
      return id ? {type:'Spotify',url:`https://open.spotify.com/track/${id}`} : null;
    }
    const video = parsed.hostname === 'youtu.be' ? parsed.pathname.slice(1) : ['www.youtube.com','youtube.com','m.youtube.com','music.youtube.com'].includes(parsed.hostname) && parsed.pathname === '/watch' ? parsed.searchParams.get('v') : '';
    return /^[a-zA-Z0-9_-]{11}$/.test(video || '') ? {type:'YouTube',url:`https://www.youtube.com/watch?v=${video}`} : null;
  } catch { return null; }
}
export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`;
}

export function spotifyEmbed(url) {
  const link = musicLink(url);
  return link?.type === 'Spotify' ? link.url.replace('/track/', '/embed/track/') + '?theme=0' : null;
}

export function youtubeEmbed(url, siteOrigin) {
  const link = musicLink(url);
  if (link?.type !== 'YouTube') return null;
  const id = new URL(link.url).searchParams.get('v');
  const embed = new URL(`https://www.youtube-nocookie.com/embed/${id}?autoplay=0&playsinline=1&rel=0`);
  // Identify the actual embedding site, without sending its path or query string.
  // Works for both local development and a future GitHub Pages domain.
  if (siteOrigin) {
    try {
      const origin = new URL(siteOrigin);
      if (['http:', 'https:'].includes(origin.protocol)) embed.searchParams.set('origin', origin.origin);
    } catch { /* Invalid origins must not prevent rendering the player. */ }
  }
  return embed.href;
}
