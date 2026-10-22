import { test } from 'node:test';
import assert from 'node:assert/strict';
import { musicLink, spotifyEmbed, youtubeEmbed, formatTime } from '../src/lib/music.js';
import { readFileSync } from 'node:fs';

test('public track links discard sharing parameters', () => {
  const result=musicLink('https://open.spotify.com/track/5kXQonydZs5fvADebzKVaR?si=example');
  assert.equal(result.url,'https://open.spotify.com/track/5kXQonydZs5fvADebzKVaR');
  assert.equal(result.type,'Spotify');
  assert.ok(!result.url.includes('embed'));
});
test('changed links and international Spotify URLs are supported',()=>{
  assert.equal(musicLink('https://open.spotify.com/intl-en/track/abc123').url,'https://open.spotify.com/track/abc123');
  assert.equal(musicLink('https://youtu.be/abcdefghijk').url,'https://www.youtube.com/watch?v=abcdefghijk');
});
test('invalid music destinations are rejected',()=>{
  assert.equal(musicLink('javascript:alert(1)'),null);
  assert.equal(musicLink('https://evil.test/track/abc'),null);
  assert.equal(musicLink('not a url'),null);
});
test('embeds accept only validated Spotify track links and discard extra parameters',()=>{
  assert.equal(spotifyEmbed('https://open.spotify.com/track/abc123?si=tracking&autoplay=1'), 'https://open.spotify.com/embed/track/abc123?theme=0');
  assert.equal(spotifyEmbed('https://evil.test/track/abc123'),null);
  assert.equal(spotifyEmbed('javascript:alert(1)'),null);
  assert.equal(spotifyEmbed('https://youtu.be/abcdefghijk'),null);
  const component=readFileSync(new URL('../src/components/MusicPlayer/SpotifyEmbed.jsx',import.meta.url),'utf8');
  assert.ok(!component.includes('autoPlay'));
  assert.ok(component.includes('referrerPolicy="no-referrer"'));
});
test('audio timestamps remain valid before metadata loads',()=>{
  assert.equal(formatTime(NaN),'0:00');
  assert.equal(formatTime(125),'2:05');
});

test('YouTube Music and shared video links embed safely without autoplay',()=>{
  for (const url of [
    'https://music.youtube.com/watch?v=abcdefghijk&si=tracking&list=private-list',
    'https://www.youtube.com/watch?v=abcdefghijk&autoplay=1',
    'https://youtu.be/abcdefghijk?si=tracking'
  ]) assert.equal(youtubeEmbed(url),'https://www.youtube-nocookie.com/embed/abcdefghijk?autoplay=0&playsinline=1&rel=0');
  for (const url of [
    'https://music.youtube.com.evil.test/watch?v=abcdefghijk',
    'https://music.youtube.com/playlist?list=private-list',
    'https://youtube.com/watch?v=bad',
    'javascript:alert(1)'
  ]) assert.equal(youtubeEmbed(url),null);
});

test('YouTube identifies the embedding site without leaking page details or enabling autoplay',()=>{
  const song='https://music.youtube.com/watch?v=JBnMEwfIUS8&list=RDAMVMJBnMEwfIUS8';
  for (const site of ['http://localhost:5173/private?token=example', 'https://example.github.io/mind-junk/']) {
    const embed=new URL(youtubeEmbed(song,site));
    assert.equal(embed.searchParams.get('origin'),new URL(site).origin);
    assert.equal(embed.searchParams.get('autoplay'),'0');
    assert.equal(embed.hostname,'www.youtube-nocookie.com');
    assert.ok(!embed.href.includes('token'));
    assert.ok(!embed.href.includes('list='));
  }
  for (const site of ['null','file:///private/file','javascript:alert(1)']) {
    assert.equal(new URL(youtubeEmbed(song,site)).searchParams.has('origin'),false);
  }
});

test('YouTube API runs in a separate player document with a narrow policy',()=>{
  const html=readFileSync(new URL('../public/youtube-player.html',import.meta.url),'utf8');
  const script=readFileSync(new URL('../public/youtube-player.js',import.meta.url),'utf8');
  assert.ok(html.includes('strict-origin-when-cross-origin'));
  assert.ok(html.includes("script-src 'self' https://www.youtube.com/iframe_api https://www.youtube.com/s/player/"));
  assert.ok(!html.includes('unsafe-inline'));
  assert.ok(script.includes('autoplay: 0'));
  assert.ok(!script.includes('.playVideo('));
  assert.ok(script.includes('https://www.youtube-nocookie.com'));
  assert.ok(script.includes('origin: location.origin'));
});
