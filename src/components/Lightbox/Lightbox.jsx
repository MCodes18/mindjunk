import { useEffect, useRef } from 'react';
import './Lightbox.css';

export default function Lightbox({ photos, index, onChange, onClose }) {
  const dialog = useRef(null);
  const photo = photos[index];
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    element.showModal();
    return () => { element.close(); if (previousFocus?.isConnected) previousFocus.focus(); };
  }, []);
  function step(direction) { onChange((index + direction + photos.length) % photos.length); }
  return <dialog ref={dialog} className="lightbox" aria-labelledby="photo-title" onCancel={onClose}
    onClick={event => { if (event.target === dialog.current) { const r = dialog.current.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) onClose(); } }}
    onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1); } }}>
    <div className="lightbox-bar"><span>captures / {photo.year} / {String(index + 1).padStart(2, '0')}</span><button className="close-button" aria-label="Close photograph" onClick={onClose} autoFocus>×</button></div>
    <div className="lightbox-body">
      <div className="lightbox-image"><span className="lightbox-tape" aria-hidden="true" /><img src={photo.image} alt={photo.title} /></div>
      <div className="lightbox-caption" aria-live="polite"><h2 id="photo-title">{photo.title}</h2><p className="meta">{[photo.place, photo.date || photo.year].filter(Boolean).join(' · ')}</p>{photo.description && <p>{photo.description}</p>}</div>
    </div>
    <div className="lightbox-controls"><button className="ui-button" onClick={() => step(-1)} disabled={photos.length < 2} aria-label="Previous photograph">← Previous</button><span className="tiny">{index + 1} / {photos.length}</span><button className="ui-button" onClick={() => step(1)} disabled={photos.length < 2} aria-label="Next photograph">Next →</button></div>
  </dialog>;
}