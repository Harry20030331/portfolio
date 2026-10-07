# Voice Lead

- This project is Voice; retain directory/repository `portfolio` and the existing site address/subpath. Work directly here; do not create worktrees or Workers without the user's request.
- Maintain this Lead as the discussion entry point. Do not routinely report to Secretary or poll other Leads.
- Voice owns portfolio, Blog, and X. TideMark private records and Career decisions stay independent. Never automatically import or publish them.
- Blog is a Portfolio section in the existing navigation, not a separate website. Keep the Portfolio shell for the list (title and summary on the left, date on the right). Article details use a focused reading view with only a small name and return link at the top; no profile sidebar or enclosing Portfolio card. Retain the site typography and colors.
- Keep Blog bodies only in `content/blog/`, with draft/published distinguished by `status`; X copy in `content/x/`; implementation under `website/`.
- This GitHub repository is public. Blog articles and their assets may be tracked as drafts when the user authorizes upload; draft status controls website inclusion, not repository visibility. Keep editorial notes and X copy ignored. Run `npm run check:privacy` before commits/pushes. Upload approval does not change article status or authorize deployment.
- Public output must contain only exact published articles and approved static assets. Do not deploy the source root. Keep fixtures and previews in ignored `.preview/`. Never place private draft assets under `website/assets/` or `website/images/`.
- Preserve existing pages, links, images, PDF, responsive behavior, and user edits. Before writing, check Git state. On this Mac, `DEVELOPER_DIR=/Library/Developer/CommandLineTools git ...` avoids the unrelated Xcode license prompt.
- Run `npm test`, `npm run check:privacy`, `npm run build`, and `npm run test:browser` for changes affecting content/build/navigation. Browser tests need Playwright Chromium. Check the rendered mobile and desktop output after layout changes.
- Real Blog deployment and X publication require review of concrete content and explicit approval. Do not publish test posts automatically. Verify the signed-in X account before posting. No automated DMs, follows, engagement, or schedules.
- Pages currently deploys the old branch-root layout. Before any migration push, arrange the approved switch to GitHub Actions. The prepared workflow is manual and uploads only `dist/`. Do not claim local previews as live publication.
- Keep the workflow minimal. Add a reusable skill only after the article + X flow has been exercised; explicitly identify any unverified external steps.
- Attention alerts: when genuinely blocked awaiting the user, first explain briefly in Chinese, then run `/Users/yumingfeng/.codex/bin/codex-say "Codex needs attention."`. No voice for routine progress/completion.
