---
title: "AI Tutor: What It Takes to Build a Virtual Tutor"
slug: ai-tutor
date: 2026-05-03
summary: "Building a virtual tutor: what exam-based evaluation revealed about RAG, agent architecture, model capability, and commercial viability."
status: published
---

AI Tutor did not start as another homework-search widget. The opening bet was larger: something closer to a **virtual tutor**—explanations that teach, not just answers; multimodal delivery (figures, motion, voice); follow-up questions; and a stack that combined knowledge bases, item banks, RAG, agents, and tools rather than a single model call. That ambition was sincere and, in hindsight, structurally heavy for an early MVP.

This note is the distilled arc: market and user signals; what the **data pipeline and RAG** could and could not fix; **exam-paper evaluation** as shared ground truth; **agents and multimodal packaging** where context becomes risk; **commercial reality**; and finally what survives as **re-anchoring, playbook, and synthesis**—including why the project became a **controlled failure** that still paid rent as a full product-workflow exercise.

## What went well

**Evaluation discipline early:** moved from vague “is it good?” debates to a **quantitative exam-paper harness**—shared ground truth for capability and drift. **Upfront landscape research** was solid enough to avoid wasting time on obviously wrong directions.

---

## Chapter I — Vision, Market, and Course Context

### I-1. The Opening Bet and Early Landscape

After skimming the landscape (various domestic AI tutor, companion, and search-style products), the team had a working map of what existed: often text-forward answers, limited personalization, shaky alignment with mainstream exam methods, and thin visual interactivity. One blind spot mattered: a strong incumbent closer to the target shape (e.g. a mature incumbent in the same product neighborhood) was not weighted early enough, so the first read on “how far ahead we could get” was probably optimistic.

The first build hypothesis was straightforward: **if we plug in a stronger GPT-class model**, explanation quality might leapfrog products constrained by weaker models. MVP pieces followed naturally—capture a problem, call the model, layer light personalization—and the early demos felt encouraging against the first wave of benchmarks in the team’s head.

Parallel to product curiosity, a **project-based course** folded AI Tutor into a formal cadence: research, prototype, usability writing, MVP, user tests, iteration. That dual identity—real exploration *and* graded workflow—turned out to be useful: when commercial fog thickened, the project still had a legitimate reason to finish loops honestly.

### I-2. What Users Kept Saying

Interviews echoed the same fractures: answers that **overshoot the syllabus**, methods that are correct but not **exam-mainstream**, hunger for process over a final line, and frustration with pure text on geometry and physics-style visuals. Those signals reinforced two engineering tracks—constrain method and syllabus, and push richer explanation—while also foreshadowing how hard “constraint” would be to enforce with software alone.

---

## Chapter II — Evaluation Matters

### II-1. Data, RAG, and the Limits of Retrieval

To tame off-syllabus and non-mainstream solutions, the team invested in a **data pipeline**: ingest textbooks and supplements (PDF, DOCX), parse into a knowledge base, extract knowledge points and items, and feed the model via keyword injection and then RAG. The intent was right: the model should behave like it “took the exam’s class,” not like a contest math coach.

RAG and corpora **do** supply missing facts and anchors. They **do not** reliably decide *which* method a grader prefers, which steps score points, or what a given grade is “allowed” to know. Those are pedagogy and item-bank problems. So the pipeline bought some grounding; it did not close the strategy gap between “knows content” and “answers like this jurisdiction’s median excellent student.”

### II-2. Evaluation Harness: Replacing Vibes with Exam Paper `[mindset]`

A pivotal discipline was building an **evaluation harness** on roughly three recent years of regional **high-stakes junior entrance exams**, curriculum-aligned—math and physics, figures, circuits, instrument readings—checking not only correctness but syllabus fit and mainstream method. That single move turned many arguments into **bucketed failures**: where the model is strong, where it drifts, and which product promises are unsafe.

Two patterns dominated the results.

**Math.** The model often *can* solve, but not always *as required*: methods wander, geometry leans on tools students have not been taught, and prompt-only guardrails cap out—soft constraints do not make a control system.

**Physics.** Conceptual structure looked friendlier at first, but **vision became the bottleneck**: schematics, dials, charts. Even strong vision models landed in a band the team described as roughly **80–90%** on those reads—fatal for a “one shot, one answer” tutor. Cropping, skills, task split, “read then solve,” and multi-pass checks helped at the margin; they did not erase the underlying instability.

That pushed emphasis back toward **math**, especially geometry: more structure is recoverable from text, and figures can sometimes be **reconstructed** from stem language plus code-style generation—less hostage to raw diagram OCR than many physics items.

---

## Chapter III — Great Vision v.s. Limited Ability

