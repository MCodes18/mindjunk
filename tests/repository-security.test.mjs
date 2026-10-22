import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import sharp from 'sharp';
import { sanitizeImage } from '../scripts/security.mjs';

test('repository guard checks staged bytes, including photos and private files',async()=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'mind-junk-security-'));
  const script=fileURLToPath(new URL('../scripts/check-repository.mjs',import.meta.url));
  const git=(...args)=>execFileSync('git',args,{cwd:directory,stdio:'pipe'});
  const check=()=>spawnSync(process.execPath,[script,'--staged'],{cwd:directory,encoding:'utf8'});
  try {
    git('init','--quiet');
    const original=await sharp({create:{width:4,height:6,channels:3,background:'pink'}}).jpeg().withMetadata().toBuffer();
    fs.writeFileSync(path.join(directory,'photo.jpg'),original);
    git('add','photo.jpg');
    // A clean working copy must not hide an unsafe staged copy.
    fs.writeFileSync(path.join(directory,'photo.jpg'),await sanitizeImage(original));
    assert.equal(check().status,1);
    git('add','photo.jpg');
    assert.equal(check().status,0);
    fs.writeFileSync(path.join(directory,'.env'),'EXAMPLE=not-a-real-secret');
    git('add','.env');
    assert.equal(check().status,1);
    git('rm','--cached','.env');
    fs.writeFileSync(path.join(directory,'article.txt'),'ghp_'+'a'.repeat(36));
    git('add','article.txt');
    const blocked=check();
    assert.equal(blocked.status,1);
    assert.ok(!blocked.stderr.includes('a'.repeat(36)));
  } finally {
    const resolved=path.resolve(directory);
    if (path.dirname(resolved) === path.resolve(os.tmpdir()) && path.basename(resolved).startsWith('mind-junk-security-')) fs.rmSync(resolved,{recursive:true,force:true});
  }
});
