---
title: "Recommendation Systems in the AI Era"
slug: recommendation-in-the-age-of-agents
date: 2026-09-25
revised: 2026-10-08
summary: "How a shared agent interface brings search and recommendation together, and why matching people with choices remains a long-term problem."
lang: en
status: published
---

I expect recommendation to become core infrastructure for personal agents. As more of our daily decisions pass through one interface, agents will help us work out what we need and choose among a growing range of possibilities.

## 1. Search and Recommendation Through One Interface

Search and recommendation both respond to human needs. A useful distinction is who turns a situation into a specific direction for finding something.

- **Search starts with an expressed request.** I decide that I need headphones for my commute and ask for options. The system finds candidates that respond to that need, potentially using my preferences and history as well.
- **Recommendation can start without a specific request.** I open a video app because I am bored and want to be entertained. That is a need, even though I have not said what I want to watch. The system uses my history, preferences, and current behavior to suggest something.

Traditional products often give these interactions separate entrances: a search box for a request, a feed for suggestions. A personal agent could bring both through the same interface, choosing when to search, recommend, or combine them.

Suppose I say, “I’m tired after work and want to unwind, but I don’t want to spend the evening scrolling.” I have described a situation without deciding what to look for. An agent might help me consider a film, a short book, or a nearby activity, then find and compare suitable options.

**Forming and expressing a need takes mental effort.** An agent can take on some of that work by helping turn feelings and rough ideas into a concrete direction. This brings search and recommendation closer together at the interface, while leaving room for distinct retrieval and ranking mechanisms underneath.

## 2. Why Recommendation Becomes Infrastructure

Two changes make this matching problem more important:

- **Richer personal context.** If more activities pass through an agent, it can learn across conversations, plans, purchases, reading, and other experiences. Its understanding could extend beyond the behavior visible to any single app.
- **More candidates.** As content and services become easier to produce, the range of possibilities grows. Finding something worth considering becomes a substantial part of the task.

**Recommendation solves a matching problem: which available options fit this person’s needs, preferences, and current circumstances?** Shopping, reading, travel, and leisure all require this capability. Its repeated use across tasks is why I see it becoming shared infrastructure.

Scale also calls for a division of computation. If every candidate requires a long, autoregressive LLM response, latency and cost can grow substantially. Many screening decisions only need a score or a selection among existing options.

**Retrieval → coarse ranking → fine ranking.**

**Experience from recommendation systems remains valuable here.** Efficient retrieval and staged ranking provide a foundation for handling large candidate pools. Generative models can contribute to interpreting needs, comparing a smaller set, and explaining choices. Agent pipelines can build on this accumulated engineering knowledge. [Google’s architecture overview](https://developers.google.com/machine-learning/recommendation/overview/types)

A recent example is Jev: TypeSafe describes it as returning structured decisions with probabilities for tasks such as classification, routing, and scoring. I see this as a useful direction for combining specialized decision models with generative models inside agents. [TypeSafe’s Jev introduction](https://typesafe.ai/blog/introducing-system-one-models-and-jev)

## 3. A Richer Matching Problem

Recommendation systems already learn from behavior and context. With richer personal information, an agent can understand needs in greater detail and identify which candidate attributes matter for a particular choice.

Knowing that I prefer nearby activities makes distance important; knowing my schedule brings opening hours and duration into the comparison. These attributes already exist. A deeper understanding of me makes their relevance clearer. **The matching problem becomes richer on both sides.**

That understanding needs corresponding candidate data. In my current use of agents, recommendations are limited by the sources they can access. Native access to product and service data could provide richer attributes and current availability, reducing the work of reconstructing that information from web pages. The system needs enough evidence about both the person and the options to make a good match.

## 4. Long-Term Value Beyond a Single Choice

I might spend hours watching videos and dislike the platform enough to avoid it the next day. A recommendation can hold my attention today and make me less willing to return tomorrow.

As agents help with more everyday decisions, these effects build up. A purchase might disappoint me a week later; an activity might leave me glad I followed the suggestion. What looks suitable now may feel different afterward.

Good recommendations save effort, earn trust, and lead to experiences I value, including entertainment and relaxation. Recommendation systems have accumulated experience in understanding these outcomes, and that experience remains useful for agents.

**Making recommendations may become a basic capability. What will distinguish agents is how well their choices fit someone’s needs and whether those choices still feel worthwhile afterward.**
