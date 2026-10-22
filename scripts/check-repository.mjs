import { execFileSync } from 'node:child_process';
import { assertPublishablePath, assertNoObviousSecrets, raster, sanitizeImage } from './security.mjs';

// Read the Git index, not working-tree files, so partially staged changes are checked.
const staged = process.argv.includes('--staged');
const args = staged ? ['diff','--cached','--name-only','--diff-filter=ACMR','-z'] : ['ls-files','-z'];
let files;
try { files=execFileSync('git',args,{encoding:'utf8'}).split('\0').filter(Boolean); }
catch { console.error('Repository check needs an initialized Git repository.'); process.exit(1); }
let failed=false;
for (const file of files) {
  try {
    if (file !== '.env.example') assertPublishablePath(file);
    if (/^(?:dist|dist-ssr)\//.test(file)) throw new Error('Build output must not be committed to the source repository.');
    const bytes=execFileSync('git',['show',':'+file],{maxBuffer:100*1024*1024});
    if (raster.test(file)) {
      if (await sanitizeImage(bytes)) throw new Error('Photo metadata found. Run npm run sanitize:images and stage the cleaned photo again.');
    } else if (!bytes.includes(0)) assertNoObviousSecrets(bytes.toString('utf8'));
  } catch (error) {
    failed=true;
    // Errors from Git may contain file content; only show our known safety errors.
    console.error(`Blocked file ${JSON.stringify(file)}: ${error.status !== undefined ? 'Unable to inspect staged content.' : error.message}`);
  }
}
if (failed) process.exit(1);
console.log(`Repository safety check passed for ${files.length} ${staged?'staged':'tracked'} file(s).`);
