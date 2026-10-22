import { Link } from 'react-router-dom';
import './Folder.css';

export default function Folder({ to, label, count, noun, image, previewText, color = 0 }) {
  const countLabel = count === 1 ? noun.replace(/s$/, '') : noun;
  return <Link className={`year-folder folder-color-${color % 3}`} to={to} aria-label={`${label}, ${count} ${countLabel}`}>
    <span className="folder-tab" aria-hidden="true" />
    <div className="folder-preview" aria-hidden="true">{image ? <img src={image} alt="" /> : <><span className="folder-paper-title">{previewText}</span><span className="folder-paper-lines" /></>}</div>
    <div className="folder-front"><strong>{label}</strong><span>{count} {countLabel}<span aria-hidden="true">↗</span></span></div>
  </Link>;
}
