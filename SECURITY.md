# Security and privacy before publication

This is a public static site, not a private document store. Security controls reduce risk; they cannot make public photos or text confidential or guarantee that a site is unhackable.

## Implemented

- Compatible dependency updates; run `npm audit` again before publishing and regularly afterward.
- Production HTML has a Content Security Policy: scripts/fonts from this site only, connections only to the EmailJS API, frames restricted to this site, https://open.spotify.com and https://www.youtube-nocookie.com, no embedded objects, no native form submissions, and no base URL overrides. Inline scripts and eval are not allowed. Inline CSS remains allowed for React positioning/animation styles.
- Fonts are served locally, with no Google Fonts requests.
- Referrer policy is no-referrer. Song links are cleaned public URLs and use noopener/noreferrer; Spotify uses an official public-track iframe without connecting the owner account. The iframe has no-referrer set; no autoplay is configured. Its third-party content and network activity are controlled by Spotify, outside the parent page CSP.
- Source maps are disabled, local dev/preview bind to loopback, and build checks reject common private-file paths, unexpected public environment variables, and several recognizable credential patterns. This is a narrow safety check, not comprehensive secret detection.
- Images are checked before each build; EXIF/XMP/IPTC/comment metadata is removed where present. Orientation is applied first. Original copies are saved under ignored `private/original-images/`. The production image pass provides a second check. Other private information visible in the pixels or filenames is NOT removed.
- Contact only forwards email and message, with trimmed/length-checked input, a honeypot, duplicate submission prevention, and a 30-second browser throttle. These can be bypassed by an attacker; they do not replace provider-side controls.
- Message drafts remain in React memory, not browser storage. Theme and EmailJS throttle timestamps can be stored locally.
- `.env*`, private keys, local private folders and build output are ignored by Git. Git ignore does not remove files already committed to history.

## Required before GitHub Pages publication

1. Review every file you plan to commit. The name, face, About text, captures, filenames and all article text are intentionally public. Every article .md in `src/content/articles/` is published (README.md and .example templates are excluded). Keep drafts, credentials and private documents outside the repository or in ignored `private/`.
2. Run `npm run build` BEFORE committing new images so source images are sanitized as well as the build. Never commit `private/original-images/`. Backups are for your local recovery only.
3. Use GitHub Actions to publish ONLY `dist/`, not the repository root. Review the staged files and Git history. No repository has been pushed or site deployed by this work.
4. Turn on GitHub Pages **Enforce HTTPS** after configuring the site. Protect GitHub and EmailJS accounts with MFA, and enable GitHub secret scanning/push protection and dependency alerts where available.
5. In EmailJS, allow only the final production origin (and localhost only during testing), set a fixed recipient in the template/dashboard, and do not accept a recipient from submitted template parameters. Use escaped `{{message}}` / `{{from_email}}` placeholders, never raw/triple-brace HTML. Review EmailJS provider-side rate limits and quotas. If spam occurs, enable server-verified CAPTCHA and implement its client integration together; enabling it only in the dashboard will break the current form.
6. The three VITE_EMAILJS_* values are public client identifiers. Do not put mailbox passwords, EmailJS private keys or other secrets into VITE_* variables. If a real secret was ever committed, revoke/rotate it and clean repository history before publishing.
7. Inspect the actual deployed site after release. This local review cannot confirm GitHub or EmailJS dashboard settings.

## Hosting limits and external services

GitHub Pages does not provide a project-level custom response-header configuration. Meta CSP works for supported directives but cannot enforce `frame-ancestors` or X-Frame-Options. No claim of full clickjacking/header protection is made. If those controls are required, use hosting/a proxy with configurable headers. Suggested HTTP headers there: `Content-Security-Policy` (same production policy plus `frame-ancestors 'none'`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, and `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

YouTube Music links use a local player document (youtube-player.html) containing the privacy-enhanced YouTube iframe. Only that document uses strict-origin-when-cross-origin and permits the official YouTube iframe API and its /s/player/ scripts; the main page retains local-only scripts and no-referrer. The player receives only a validated public video ID and the site origin. This matches the diagnostic player setup without sending page paths or query strings to YouTube. No autoplay is configured. Provider restrictions can prevent individual tracks from playing. The Spotify iframe loads third-party content and shares ordinary connection data with Spotify when loaded. Visitors' submitted email and message are sent to EmailJS only when they submit the form, then to your configured mailbox. GitHub Pages also processes visitor requests; these services have their own privacy policies. No live email or external account security change was performed in this review.

Sources: [GitHub Pages HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https), [GitHub publishing guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [EmailJS abuse controls](https://www.emailjs.com/docs/faq/does-emailjs-expose-my-account-to-spam/), [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), [MDN frame-ancestors limits](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors).

## Maintaining protection as content changes

- `npm run build` automatically sanitizes new photos and reapplies the production security policy and publication checks. Articles render through react-markdown with raw HTML disabled, safe link protocols, and images restricted to bundled article assets.
- After initializing this folder with Git, run `npm run setup:hooks` once before the first commit. Future `npm install` / `npm ci` installs the repository-local pre-commit hook automatically. Other clones need their own setup. Existing custom hook configurations are not overwritten.
- Normal update sequence: add your photos/articles locally, run `npm run build`, review the content, stage your changes, then commit and push. The hook checks the staged bytes, not merely the working copy. If it rejects photo metadata, sanitize and stage the cleaned image again. It never auto-stages or commits your files.
- GitHub Actions runs the `Security checks` job on every push and pull request, weekly, and on manual request. It checks tracked files BEFORE sanitization, audits all dependencies, lints, tests and builds. It has read-only repository permissions and does not deploy or use account secrets.
- Dependabot proposes weekly npm and GitHub Actions updates; updates still need review and passing checks. No automatic merge is configured.
- Once the repository exists, enable a branch rule requiring `Security checks` to pass before merging and keep deployment dependent on the same successful checks. This workflow alone cannot enforce branch protection or block a separate deployment workflow.
- Avoid uploading raw photos or private files through GitHub's web interface. Web uploads bypass local hooks, and a failing push check cannot erase already-published data or Git history. Local hooks can also be bypassed, and credential-pattern checks cannot identify every secret or sensitive article. Review what you publish.
- Scheduled GitHub jobs run only once configured files reach the default branch and Actions is enabled; GitHub can disable scheduled runs on inactive public repositories. Check repository notifications and the Actions tab periodically.
