import { captureFromFile, sortYears } from '../lib/content';

// Optional metadata for the original photos. New images need no entry here.
const metadata = {
  'pink_bougainvillea.jpeg': {id:3, title:'Pink Bougainvillea', year:2026, date:'May, 2026', dateISO:'2026-05-01', description:'', place:'', tilt:-3},
  'neemflowers.jpg': {id:2, title:'New year, Neem flowers', year:2026, date:'April, 2026', dateISO:'2026-04-01', description:'Fresh neem flowers for Tamil New Year delicacy.', place:'', tilt:2},
  'musical_instruments.jpeg': {id:1, title:'Gramophone and Records', year:2026, date:'March, 2026', dateISO:'2026-03-01', description:'Nostalgia nestled in a corner of a busy road.', place:'', tilt:-1},
};
const images = import.meta.glob('../assets/captures/**/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP,avif,AVIF}', {query:'?url', import:'default', eager:true});
const captures = Object.entries(images).map(([path,image]) => ({
  ...captureFromFile(path,image),
  ...(metadata[path.replace('../assets/captures/','')] || {}),
}));
const years = sortYears([...new Set(captures.map(photo=>photo.year))]);
captures.sort((a,b)=>years.indexOf(a.year)-years.indexOf(b.year) || (b.dateISO || '').localeCompare(a.dateISO || '') || a.title.localeCompare(b.title));
export default captures;
