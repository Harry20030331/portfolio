---
title: "IdeaWeave, Part II: Building with LLMs"
slug: "ideaweave-llm-systems"
date: "2026-10-07"
summary: "Technical lessons on latency, cost, task partitioning, model\u2013tool boundaries, interfaces, and prompting."
status: published
---

*CS 224G course project · Original reflection written March 5, 2026.*

IdeaWeave turns user intent into editable diagrams. This second part collects the technical lessons from building its LLM system: latency and cost, capability boundaries, model–tool division of labor, task partitioning, interfaces, and prompting.

For the product context and engineering reflections, read [Part I: Product and Engineering Judgment](../ideaweave/).

## Building with LLMs

This chapter blends concrete LLM engineering knowledge with lessons from our 8-week experience.

---

### Latency Architecture in LLM Systems

Latency is governed by a small number of structural facts.

#### 1. Foundational Cognition

Two core realizations anchor all latency decisions:

1. 10ms per output token is a practical engineering constant.
2. Output token count is the primary bottleneck. Input processing is relatively fast.

---

#### 2. Reducing Latency: A Structural Methodology

##### (a) Output Compression

The most direct latency control mechanism is output compression.

Analyze output carefully: Which tokens are semantically necessary? Which tokens are boilerplate?
Let the model decide structure. Let the algorithm functions expand deterministically.

Example: replacing verbose JSON with a compact DSL drastically reduces per-element token count.

---

##### (b) CoT as a Trade-Off, Not a Default

Chain-of-Thought (CoT) improves reasoning quality, but it increases token count and therefore latency.

CoT is neither inherently good nor bad. It is a trade-off.

- More CoT → better reasoning, higher latency.
- Less CoT → faster response, potential quality loss.

The engineer must decide:

- Where is deep reasoning necessary? 
- How deep should the reasoning be? (just step by step or clear workflow)

The correct balance depends on the **product requirement**, not on ideology.

---

##### (c) Multi-Agent Parallelization

Multi-agent systems can reduce wall-clock time if they reduce per-module token load or allow parallel execution.

If decomposition creates longer cumulative outputs than a single-agent design, latency worsens.

The goal is **effective decoupling** — distributing reasoning without inflating token volume.

---

##### (d) Streaming and Perceived Latency

Latency is also psychological.

Streaming responses and incremental rendering improve First Render Time (FRT) — the time until the user sees meaningful output.

Even when total generation time is unchanged, early visible feedback reduces perceived delay.

---

### Cost Architecture in LLM Systems

#### 1. Foundational Cost Cognition

Cost, like latency, is governed by a small number of structural facts.

Two core realizations:

1. GPT5.2 1K TOKEN = ¥0.1 / $0.014
2. Output tokens dominate cost. Input tokens can be cached.

---

#### 2. Three Pillars of Cost Control

##### (a) Task–Model Alignment (Model Routing)

Not all tasks deserve the same model.

- High-value reasoning (GPT-5.2): used for Planner and core DSL generation.
- Low-cost auxiliary tasks (GPT-4o mini): used for naming and routing.

---

##### (b) Input Cost Neutralization (Prompt Caching)

Large system prompts can be cached.
With prompt caching enabled: Repeated system prompts become nearly free.

---

##### (c) Output Compression

Output compression stabilizes cost.
e.g. Reducing per-element output from 300 tokens(json) to 40 tokens(dsl).

---

### Ceiling First, Scaffold Second

#### 1. Strongest Model + Strongest Architecture First: Probing the Capability Ceiling

The correct first question is not:

> How can we optimize cheaply?

But:

> At unlimited cost and latency, can the best model + best architecture solve this problem?

Using top-tier models (GPT‑5.2, Opus‑4.6) and code agent structure (with skill repositories and structured documentation) revealed capability boundaries.

#### 2. The Three-Step Engineering Path

**Step 1 — Determine the Ceiling**

- Use strongest model and full architecture.
- Achieve 100/100 quality.

**Step 2 — Close the Gap**

- Reduce cost and latency while maintaining 95 quality.

**Step 3 — Iterate and Surpass**

- Build case repositories and refine submodules.

Optimization becomes **controlled evolution**.

---

### Agent Architecture Decisions: Agents v.s. Tools/Algos

Tools handle (local, bounded, deterministic, no generalization requirement, same input → same output):

- Numerical computation
- Deterministic expansion

Models handle:

- Semantic abstraction
- Global reasoning

---

Principle:

> If the model can do a good job, let model handle it.
> If the model is unstable in this task, think about how to integrate a tool.
> Use Tools to protect the lower bound, while use Tools to protect the lower bound.

Avoid two opposite errors:

- **Error 1 — Over-trust the model**: Use no tools at all → outcome: unstable, uncontrollable.
- **Error 2 — Over-trust tools**: Replace the model with tools → outcome: ceiling on capability.

Examples:

- **Dagre for LayoutModule**: We tried dagre for layout; it worked only for flowcharts, failed on complex nested logic and diverse diagram types.
- **Agent for overlap detection**: When we let the agent compute overlaps, the results were often wrong.

