# vCard - Personal portfolio

![GitHub repo size](https://img.shields.io/github/repo-size/codewithsadee/vcard-personal-portfolio)
![GitHub stars](https://img.shields.io/github/stars/codewithsadee/vcard-personal-portfolio?style=social)
![GitHub forks](https://img.shields.io/github/forks/codewithsadee/vcard-personal-portfolio?style=social)
[![Twitter Follow](https://img.shields.io/twitter/follow/codewithsadee_?style=social)](https://twitter.com/intent/follow?screen_name=codewithsadee_)
[![YouTube Video Views](https://img.shields.io/youtube/views/SoxmIlgf2zM?style=social)](https://youtu.be/SoxmIlgf2zM)

vCard is a fully responsive personal portfolio website, responsive for all devices, built using HTML, CSS, and JavaScript.

## Demo

![vCard Desktop Demo](./website-demo-image/desktop.png "Desktop Demo")
![vCard Mobile Demo](./website-demo-image/mobile.png "Mobile Demo")

## Prerequisites

Before you begin, ensure you have met the following requirements:

* [Git](https://git-scm.com/downloads "Download Git") must be installed on your operating system.

For local preview with auto-reload, install [Node.js](https://nodejs.org/) **18+** (LTS recommended).

## Local development

```bash
npm install
npm run dev      # http://127.0.0.1:5173 — live reload while editing HTML/CSS/JS
npm run preview  # http://127.0.0.1:4173 — static server without live reload
```

If you use [nvm](https://github.com/nvm-sh/nvm), run `nvm use` in this repo to match `.nvmrc` (Node 20).

## Installing vCard

To install **vCard**, follow these steps:

Linux and macOS:

```bash
sudo git clone https://github.com/codewithsadee/vcard-personal-portfolio.git
```

Windows:

```bash
git clone https://github.com/codewithsadee/vcard-personal-portfolio.git
```

## Contact

If you want to contact me you can reach me at [Twitter](https://www.x.com/codewithsadee_).

## License

MIT

## Blog build and Pages deployment

Use Node 22+ and pnpm 11.19.0. Run `pnpm install`, then:

- `pnpm test` — article selection, rendering and output-isolation checks.
- `pnpm run check:privacy` — tracked-content policy check.
- `pnpm run build` — published articles only, generated under `dist/`.
- `pnpm run preview:community` — explicitly includes the Community draft for the authorized layout review; its source remains `status: draft`.
- `pnpm exec playwright install chromium` then `pnpm run test:browser` — desktop/mobile checks and ignored screenshots.

Serve `dist/` for local previews, rather than the source root. Blog content lives in `content/blog/`; the Community diagram's approved public copy is under `website/assets/blog/community/`.

GitHub Pages uses **GitHub Actions**, not branch-root publishing. Manually run **Build and publish portfolio**. Enable `preview_community` only when the Community layout preview is approved for public display. The workflow tests, builds and uploads only `dist/`; source files, editorial notes and other drafts are not deployment artifacts. A draft preview has a visible label and `noindex,nofollow`, but is publicly readable at its URL. It is not a private review environment.
