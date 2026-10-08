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

For local preview with auto-reload, install [Node.js](https://nodejs.org/) **22+** (LTS recommended).

## Local development

```bash
pnpm install
pnpm dev        # http://127.0.0.1:5173/portfolio/#blog — live local preview
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

Use `pnpm dev` during editing: it renders Markdown on request and refreshes the page after saves, preserving reading position. Drafts and local article images can be previewed without changing status, generating `dist/`, uploading or deploying. Production output is still generated only under `dist/`. Blog content lives in `content/blog/`; the Community diagram's approved public copy is under `website/assets/blog/community/`.

For review from a second device on the same network, bind the preview to the Mac Mini’s current LAN IP: `PREVIEW_HOST=<LAN-IP> pnpm dev`, then open `http://<LAN-IP>:5173/portfolio/#blog` on the MacBook. The default remains loopback-only. LAN preview includes drafts; use it only on a trusted network. If the LAN IP changes, restart with the new address. Wi-Fi client isolation or the macOS firewall can prevent cross-device access.

On this Mac Mini, local review is currently managed by two user launchd services, `com.yumingfeng.portfolio.preview-local` and `com.yumingfeng.portfolio.preview-lan`. Their machine-specific configurations and logs are ignored under `.preview/services/`. They survive tool-session exit and restart a stopped preview process. Markdown/CSS saves refresh automatically; after changing server or rendering code, restart each with `launchctl kickstart -k gui/$(id -u)/<service-label>`. These jobs are registered for the current login session, not installed as login-startup jobs. After reboot, bootstrap their plists again and verify/update the LAN IP.

GitHub Pages uses **GitHub Actions**, not branch-root publishing. The prepared release workflow is: review locally → approve release → run final checks → upload all source changes as one commit through GitHub MCP → update `.github/release.json` to name that commit. Only the marker update triggers a push build; ordinary source commits do not. Verify the run and live URLs through MCP/read-only requests. No webpage click is needed for this route. It will be verified on its first approved release; this local workflow configuration is not installed remotely yet. A manual **Build and publish portfolio** run remains a fallback. Enable `preview_community` only when the Community layout preview is approved for public display. The workflow tests, builds and uploads only `dist/`; source files, editorial notes and other drafts are not deployment artifacts. An explicitly approved draft preview retains `noindex,nofollow` and is publicly readable at its URL. Draft/local-preview badges are omitted from the reading interface; article status remains in source metadata. It is not a private review environment.

Example release marker (create only after release approval):

```json
{"sourceSha":"<approved-source-commit>","includeCommunityPreview":true}
```

The release script builds the exact named source revision and accepts only a Boolean draft-preview choice. To retain the currently live Community layout preview, set `includeCommunityPreview` to `true`; it stays a draft.
