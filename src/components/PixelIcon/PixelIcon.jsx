const paths = {
  close: 'M1 1h2v2h2v2h2V3h2V1h2v2H9v2H7v2h2v2h2v2H9V9H7V7H5v2H3v2H1V9h2V7h2V5H3V3H1z',
  play: 'M3 1h2v2h2v2h2v2H7v2H5v2H3z',
  pause: 'M2 1h3v10H2zM7 1h3v10H7z',
  sound: 'M1 4h3V2h2v8H4V8H1zM8 3h1v6H8zM10 1h1v10h-1z',
  heart: 'M1 2h3v1h1V2h3v1h2v4H8v2H6v2H4V9H2V7H0V3h1z',
  sparkle: 'M5 0h2v4h2v1h3v2H9v1H7v4H5V8H3V7H0V5h3V4h2z',
  note: 'M5 1h6v2H7v6H5v2H1V9H0V7h1V6h4z',
};
export default function PixelIcon({ type = 'sparkle', className = '' }) {
  return <svg className={`pixel-icon ${className}`} viewBox="0 0 12 12" aria-hidden="true" focusable="false" shapeRendering="crispEdges"><path d={paths[type] || paths.sparkle} fill="currentColor" /></svg>;
}
