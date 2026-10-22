import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import captures from '../data/captures';
import { sortYears } from '../lib/content';
import Polaroid from '../components/Polaroid/Polaroid';
import Lightbox from '../components/Lightbox/Lightbox';
import Folder from '../components/Folder/Folder';
import './Captures.css';
import Doodle from '../components/Doodle/Doodle';

function Album({ photos, year }) {
  const [selected, setSelected] = useState(null);
  const groups = Array.from({ length: Math.ceil(photos.length / 3) }, (_, i) => photos.slice(i * 3, i * 3 + 3));
  return <>
    <div className="album-toolbar"><Link className="ui-button" to="/captures">← Back</Link><span className="tiny">{year} / {photos.length} photographs</span></div>
    {photos.length ? <div className="captures-list">{groups.map((group, groupIndex) => <div className="capture-cluster" key={group[0].id}>{group.map((photo, index) => <div className={`capture-wrapper position-${index}`} key={photo.id} style={{'--photo-x': `${photo.x || 0}px`, '--photo-y': `${photo.y || 0}px`}}><Polaroid {...photo} onClick={() => setSelected(groupIndex * 3 + index)} /></div>)}</div>)}</div> : <p role="status">No photographs.</p>}
    {selected !== null && <Lightbox photos={photos} index={selected} onChange={setSelected} onClose={() => setSelected(null)} />}
  </>;
}
export default function Captures() {
  const { year } = useParams();
  const years = sortYears([...new Set(captures.map(photo => photo.year))]);
  return <section className="captures-page">
    <header className="page-heading"><div><h1>Captures</h1><p>Snaps I'd like to preserve in an album.</p></div><Doodle kind="camera" /></header>
    {year ? <Album key={year} year={year} photos={captures.filter(photo => String(photo.year) === year)} /> : <div className="capture-folder-scene"><div className="year-folders">{years.map((item,i)=><Folder key={item} label={item} count={captures.filter(photo=>photo.year===item).length} noun="photographs" to={`/captures/${item}`} image={captures.find(photo=>photo.year===item).image} color={i} />)}</div></div>}
  </section>;
}
