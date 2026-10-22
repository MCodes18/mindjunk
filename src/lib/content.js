export function validDate(value = '') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
  const parsed = new Date(value + 'T12:00:00Z');
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0,10) === value ? value : '';
}

export function fileDetails(path) {
  const normalized = path.replaceAll('\\', '/');
  const name = normalized.split('/').pop().replace(/\.[^.]+$/, '');
  const date = validDate(name.match(/^\d{4}-\d{2}-\d{2}/)?.[0]);
  const title = name.replace(/^\d{4}-\d{2}-\d{2}[-_ ]*/, '').replace(/[-_]+/g, ' ').trim() || name;
  return { name, date, title: title.charAt(0).toUpperCase() + title.slice(1) };
}

function stableId(path) {
  return [...path].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 0).toString(36);
}

export function parseArticle(source, path) {
  const raw = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim();
  if (!raw) return null;
  const file = fileDetails(path);
  const header = raw.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  const metadata = {};
  if (header) {
    for (const line of header[1].split('\n')) {
      const match = line.match(/^([a-z]+):\s*(.*)$/i);
      if (match) metadata[match[1].toLowerCase()] = match[2].trim();
    }
  }
  const lines = (header ? raw.slice(header[0].length).trim() : raw).split('\n');
  const heading = lines[0]?.match(/^#\s+(.+?)(?:\s+#+)?$/);
  if (heading) lines.shift();
  const title = metadata.title || heading?.[1] || file.title;
  const body = lines.join('\n').trim();
  const date = validDate(metadata.date) || file.date;
  const excerpt = metadata.summary || markdownText(body).slice(0,180);
  return {
    id: file.name.replace(/[^a-z0-9-]/gi,'-').toLowerCase() + '-' + stableId(path),
    title, date, body, excerpt, year: date ? date.slice(0,4) : 'Undated',
    filename: path.split('/').pop(), sourcePath: path,
  };
}

export function sortArticles(articles) {
  return [...articles].sort((a,b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title) || a.id.localeCompare(b.id));
}

export function captureFromFile(path, image) {
  const file = fileDetails(path);
  const folderYear = path.replaceAll('\\','/').match(/\/(\d{4})\//)?.[1];
  return {
    id: path, title: file.title, image, dateISO: file.date,
    year: file.date ? Number(file.date.slice(0,4)) : folderYear ? Number(folderYear) : 'Undated',
    date: file.date ? new Date(file.date + 'T12:00:00').toLocaleDateString('en', {day:'numeric',month:'long',year:'numeric'}) : '',
    place: '', description: '',
  };
}

export function sortYears(years) {
  return [...years].sort((a,b) => String(b).localeCompare(String(a), undefined, {numeric:true})).sort((a,b) => (a === 'Undated') - (b === 'Undated'));
}

export function markdownText(source) {
  return source.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]*>/g, '').replace(/[#*_`>~]/g, '').replace(/\s+/g, ' ').trim();
}

export function articleImageUrl(source, articlePath, images) {
  if (!source || /^(?:[a-z][a-z0-9+.-]*:|[\\/]|#)/i.test(source)) return '';
  try {
    const base = new URL(articlePath, 'https://article.invalid/src/data/');
    const resolved = new URL(source, base);
    if (resolved.origin !== base.origin || resolved.search || resolved.hash) return '';
    const key = '..' + decodeURIComponent(resolved.pathname).replace(/^\/src/, '');
    return Object.hasOwn(images, key) ? images[key] : '';
  } catch { return ''; }
}
