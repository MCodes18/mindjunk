import { useLayoutEffect, useRef, useState } from 'react';

// Spotify's compact player needs a stable viewport. Scale the whole frame on
// narrow screens instead of squeezing its internal layout or cropping controls.
export default function SpotifyEmbed({ src, title }) {
  const viewport = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const element = viewport.current;
    const update = () => setScale(Math.min(1, element.clientWidth / 320));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={viewport} className="spotify-viewport" style={{height:160 * scale}}>
    <iframe title={title} src={src} width="320" height="160"
      scrolling="no" loading="lazy" referrerPolicy="no-referrer"
      allow="encrypted-media; fullscreen; picture-in-picture"
      style={{transform:`scale(${scale})`}} />
  </div>;
}
