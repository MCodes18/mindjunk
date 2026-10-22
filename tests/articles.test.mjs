import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseArticle, sortArticles, captureFromFile, sortYears, validDate } from '../src/lib/content.js';
import { searchArticles } from '../src/lib/articleSearch.js';

test('a Markdown file supplies title, body, date and archive year', () => {
  const result = parseArticle('# My title\r\n\r\nFirst paragraph.\r\n\r\nSecond paragraph.', '2026-09-26-my-title.md');
  assert.equal(result.title,'My title');
  assert.equal(result.date,'2026-09-26');
  assert.equal(result.year,'2026');
  assert.equal(result.body,'First paragraph.\n\nSecond paragraph.');
  assert.equal(result.id,parseArticle('New content','2026-09-26-my-title.md').id);
});
test('optional metadata does not leak into the body', () => {
  const result = parseArticle('---\nTitle: Explicit title\nDate: 2025-03-02\nSummary: Short summary\n---\n\nText with <script> kept as text.', 'file.md');
  assert.equal(result.title,'Explicit title');
  assert.equal(result.date,'2025-03-02');
  assert.equal(result.excerpt,'Short summary');
  assert.equal(result.body,'Text with <script> kept as text.');
});
test('blank, undated and invalid calendar dates are handled predictably', () => {
  assert.equal(parseArticle('   ','empty.md'),null);
  assert.equal(parseArticle('Title\n\nText','file.md').year,'Undated');
  assert.equal(validDate('2026-02-30'),'');
  assert.equal(validDate('2024-02-29'),'2024-02-29');
  assert.equal(validDate('2026-09-26'),'2026-09-26');
});
test('article order defines newer on the left and older on the right', () => {
  const entries = ['2024-01-01','2026-01-01','2025-01-01'].map(date=>parseArticle(date+'\n\nText',date+'.md'));
  const ordered = sortArticles(entries);
  const currentIndex = 1;
  assert.equal(ordered[currentIndex-1].date,'2026-01-01');
  assert.equal(ordered[currentIndex+1].date,'2024-01-01');
});
test('search matches related concepts, body text, prefixes and typos', () => {
  const entries = [
    {id:'1',title:'A journey',excerpt:'',body:'A train crossed the valley.'},
    {id:'2',title:'Reading',excerpt:'',body:'A novel on the shelf.'},
    {id:'3',title:'Flowers',excerpt:'',body:'Bougainvillea in the garden.'},
  ];
  assert.deepEqual(searchArticles(entries,'vacation').map(a=>a.id),['1']);
  assert.deepEqual(searchArticles(entries,'valley').map(a=>a.id),['1']);
  assert.deepEqual(searchArticles(entries,'novle').map(a=>a.id),['2']);
  assert.deepEqual(searchArticles(entries,'boug').map(a=>a.id),['3']);
  assert.deepEqual(searchArticles(entries,'quantum'),[]);
  assert.deepEqual(searchArticles(entries,''),entries);
});
test('new capture files supply metadata without editing a data array', () => {
  const photo = captureFromFile('../assets/captures/2026/2026-09-26-a-new-photo.PNG','/asset.png');
  assert.equal(photo.title,'A new photo');
  assert.equal(photo.year,2026);
  assert.equal(photo.image,'/asset.png');
  assert.equal(captureFromFile('../assets/captures/2025/holiday.png','/asset.png').year,2025);
  assert.equal(captureFromFile('../assets/captures/holiday.png','/asset.png').year,'Undated');
  assert.deepEqual(sortYears(['Undated',2024,2026,2025]),[2026,2025,2024,'Undated']);
});
import { articleImageUrl } from '../src/lib/content.js';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';

test('Markdown keeps heading-free text and extracts a leading title',()=>{
  const a=parseArticle('# My title\n\n## Section\n\n**Hello** [world](https://example.com).','2026-10-16-post.md');
  assert.equal(a.title,'My title');
  assert.equal(a.excerpt,'Section Hello world.');
  assert.equal(parseArticle('First paragraph.\n\nSecond paragraph.','post.md').body,'First paragraph.\n\nSecond paragraph.');
});
test('article images resolve relative to nested articles and reject unbundled sources',()=>{
  const images={'../content/articles/trip/images/photo.png':'/assets/photo-hash.png'};
  const path='../content/articles/trip/2026-10-16-trip.md';
  assert.equal(articleImageUrl('./images/photo.png',path,images),'/assets/photo-hash.png');
  for(const src of ['https://evil.test/photo.png','data:image/png;base64,abc','/private/photo.png','../../../../private/photo.png','./missing.png']) assert.equal(articleImageUrl(src,path,images),'');
});
test('Markdown renders formatting without executing HTML or unsafe links',()=>{
  const html=renderToStaticMarkup(createElement(ReactMarkdown,{skipHtml:true},'## Heading\n\n**Bold**\n\n- Item\n\n<script>alert(1)</script>\n\n[bad](javascript:alert%281%29)'));
  assert.ok(html.includes('<h2>Heading</h2>'));
  assert.ok(html.includes('<strong>Bold</strong>'));
  assert.ok(html.includes('<li>Item</li>'));
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('javascript:'));
});
