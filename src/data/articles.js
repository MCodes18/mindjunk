import { parseArticle, sortArticles } from '../lib/content';
const files = import.meta.glob(['../content/articles/**/*.md', '!../content/articles/**/README.md'], {query:'?raw', import:'default', eager:true});
const articles = sortArticles(Object.entries(files).map(([path,text]) => parseArticle(text,path)).filter(Boolean));
export default articles;

export const articleImages = import.meta.glob('../content/articles/**/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP,avif,AVIF}', {query:'?url', import:'default', eager:true});
