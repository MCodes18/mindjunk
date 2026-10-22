import './Polaroid.css';

// Stable for numeric or string IDs; no random values change during a render.
export default function Polaroid({ id, image, title, place, year, date, description, tilt, tape: tapeOverride, doodle: doodleOverride, onClick }) {
  const seed = typeof id === 'number' ? Math.abs(id) : [...String(id)].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 0);
  const colors = ['green','pink','yellow'];
  const tape = tapeOverride || ['left','right','double'][seed % 3];
  const doodle = doodleOverride || ['heart','sparkle','flower','star','none'][seed % 5];
  return <button className="polaroid" onClick={onClick} aria-label={`Open photograph: ${title}`} style={{'--tilt': `${tilt ?? (seed % 7 - 3)}deg`}}>
    <span className="tape-container" aria-hidden="true">
      {(tape === 'left' || tape === 'double') && <span className={`tape tape-left ${colors[seed % 3]}`} style={{transform:`rotate(-${6 + seed % 4}deg)`}} />}
      {(tape === 'right' || tape === 'double') && <span className={`tape tape-right ${colors[(seed + 1) % 3]}`} style={{transform:`rotate(${6 + seed % 4}deg)`}} />}
    </span>
    <img src={image} alt="" loading="lazy" />
    {doodle !== 'none' && <span aria-hidden="true" className={`doodle ${doodle}`} />}
    <span className="polaroid-caption"><span className="polaroid-title">{title}</span>{(place || date || year) && <span className="meta">{[place, date || year].filter(Boolean).join(' · ')}</span>}{description && <span className="description">{description}</span>}</span>
  </button>;
}