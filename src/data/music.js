import source from '../content/desktop/song.txt?raw';
const lines = source.trim().split(/\r?\n/).map(line=>line.trim());
export const favoriteTrack = {
  url: lines[0]?.startsWith('https://') ? lines[0] : '',
  audioSrc: /^\/music\/[\w ./%-]+\.(mp3|wav|ogg|m4a)$/i.test(lines[0] || '') ? lines[0] : '',
  title: lines[1] || '',
  artist: lines[2] || '',
};
