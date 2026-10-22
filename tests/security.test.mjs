import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { assertPublishablePath, assertNoObviousSecrets, validatePublicEnv, sanitizeImage } from '../scripts/security.mjs';

test('publication rejects private files and unexpected public environment keys',()=>{
  for (const file of ['.env','nested/.env.production','private/photo.jpg','secret.pem','assets/app.js.map']) {
    assert.throws(()=>assertPublishablePath(file));
  }
  assert.doesNotThrow(()=>assertPublishablePath('assets/photo.jpg'));
  assert.throws(()=>validatePublicEnv({VITE_PRIVATE_KEY:'not-a-real-key'}));
  assert.doesNotThrow(()=>validatePublicEnv({VITE_EMAILJS_PUBLIC_KEY:'public-id'}));
});
test('obvious credential detection stops output without echoing the value',()=>{
  const credential='ghp_'+'a'.repeat(36);
  assert.throws(()=>assertNoObviousSecrets(credential),error=>!error.message.includes(credential));
  assert.doesNotThrow(()=>assertNoObviousSecrets('A normal article about API keys.'));
});
test('published images lose EXIF metadata while keeping orientation and dimensions',async()=>{
  const image=await sharp({create:{width:12,height:8,channels:3,background:'#f2b5d6'}})
    .jpeg().withMetadata({orientation:6}).withExifMerge({IFD0:{Artist:'Private test author'}}).toBuffer();
  assert.ok((await sharp(image).metadata()).exif);
  const cleaned=await sanitizeImage(image);
  const meta=await sharp(cleaned).metadata();
  assert.equal(meta.exif,undefined);
  assert.equal(meta.xmp,undefined);
  assert.equal(meta.iptc,undefined);
  assert.equal(meta.width,8);
  assert.equal(meta.height,12);
});
