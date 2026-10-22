import fs from 'node:fs';
import path from 'node:path';
import { walk, raster, sanitizeImage } from './security.mjs';
let changed=0;
for (const file of [...walk('src/assets'),...walk('src/content/articles'),...walk('public')].filter(file=>raster.test(file))) {
  const original=fs.readFileSync(file);
  const cleaned=await sanitizeImage(original);
  if (!cleaned) continue;
  const backup=path.join('private','original-images',file);
  fs.mkdirSync(path.dirname(backup),{recursive:true});
  if (!fs.existsSync(backup)) fs.writeFileSync(backup,original);
  fs.writeFileSync(file,cleaned);
  changed++;
}
console.log(`Sanitized ${changed} image(s). Any originals are kept under ignored private/original-images; never publish that folder.`);
