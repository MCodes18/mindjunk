import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
if (!fs.existsSync('.git')) {
  console.log('No Git repository yet. After git init, run npm run setup:hooks before your first commit.');
} else {
  let existing='';
  try { existing=execFileSync('git',['config','--local','--get','core.hooksPath'],{encoding:'utf8'}).trim(); } catch { /* Unset is normal. */ }
  if (existing && existing !== '.githooks') throw new Error('An existing hooksPath is configured; integrate the security hook there instead of replacing it.');
  execFileSync('git',['config','--local','core.hooksPath','.githooks']);
  fs.chmodSync('.githooks/pre-commit',0o755);
  console.log('Repository-local safety hook enabled.');
}