---

### Task Partitioning and Interface Design in Multi-Agent Systems

Beyond the algorithm-versus-agent boundary, a deeper architectural lesson emerged: how we partition tasks and design interfaces between agents determines whether a multi-agent system becomes stronger or weaker.

(1) Task Partitioning Is Not Free

We initially believed that splitting tasks into smaller modules would automatically improve clarity and performance. In practice, we discovered the opposite can happen.

When partitioning is done along superficial functional lines (e.g., LayoutModule vs. ColorModule), we often sever hidden semantic coupling:

Color influences perceived hierarchy and spatial balance.
Layout influences narrative rhythm and visual grouping.

If these dimensions are isolated too rigidly, the system loses coherence. The result is a paradox:

The more agents we add, the weaker the system becomes.

Partitioning must therefore follow **cognitive workflow**, not arbitrary functional decomposition.

Effective partitioning mirrors human reasoning:

- **Define a Contract** (intent + global structure)
- **Execute** under that contract
- **Apply** deterministic corrections where necessary

This preserves narrative continuity while still enabling modularity.

(2) Semantic Overlap Is Sometimes Necessary

Total separation between modules is rarely optimal. Some degree of semantic overlap is healthy.

For example:

The Planner must possess a coarse layout intuition.

The Executor must retain awareness of structural intent.

If the Planner outputs a weak contract and the system lacks rollback mechanisms, the Executor becomes locked into a flawed trajectory. Early commitment without revision creates structural fragility.

Therefore, a robust multi-agent architecture must allow:

- Limited semantic overlap
- Cheap rollback or re-planning mechanisms
- Iterative refinement across stages

Modularity should reduce complexity — not breaking meaning.

(3) Interface Design: Language vs. Structure

Another subtle but critical lesson concerns interface design between agents.

Human–Computer interaction relies on strict structure (code, JSON schemas, typed APIs). However, LLM–LLM interaction operates differently.

LLMs naturally communicate through high-dimensional natural language representations. Over-constraining semantic content into rigid predefined fields (e.g., DiagramType, Suggestion, LayoutLabel) prematurely compresses meaning and reduces generalization capacity.

The refined principle became:

Constrain format (JSON wrappers, DSL templates, parseable outputs).

Do not over-constrain semantic space.

In other words:

**Preserve semantic richness** at the reasoning layer.

This shift explains why V5’s natural-language planning contract outperformed earlier rigidly structured outputs. By allowing expressive semantic articulation before DSL generation, we retained model generalization power while still achieving deterministic rendering.

(4) A Unified Architectural Principle

The lessons of partitioning and interface design converge into a single rule:

Multi-agent strength depends not on how finely we split tasks,
but on where we split them, how much meaning we preserve,
and whether we allow cheap revision.

Architecture is not about decomposition alone.
It is about preserving intent while controlling uncertainty.

### Prompt Engineering: Structure over Phrasing

Prompt Engineering became one of the most frustrating parts of the iteration loop.

In practice, it often feels “dirty” because its feedback cycle is:

- **Slow:** long prompts and especially Chain-of-Thought (CoT) increase token generation and latency.
- **Unstable:** small wording changes can produce inconsistent behavior across runs and cases.
- **Cyclical:** you keep circling—tweak a line, rerun, observe drift, add another rule—without a clear gradient.

This project clarified that “Prompt Engineering” is not one technique, but two fundamentally different layers.

#### Layer 1 — Phrasing (Statistical Control)

This layer focuses on wording:

- Adding stricter language ("must", "strictly follow", "do not")
- Re-claiming instructions
- Emphasizing constraints

At this level, control is primarily statistical. The model’s behavior shifts by altering attention distribution across tokens. Improvements may occur, but they are often unstable:

- A phrasing works for one case but fails for another.
- Performance fluctuates across runs.
- Gains are difficult to attribute to a clear structural cause.

Layer 1 is useful for small adjustments, but it lacks durability and interpretability. It operates within the same reasoning structure and only modifies probability weighting.

#### Layer 2 — Workflow (Structural Control)

The second layer focuses not on wording, but on execution structure.

In essence, this layer is **guided CoT**.

Instead of asking the model to "think step by step," the prompt defines a workflow:

- Step 1: Plan.
- Step 2: Structure or represent.
- Step 3: Generate output in a constrained format.
- Step 4: Perform self-check or validation.

This introduces structural control rather than statistical nudging.

Key properties:

- Clear intermediate states
- Better interpretability (errors can be traced to a specific stage)
- Reduced ambiguity through representation (e.g., ASCII layout planning)
- Increased stability through staged reasoning

While still probabilistic, Workflow-based prompting constrains the reasoning trajectory. Stability emerges from **structure**, not from stronger wording.

In practice, Layer 2 proved significantly more reliable than Layer 1. When repeated phrasing adjustments failed to produce consistent improvements, introducing a workflow often resolved the instability by redefining how the model computes the answer.

