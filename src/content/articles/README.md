# Add an article

Save Markdown (.md) files here, including in subfolders. No React edits are needed.
Use a filename such as `2026-10-16-my-article.md` and start with `# My article title`.
The filename supplies the date; files without dates go into Undated.
Without a leading # heading, the title comes from the filename and all text stays in the body.

Copy `article-template.md.example` to a new .md file to get started.
Use headings, paragraphs, bold, italics, lists, quotes, links, and fenced code blocks.
Separate paragraphs with blank lines. For a deliberate line break, end a line with two spaces.
Raw HTML is not rendered.

## Images

Put PNG/JPG/JPEG/WebP/AVIF files next to your article or in an images subfolder.
For example:

- `2026-10-16-my-article.md`
- `images/my-photo.png`

Reference the image with `![Describe the photo](./images/my-photo.png)`.
Paths are relative to the article file. Use local images, not external image URLs.
Images resize to the reader width and go through metadata removal during builds.
Visible private details in a photo are not removed; review before publishing.

## Optional metadata

```markdown
---
Title: My title
Date: 2026-10-16
Summary: My own postcard description.
---

Article text here.
```

Year folders, postcards, search, and newer/older navigation are automatic.
Keep filenames stable to preserve links. README.md files and .example templates
are excluded from the article list. All other .md files are published; keep drafts elsewhere.
Run npm run dev and preview on localhost. Rebuild and redeploy to publish changes.
