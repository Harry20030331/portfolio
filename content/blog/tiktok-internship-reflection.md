---
title: "Reflections on My TikTok Internship"
slug: tiktok-internship-reflection
date: 2026-09-10
summary: "Reflections on evidence, technical influence, learning with agents, and the strengths and friction of a mature engineering organization."
lang: en
status: published
---

My TikTok internship was my first experience working inside a large, mature technology company. Working on recommendation systems gave me a close view of the engineering practices, infrastructure, and organizational knowledge built through years of development in the internet industry.

This experience shaped my understanding of engineering and prompted me to reflect on the strengths of a mature organization and the challenges it faces in the AI era.

## 1. Building a Disciplined Experiment Loop

**Get the loop working, then improve it.**

The first milestone is a working path through training, evaluation, and feedback. I learned to treat the first run as the beginning of an investigation, with a pipeline that makes subsequent experiments easier to run and compare. Strong results usually require repeated iteration.

**Ground Each Experiment in Evidence and Reasoning**

Each experiment should follow a clear chain of reasoning: what I observed, what might explain it, what the data supports, and why the proposed change could matter.

A hypothesis needs scrutiny before it becomes a training run. A focused data analysis can help determine whether the suspected mechanism exists and whether its effect is large enough to warrant an experiment. If the result falls short, that reasoning gives me a starting point for understanding why.

**Make the Path to Impact Visible**

In a complex system, a change in model output may pass through several stages before affecting the metric I care about. For example, a prediction must influence ranking, change exposure, and affect user behavior before its value appears in an online result.

Intermediate metrics help locate where that chain holds or breaks. They give parameter changes a more interpretable connection to system behavior and help identify the next useful check. The final outcome still needs evaluation, while the intermediate evidence makes the investigation more directed.

## 2. Technical Ability and Technical Influence

My internship helped me see two important dimensions of contributing in a large company:

- **Technical ability:** carrying a project through to launch and making a concrete contribution to online metrics and business outcomes.
- **Technical influence:** turning my reasoning and methods into something others can understand and use, helping the team develop a deeper understanding of its work.

**Making a method useful to others also deepens my own understanding.** I need to explain the problem clearly, identify the assumptions behind my approach, and show when the method applies. Questions from other people expose gaps and help refine the reasoning.

During my internship, the launch document brought the project's results and evidence together. The reusable skill kit organized the investigative methods for others to try and adapt.

Presenting the project for review strengthened my sense of **ownership**. When colleagues read the work carefully, discussed it, and asked questions, I felt that the project mattered to others. I was responsible for explaining the reasoning, responding to scrutiny, and following through.

Sharing the methods gave me a concrete way to think about **impact**: could they actually help someone else investigate a problem or make a better decision? I wanted the understanding I had developed to become useful in other people's work and contribute to the team's shared knowledge.

## 3. Continuous, Problem-Driven Learning

Technology is changing quickly, and new tools and ideas are reshaping how we work and live. I want to remain open to these changes and keep learning. Simply keeping up with what is new, however, can leave me with only a superficial understanding. For me, continuous learning needs to be problem-driven: connecting new knowledge to practical problems and putting it to use.

**From a new capability to understanding where it fits.**

When I tried **Codex Voice Chat**, I found it useful for discussing the assumptions behind an experiment. We could explore what might explain an unexpected result, challenge the hypothesis, and refine it together. The back-and-forth made it easy to express tentative ideas and iterate with little friction.

For straightforward experiment execution, **dictation** was often enough. I could take time to decide what I wanted to test, then dictate a concise instruction for the agent to carry out.

**From a practical problem to targeted learning.**

When my project documents, notes, and other assets became difficult to keep track of, I turned to [LangChain's memory guide](https://docs.langchain.com/oss/python/concepts/memory). Its discussion of long-term memory distinguishes three types:

- **Semantic memory:** facts and knowledge.
- **Episodic memory:** past events, actions, and experiences.
- **Procedural memory:** instructions and ways of performing tasks.

I used this distinction to organize my own materials more clearly: reusable knowledge, records of past work, and procedures for future tasks. The practical problem gave me a reason to learn the framework and a way to apply it. I could assess its usefulness by whether important context became easier to maintain and retrieve.

In both directions, learning becomes more meaningful when it changes something in my work. Applying and combining knowledge helps me understand its properties, develop judgment about when to use it, and produce a useful result.

## 4. What I Observed in a Mature Organization

Working in this environment also made me think about how a mature organization can adapt to the AI era.

**Documentation as shared context.**

TikTok's strong documentation culture provides a valuable foundation for agents. Processes, technical knowledge, and prior decisions give them substantial context for understanding and carrying out work.

The quality of that context matters. Outdated guidance, repetitive documents, and material with little useful information can interfere with retrieval and interpretation. The challenge is to organize and maintain this large collection as a reliable shared knowledge base, where agents can consistently find relevant, current information.

**Connecting platforms built for people.**

Years of development have produced sophisticated dashboards for specific tasks. Their visual interfaces make information easy for people to inspect and operations convenient to perform.

For agents working through text and tool calls, recovering information and operating through those interfaces can be cumbersome. Tasks spread across separate platforms also require repeated handoffs, fragmenting execution and collaboration. A more AI-native integration would expose the underlying information and actions through interfaces agents can reliably access and combine, supporting coherent workflows and faster iteration.

**Permissions that balance safety and efficiency.**

Access controls and approval processes serve important security needs. As an intern, I also experienced how limited access and repeated waits constrained what I could do and slowed progress.

Agents face similar friction when a workflow repeatedly stops for additional permissions. The challenge is to provide a clearly bounded execution environment with sufficient access for the agreed work, supported by safeguards at the company level. That would allow agents to operate safely and consistently while reducing the coordination delays that interrupt execution.

---

My internship gave me a strong appreciation of TikTok’s engineering capabilities. I see adapting those capabilities to more AI-native ways of working as a major challenge. How effectively its engineering teams make that transition will be an important factor in its future technical competitiveness.
