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

A draft may omit `date` while its original writing date is being verified; the preview then displays no date. Published articles require a verified date. `lang` may identify a non-English article (for example, `zh-CN`).

The `date` field is the original writing date, shown on both the article and the Blog list and used for ordering. Do not substitute the upload or deployment date when publishing an older reflection. Parts split from one reflection retain its original writing date. Verify that date against the source; do not invent a missing date. Later revisions may be noted separately without changing the original writing date.

Blog articles and their associated images are versioned rather than ignored. The user approved uploading `community.md` and its diagram on 2026-10-07, while retaining `status: draft`. Draft status excludes a post from the public website build; it does not hide its source in this public repository. Obtain authorization before adding another article. Local `editorial-notes.md` files and X copy remain ignored. Use selective staging and run `npm run check:privacy` before commit/push. Website publication remains a separate action.

Markdown is rendered with HTML disabled. Use relative links from the final `/portfolio/blog/<slug>/` URL: `../../` for the portfolio, `../../images/<file>` for an approved public image, `../other-slug/` for another article. Only assets explicitly placed in `website/assets/` or `website/images/` are published; these directories are public, including unused files. Keep private attachments here locally until approved. Do not embed local filesystem paths. There is no RSS, sitemap, or search index yet.

Use `pnpm dev` for continuous local review. It renders articles on request, includes drafts locally, and refreshes after Markdown or style saves. It does not change article status, upload files, or run a deployment.