#### Learning from Existing Prompts as a Starting Point

Another practical insight is that starting from other teams’ or open-source prompts(SKILL.md) is often a strong entry point.

Well-crafted prompts in public repositories are rarely accidental. They typically reflect multiple rounds of iteration and condensed reasoning. By dissecting them, we can extract:

- Their implicit workflow design (Layer 2 structure).
- Their phrasing strategies (Layer 1 emphasis patterns).
- Their reasoning decomposition and output formatting logic.

This does not mean copying blindly. Instead, it provides a structured baseline from which to adapt. Compared to asking an Agent to generate a prompt from scratch, reverse-engineering an existing, battle-tested prompt often accelerates convergence.

The key is to treat external prompts as design case studies — not final answers. They offer distilled heuristics, but must still be validated against our own user needs and task distribution.

#### Constraints vs. Generalization: A Necessary Tension

However, structural control introduces a new question: is defining a workflow always beneficial?

Any workflow is a form of constraint. By defining stages, representations, and validation steps, we reduce ambiguity and increase stability — but we also introduce bias. A fixed structure may implicitly favor certain diagram types, reasoning patterns, or layout paradigms. In doing so, it can unintentionally limit the model’s expressive range or its ability to generalize to unfamiliar cases.

This creates a fundamental tension:

- More structure → greater stability and interpretability.
- More freedom → greater expressive power and potential generalization.

The trade-off is not theoretical. A workflow that works exceptionally well for common diagram categories may underperform when faced with novel structures or edge cases. In that sense, workflow design can become a subtle form of overfitting.

Yet not all overfitting is harmful. In product systems, we do not optimize for abstract universality; we optimize for real users. The correct question is therefore not whether we are overfitting, but what we are overfitting to. Overfitting to a specific one-off case is fragile. Overfitting to a clearly defined user segment’s core needs is **strategic**.

Resolving this tension requires empirical validation rather than intuition alone. Workflow designs should be evaluated through controlled experimentation:

- Preparing multiple prompt or workflow variants.
- Testing them across representative task buckets.
- Observing whether they collapse into narrow patterns or remain robust across diverse cases.

Such experiments are not merely technical benchmarking. They reconnect system design with user reality. By grounding evaluation in authentic usage scenarios, we ensure that any structural bias introduced by workflow design aligns with meaningful user value rather than accidental case-specific optimization.

In this sense, the question of constraints versus generalization becomes an extension of the product principle established earlier: systems should adapt to real user needs, not to arbitrary examples.

#### Self-Reflection and the Limits of Internal CoT

Another subtle challenge emerged when attempting to improve model performance through self-reflection.

In theory, asking a model to reflect on its own Chain-of-Thought (CoT) seems appealing. If it can reason step by step, it should also be able to detect its own mistakes. In practice, however, self-reflection within a single model is surprisingly unreliable.

A model that generated a solution often implicitly reinforces its own reasoning. When asked to review its output, it may rationalize the existing structure rather than critically evaluate it. This makes internal self-correction difficult, especially for structural errors.

This limitation reveals an important boundary of prompt engineering. Simply adding “review your answer carefully” or “double-check for mistakes” does not guarantee genuine correction. Such instructions remain within the same probabilistic reasoning stream.

A more robust approach is to introduce an external judge—either another model instance or a separately prompted evaluator. By decoupling generation and evaluation, we reduce confirmation bias and create clearer responsibility boundaries.

This separation mirrors a broader architectural principle: stability improves when generation and validation are not entangled within a single reasoning trace.

In that sense, self-reflection is not merely a prompt trick. It raises deeper questions about evaluation independence, model bias, and the limits of single-pass reasoning.

#### The Limits of Prompting and the Role of SFT / DPO

These instability issues expose a deeper boundary of prompt engineering: not all behavior can be reliably corrected at inference time.

Prompting operates on the surface of the model’s probability distribution. It nudges attention, restructures reasoning, and introduces workflow constraints. But it does not fundamentally alter the model’s internal representations.

When instability persists across cases—even under well-designed workflows—the issue may no longer be prompt-level. 
This is where **Supervised Fine-Tuning (SFT)** and **Direct Preference Optimization (DPO)** are still essential in the frontier model era.

Unlike prompt engineering, which adjusts reasoning at runtime, SFT and DPO reshape the model at the parameter level:

- SFT aligns the model with curated demonstrations.
- DPO shifts the model toward preferred outputs through preference comparisons.

From a single-model stability perspective, this is fundamentally different. Rather than repeatedly guiding reasoning externally, we modify the model’s internal bias so that desired behaviors become default tendencies.

Prompt engineering improves behavior **locally**. Fine-tuning improves behavior **globally**.

Therefore, while prompt design remains powerful, it cannot replace alignment through data. In systems where stability and consistency matter, SFT and DPO are not optional enhancements—they are structural tools for reducing probabilistic drift at its source.

---

### Final Synthesis

Over these 8 weeks, these lessons did not come from success. They came from building, failing, and reflecting. This document is that record.
