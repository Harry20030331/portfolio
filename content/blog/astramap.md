---
title: "AstraMap: Lessons from a Three-Day Build"
slug: astramap
date: 2026-05-04
summary: "Lessons from a three-day self-use build: clear scope, agent-assisted debugging, mobile testing, deployment, and prompt routing."
status: published
---

A short CS 153 project built a **personal / practitioner-facing** astrology workflow: natal chart display, symbolic feature extraction, structured “main line” interpretation, and free-form AI Q&A—split across an **interpretation surface** and a **chat surface**. The sprint was deliberately small in audience, which made problem definition unusually sharp; the durable payoff was not the vertical itself but **how much real engineering** (UI polish, mobile failure modes, auth, deploy, prompt shape) fit into three days when the product intent stayed legible.

## What went well

**Solo end-to-end ownership:** code, UI/UX, Supabase-backed persistence, and small full-stack deploy—one person walked the whole engineering chain.

---

## Chronicle: Three-Day Build

### Day 1 — Landscape, scope, and MVP skeleton

- Sketched **US and China** astrology-style products by installing and clicking through real apps.
- Locked positioning: **for the practitioner** (astrologer’s tool), not a consumer horoscope feed.
- Locked core product slices: **natal chart**, **symbolic feature extraction**, **structured reading**, **AI Q&A**.
- Chose a **dual UI**: rich interpretation view plus a separate agent/chat lane.
- Surveyed **open-source** chart or ephemeris-style repos as possible **tools** for an agent, not only as copy-paste code.
- Stood up the first **MVP page structure**.

### Day 2 — Chart UI, mobile bugs, and testing discipline

- Spent a long slice on **natal chart visuals** and overall **UI/UX** coherence.
- Hit a blocking **mobile layout** bug. Diagnosis in hindsight: the agent session leaned on **speculation** (“thinking”) instead of **verification**, and there was **no logging / tracing** habit yet—so debugging stayed fuzzy.
- Testing was **chaotic**: jumping between ad hoc setups instead of a fixed ladder, which burned time on dead paths.

### Day 3 — Backend, auth, deploy, and prompt routing

- Wired **Supabase** for **multi-user persistence** and a simple **user list** surface.
- Shipped **email + Google** sign-in.
- Deployed with **Vercel** (front) and **Render** (API), plus **domain** wiring—then fought a **Render environment-variable** misconfiguration that surfaced only in prod-like conditions.
- After launch, **prompt rigidity** hurt: added a lightweight **router** so **structured** questions could take **structured output**, while ordinary Q&A stayed in **plain text**.

---

## Self-Use Scope Bought Unusually Sharp MVP Definition

Building **for yourself** removed generic user-research theater: requirements stayed concrete, the “final picture” was stable early, and there was less thrash on “what are we even making.”

**Takeaway:** a **self-use** constraint is not a downgrade—it is often the fastest path to a **clean problem statement**.

---

## Agent-Assisted Debugging Needs a Human-Owned Verification Spine

Letting the agent “own” debugging without structure produced confident narratives that did not converge. What worked better was **forcing a workflow**: where to look, what to log, what hypothesis to falsify first, and how to **cap the search space**.

**Takeaway:** treat the agent as **acceleration on a path you define**, not as an **autonomous debugger**.

---

## Mobile Testing as an Ordered Pipeline

The expensive mistake was **parallel guessing** across environments. The ladder that should have been default:

website: **Localhost** through Chrome
web mobile app: **Localhost** through IOS simulator
mobile app: **Metro** through IOS simulator

---

## Deployment as Its Own Engineering Surface

Early intuition treated deploy as a “last checkbox.” Reality bundled **environment variables**, **multi-service coupling** (frontend / API / database), and **network + permission** edges. Budgeting **about a day** for first-time wiring (and first prod-only bug) would have matched the true surface area.

**Takeaway:** **deployment is a subsystem**, not a footnote after “features work locally.”

---

## Prompt Routing and Task Shape

A single **monolithic** prompt tried to serve incompatible interaction shapes. Splitting by **task type**—structured chart analysis versus conversational Q&A—reduced format fights and made failures easier to localize.

**Takeaway:** LLM systems benefit from **explicit task routing**, not one universal system prompt.

---

## Systems Closure and Durable Artifacts

The sprint still **closed a full arc**: idea → MVP → UI → debug → backend → auth → deploy → iteration. First-time integration of **Supabase + Vercel + Render** made the difference between “toy script” and “something on the internet with accounts.”

This was intentionally **low budget, high learning density**, with a **strong engineering loop** rather than a growth experiment. The mindset shift was simple: stop underestimating **debug** and **deploy** complexity; start holding a **systems view** and a deliberate **human/agent division of labor**.

**Takeaway:** capture what you almost did not write down: **debug checklists**, **deploy checklists**, and **agent collaboration patterns**—that is how a one-off sprint becomes **reusable leverage**.

---