### III-1. Full-Blood Agent as North Star

Alongside execution, the team sketched a **full-blood agent** north star: minimal hand-authored workflows, rich tool surface, the model choosing explanation paths, drawing, pointing, jumping UI, voice—closer to a human tutor session than a chat bubble. The vision is coherent; it assumes stable vision, stable planning, and stable UI operation. **Physics results in II-2 had already shown vision short of what a narrow MVP needs for honest diagram work**; any product story that assumes the tutor can **see** and **draw** figures on demand inherits that same margin-for-error problem.

**Circuits** stress-tested that ambition concretely: have the agent **read** exam-style schematics and **draw** clean diagrams in lockstep with explanation. **Recognition** broke early on realistic figures; **generated** diagrams were both ugly and structurally untrustworthy—not a polish gap alone. Narrow **reactive** affordances might still be imaginable, but if the stack cannot reliably parse and redraw diagrams, the multimodal tutoring story loses its center: “see it on the board” collapses into vibes. That capped how seriously the team treated the sketch as a near-term execution spine—the north star stayed a **compass**, not a roadmap, because the binding limit was **competence on figures**, not missing orchestration.

### III-2. Drawing Worked in Isolation, Then Broke in the System

“Liveness” mattered: geometry that moves with the explanation. Isolated probes—agent-authored drawing skills, replication from stem or image—looked **good enough to ship toward**. Wired into the full solving agent, quality **dropped**. The diagnosis was not mysterious: one agent carried **long context** and too many jobs (comprehend, plan, solve, explain, draw). Attention diluted; the capability was real, but the **packaging** poisoned it.

Splitting **drawing into a subagent** with short, focused context recovered performance. The lesson generalizes:

> Capabilities observed in a clean room are not promises at system scale until you manage **context pollution** and **role overload**.

### III-3. What Agent Architecture Can and Cannot Do

Subagents **released** drawing because the base model already knew how to draw. They **could not** manufacture reliable physics diagram understanding where the vision substrate wobbled. Prompting, RAG, and orchestration **steer**; they do not rewrite the failure distribution of a missing or noisy competence. A clean formulation:

> **Agent architecture improves organization; it does not create missing model capabilities.**

---

## Chapter IV — Commercial Reality: Who Pays, and for What Delta

As the stack matured, the uncomfortable question stopped being “can we demo?” and became **“who buys this, and why not the free alternative?”** A narrow subject slice, even with ~**10%** perceived quality lift, is a weak wedge against ubiquitous search-and-solve products backed by **item banks, canonical solutions, accumulated instructional research, traffic, and cheap retrieval latency**. Regenerating every explanation is slower, costlier, and statistically wilder than serving a curated parse—advantages in personalization and animation do not automatically compound into **pricing power**.

The team’s read shifted: the moat in this lane is not “we call a strong model,” but **corpus + pedagogy + distribution + trust**. Without a credible wedge on those axes, AI Tutor risked being an **improvement**, not a **replacement** or **must-have**—a distinction that matters when budgets are finite.

---

## Chapter V — What We Keep: Re-anchoring, Playbook, and Synthesis

### V-1. Re-anchoring the Project

Late-stage reframing was healthy rather than defeatist. AI Tutor became less “the company bet” and more a **deliberate controlled failure**: a real substrate to run **idea → research → interviews → prototype → usability → MVP → user testing → iteration → kill/continue decision**. The value migrated from “win this SKU” to **train judgment**—where to probe ceilings first, when to stop prompt thrash and change architecture, and how to weigh model strength against **resource-shaped** competition.

### V-2. Playbook for the Next Education-AI Attempt

What survived as reusable method:

1. **Ceiling and failure-mode first** — isolated capability tests, then benchmarks, then integration; never assume demo fluency equals product reliability.
2. **Treat context as engineering surface** — partition roles, shorten specialized traces, watch instruction conflict under load.
3. **Agents release, they do not invent** — invest orchestration where the underlying model is already competent; do not expect orchestration to cure blind vision.
4. **Verify the buyer before deep build** — who pays, against what incumbent, with what data asset?
5. **Respect resource-heavy lanes** — if competitors own banks and channels, “we engineer well” is rarely sufficient alone.

### V-3. Closing Synthesis

AI Tutor is **not**, in its current shape, where the team would keep stacking commercial fire—but it was **high-yield as a single end-to-end rehearsal**: vision stress-tested against exam paper, RAG scoped to what it can fix, agents tested as both lever and mirage, and business gravity applied before narrative sunk cost ran too deep.

The line to keep:

> **Strong models and clever systems do not repeal market structure.** The win was learning to see that early enough to convert the project into **training**, not only **burn**.
