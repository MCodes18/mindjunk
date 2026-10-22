import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

export const policy = "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src https://api.emailjs.com; media-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'self' https://open.spotify.com https://www.youtube-nocookie.com";
const allowedEnv = new Set(['VITE_EMAILJS_SERVICE_ID','VITE_EMAILJS_TEMPLATE_ID','VITE_EMAILJS_PUBLIC_KEY']);
export function validatePublicEnv(env) {
  const unexpected = Object.keys(env).filter(key => key.startsWith('VITE_') && !allowedEnv.has(key));
  if (unexpected.length) throw new Error('Unreviewed public VITE_ environment variables. Only the three EmailJS client identifiers may be bundled.');
}
export function assertPublishablePath(file) {
  if (/(^|[/\\])(?:\.env(?:\.[^/\\]+)?|\.git|private|node_modules)(?:[/\\]|$)|\.(?:pem|key|p12|pfx|map|bak|sql|sqlite)$/i.test(file)) {
    throw new Error('Potential private file in publish directory. Remove it before building.');
  }
}
export function assertNoObviousSecrets(text) {
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bAKIA[0-9A-Z]{16}\b|\bgh[pousr]_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{40,}\b|\bsk_live_[A-Za-z0-9]{20,}\b/.test(text)) {
    throw new Error('Possible private credential detected. Build stopped; no value was logged.');
  }
}
export function walk(directory) {
  return fs.existsSync(directory) ? fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry => {
    const file=path.join(directory,entry.name);
    if (entry.isSymbolicLink()) throw new Error('Symlinks in published content are not allowed.');
    return entry.isDirectory() ? walk(file) : [file];
  }) : [];
}
export const raster = /\.(?:png|jpe?g|webp|avif)$/i;
export async function sanitizeImage(input) {
  const metadata=await sharp(input).metadata();
  const hasPrivateMetadata=Boolean(metadata.exif || metadata.xmp || metadata.iptc || metadata.comments?.length);
  if (!hasPrivateMetadata) return null;
  // Apply EXIF orientation before removing metadata, preserving the displayed orientation.
  let pipeline=sharp(input).rotate();
  if (metadata.format === 'jpeg') pipeline=pipeline.jpeg({quality:95});
  if (metadata.format === 'webp') pipeline=pipeline.webp({lossless:true});
  if (metadata.format === 'avif') pipeline=pipeline.avif({lossless:true});
  const output=await pipeline.toBuffer();
  const result=await sharp(output).metadata();
  if (result.exif || result.xmp || result.iptc || result.comments?.length) throw new Error('Image metadata removal failed.');
  return output;
}
export function securityPlugin(env) {
  let publicDir;
  return {
    name:'publication-security',
    apply:'build',
    configResolved(config) { publicDir=config.publicDir; },
    async buildStart() {
      validatePublicEnv(env);
      for (const file of walk(publicDir)) {
        assertPublishablePath(path.relative(publicDir,file));
        if (raster.test(file)) {
          if (await sanitizeImage(fs.readFileSync(file))) throw new Error('Public image contains metadata. Run npm run sanitize:images first.');
        } else if (/\.(?:txt|json|html|js|css|svg)$/i.test(file)) assertNoObviousSecrets(fs.readFileSync(file,'utf8'));
      }
    },
    transformIndexHtml: {
      order:'post',
      handler() { return [
        {tag:'meta',attrs:{'http-equiv':'Content-Security-Policy',content:policy},injectTo:'head-prepend'},
        {tag:'meta',attrs:{name:'referrer',content:'no-referrer'},injectTo:'head-prepend'}
      ]; }
    },
    async generateBundle(_,bundle) {
      for (const asset of Object.values(bundle)) {
        assertPublishablePath(asset.fileName);
        if (asset.type === 'chunk') assertNoObviousSecrets(asset.code);
        else if (raster.test(asset.fileName)) {
          const sanitized=await sanitizeImage(asset.source);
          if (sanitized) asset.source=sanitized;
        } else if (typeof asset.source === 'string') assertNoObviousSecrets(asset.source);
      }
    }
  };
}
