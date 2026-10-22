# Edit the desktop

## Change the song
Edit song.txt. Use three lines:
1. Public Spotify track or YouTube video URL
2. Song title (optional)
3. Artist (optional)

Spotify tracks use the official embedded player. Visitors click Play themselves; the site does not connect to your Spotify account. Spotify receives requests when the iframe loads and controls whether a full track or preview is available. An external track link is also provided. YouTube Music track links (music.youtube.com/watch?v=...), normal YouTube watch links and youtu.be links automatically use the privacy-enhanced YouTube video player in the same frame. It is slightly taller to fit its controls; it does not autoplay. Playlist-only links are not supported. Some tracks disallow embedding; use Open track in that case. YouTube receives the site origin for player verification, but not the full page path or query.
Sharing/tracking parameters are stripped from the link.

For a local audio file you own, put it in public/music and replace the first line with /music/your-song.mp3. This enables local play/pause/seek/volume controls. Audio starts only after Play is clicked.

## Change the quote
Write the quote in quote.txt. Add attribution on the last line if wanted.
Line breaks are preserved. Leave blank for an empty note.
The text is displayed exactly as written; nothing is generated.

Vite updates automatically in development. Rebuild and redeploy to update what everyone sees on a published site.
