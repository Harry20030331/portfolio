# Blog source

Keep every article in this directory as `<slug>.md`, with draft and published posts together. Only `status: published` is built. Missing/unknown status is never public. Metadata uses flat one-line strings (double-quoted JSON strings also work):

```markdown
---
title: Article title
slug: article-title
date: 2026-09-22
summary: One sentence description.
status: draft
---

Article body in Markdown.
```

Blog articles and their associated images are versioned rather than ignored. The user approved uploading `community.md` and its diagram on 2026-10-07, while retaining `status: draft`. Draft status excludes a post from the public website build; it does not hide its source in this public repository. Obtain authorization before adding another article. Local `editorial-notes.md` files and X copy remain ignored. Use selective staging and run `npm run check:privacy` before commit/push. Website publication remains a separate action.

Markdown is rendered with HTML disabled. Use relative links from the final `/portfolio/blog/<slug>/` URL: `../../` for the portfolio, `../../images/<file>` for an approved public image, `../other-slug/` for another article. Only assets explicitly placed in `website/assets/` or `website/images/` are published; these directories are public, including unused files. Keep private attachments here locally until approved. Do not embed local filesystem paths. There is no RSS, sitemap, or search index yet.

For a local rendering example, use `npm run preview:fixture`. It writes synthetic content under ignored `.preview/`; it never changes article status or the production build.
