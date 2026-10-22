# Mind Junk

React/Vite personal website.

## Run
- `npm install`
- `npm run dev`
- `npm run build` and `npm run preview`
- `npm run lint`
- `npm test`

## Add an article — no code edits

Save `.md` files in `src/content/articles/`, for example `2026-10-16-my-article.md`.
Start with `# My article title`, then a blank line and your Markdown text.
Add local images with `![Description](./images/my-photo.png)`; paths are relative to the article.
Headings, lists, links, quotes, bold, italics, and code blocks are supported. Raw HTML is disabled.

The filename supplies the date. Optional Title, Date, and Summary metadata is supported.
Year folders, postcards, search, and navigation are automatic: left goes newer, right goes older.
README.md files and .example templates are excluded; all other .md files are published.
See `src/content/articles/README.md` and `article-template.md.example` for instructions.

## Add photographs — no code edits

Put PNG/JPG/JPEG/WebP/AVIF images in `src/assets/captures/`, optionally under a year folder:

`src/assets/captures/2026/2026-09-26-my-photo.png`

Title comes from the filename; date comes from a YYYY-MM-DD prefix; otherwise the year comes from the folder. Files with neither go into Undated. Tape, doodles and rotation are automatic. The original photographs retain their existing captions and dates.

Optional custom titles, place, descriptions and tilt can be supplied in the metadata map in `src/data/captures.js`, keyed by the path relative to the captures folder.

See `src/assets/captures/README.md`.

## Publishing updates

Vite discovers content automatically in development. Rebuild and redeploy the site after adding files to update a published version. This is a static file workflow, not an upload form or CMS.

## Desktop behavior

The taskbar starts empty. Opening an application adds it. MS OS returns to the desktop while keeping applications open. Clicking a taskbar button restores that application's last route. The title-bar × closes the active application and removes it from the taskbar. Reloading starts a new session, with only the direct-linked app open.

The contact draft survives switching applications or returning to the desktop; closing Contact clears it. Welcome window visibility persists while switching applications.

## Content and contact

Original About text is in `src/data/about.js`. About and Contact use the original wording with functional interface labels only.

Contact uses the existing EmailJS integration. The local .env requires:
- VITE_EMAILJS_SERVICE_ID
- VITE_EMAILJS_TEMPLATE_ID
- VITE_EMAILJS_PUBLIC_KEY

These are public client configuration values. Never put private credentials in Vite variables. The template receives `from_email` and `message`. No live test email was sent.

## Implementation

Existing Desktop, Window, AppPage, Taskbar, Polaroid and ContactForm components remain. Folder is shared by Captures and Mind Junk. Content parsing is in `src/lib/content.js`; search is in `src/lib/articleSearch.js`. HashRouter supports static hosting without server rewrite rules.

The site includes keyboard navigation, focus indicators, native-dialog photo viewing and reduced-motion support.

## Change the desktop song and quote

Edit `src/content/desktop/song.txt`: line 1 is the public track URL, line 2 the title, and line 3 the artist. Spotify tracks use an embedded player with manual play/pause and an external-link fallback. No owner account connection or autoplay is configured. Sharing parameters are removed. The iframe loads content from Spotify and is subject to its privacy and playback policies.

Edit `src/content/desktop/quote.txt` to replace the sticky note text. Your line breaks are preserved. Rebuild and redeploy to publish either change. See `src/content/desktop/README.md` for the optional local audio file setup.

Pixel typography, window controls, scrollbars and color accents live in `src/styles/pixel-theme.css`. Decorative SVG drawings are in `src/components/Doodle/`.

## Light and dark mode

The sun/moon button in the taskbar switches every page between light and dark mode. Light is the default. The visitor's choice is saved in their browser; the toggle still works if browser storage is unavailable. Theme overrides are in `src/styles/color-modes.css`.

## Security before publishing

Read `SECURITY.md` before pushing or deploying. Builds sanitize photo metadata (local originals are backed up under ignored `private/`) and enforce publication checks and a production Content Security Policy. Fonts are self-hosted. Publish only `dist/`; never publish environment files, private backups, or unpublished drafts. Contact abuse protection also requires the EmailJS dashboard settings described in that document.

For ongoing updates, run `npm run build` before staging content. After `git init`, run `npm run setup:hooks` once; it blocks unsafe staged photos and common secret files. GitHub security checks and Dependabot are configured in `.github/` and start after the repository is pushed and Actions is enabled. See `SECURITY.md` for branch-protection setup and limits of web uploads.

YouTube Music track URLs (`https://music.youtube.com/watch?v=...`), YouTube watch URLs and `youtu.be` shares also work on line 1 of `song.txt`. They use a privacy-enhanced YouTube player with manual play/pause in the same pixel frame, with a taller area for video controls. Playlist-only URLs are unsupported. Playback depends on the track allowing embedding; the external link remains available.
