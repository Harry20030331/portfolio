---
title: "Pretrained Models for Visuomotor Control: A Survey"
slug: pretrained-models-for-visuomotor-control
date: 2026-11-16
summary: "How VLA models, world models, and LLM-as-policy systems turn pretrained knowledge into robot actions, and what limits their transfer."
lang: en
status: published
---

## Introduction

Large-scale pretraining is changing how robot policies acquire the capabilities needed for generalization. Learning from robot interaction alone requires costly data collection across diverse tasks, environments, and embodiments. Pretrained models offer access to knowledge acquired from much broader collections of language, images, and video, providing semantic understanding, visual representations, and motion priors that extend beyond a robot's own experience. The central challenge is to translate these capabilities into reliable actions under unfamiliar conditions.

This review organizes recent work by how pretrained knowledge enters action selection. Vision-language-action (VLA) models adapt visual and linguistic representations through robot action training. World-model-based policies use predicted futures to guide action generation and planning. In LLM-as-policy systems, a general-purpose multimodal language model selects robot commands itself. We examine how these pretrained capabilities contribute to robot control and what limits their transfer to unfamiliar tasks. All three share the policy formulation

![Policy formulation: an action chunk sampled from a policy using pretrained model M, conditioned on instruction, recent camera observations, and optional robot state.](pretrained-models-for-visuomotor-control/policy-formulation.svg)

Here *ℓ* is the instruction, *Iₜ₋ₖ:ₜ* the recent camera observations, and *qₜ* the optional robot state. The pretrained model *Mφ* and any additional parameters *θ* determine the next *H* actions. A system can combine several of these roles.

## VLA

Vision-language-action (VLA) models use visual and linguistic features to condition a policy trained on robot demonstrations. OpenVLA ([Kim et al., 2024](https://arxiv.org/abs/2406.09246)) adapts a pretrained vision-language model to predict robot actions as discrete tokens. In π₀ ([Black et al., 2025a](https://www.roboticsproceedings.org/rss21/p010.html)), a dedicated action expert reads the visual and linguistic context and produces a continuous action sequence. Its successor π₀.₅ ([Black et al., 2025b](https://proceedings.mlr.press/v305/black25a.html)) can first infer a language subtask and then execute it. Training across robots, household scenes, and web data allows the policy to perform familiar chores in previously unseen homes.

The main advantage of VLA models is their ability to transfer visual and semantic knowledge into robot control. This provides a foundation for language-conditioned behavior and generalization across objects and environments ([Kim et al., 2024](https://arxiv.org/abs/2406.09246); [Black et al., 2025b](https://proceedings.mlr.press/v305/black25a.html)). A central limitation is that pretrained semantic capabilities may not reliably guide action selection under new conditions. Robot action training can produce strong associations between familiar scenes and demonstrated behaviors, while leaving the policy less responsive to changes in task intent. Consequently, successful execution in familiar settings provides limited evidence of generalizable task understanding ([Jiang et al., 2026](https://arxiv.org/abs/2610.06235)).

## World model

World models predict how the environment may evolve. The approaches reviewed here draw on knowledge of motion and physical interaction acquired through video pretraining ([Hou et al., 2026](https://arxiv.org/abs/2605.00080)). These predictions provide a heuristic that connects pretrained knowledge to action selection. Over a long horizon, predicted futures describe how a task may progress through intermediate states toward the desired outcome, helping the policy decide what to pursue next. Over a short horizon, predictions of object motion and physical interaction guide the current action chunk, either by conditioning action generation or by being refined jointly with the actions.

Gen2Act ([Bharadhwaj et al., 2025](https://proceedings.mlr.press/v305/bharadhwaj25a.html)) uses a frozen video generator to imagine a human demonstration from the instruction and initial image. A separate robot policy reads this reference alongside recent observations, learning from robot demonstrations with auxiliary trajectory supervision. Cosmos Policy ([Kim et al., 2026](https://arxiv.org/abs/2601.16163)) encodes actions, future states, and values as latent frames processed by a single shared video-generation backbone. Its optional planner uses the predicted outcomes and values to select among candidate action chunks. Motus ([Bi et al., 2026](https://arxiv.org/abs/2512.13030)) maintains separate Transformer experts for understanding, video prediction, and action generation, each with its own parameters. Their token streams interact through joint attention at each layer, coupling prediction and control while preserving specialized processing.

The main advantage of world-model-based policies is their ability to use knowledge acquired through video pretraining as predictive guidance for action, potentially supporting tasks beyond the robot demonstrations available for policy training ([Bharadhwaj et al., 2025](https://proceedings.mlr.press/v305/bharadhwaj25a.html)). Realizing this benefit depends on two capabilities. First, the video model must predict futures that reflect the physical conditions and interactions relevant to the task ([Li et al., 2026](https://arxiv.org/abs/2610.12468)). Second, the policy must learn to translate those predictions into executable actions in unfamiliar situations ([Bharadhwaj et al., 2025](https://proceedings.mlr.press/v305/bharadhwaj25a.html); [Kim et al., 2026](https://arxiv.org/abs/2601.16163)). Even when a video model can anticipate a novel manipulation, action generation may remain limited by the coverage of robot training data. Generalization in prediction therefore does not automatically translate into generalization in control, whether actions are generated by a separate expert or a shared backbone.

## LLM as policy

A general-purpose multimodal large language model (LLM) can read observations and select motion targets through a robot command interface. A conventional controller executes each target, and fresh observations inform the next decision. [Zhang et al. (2026)](https://arxiv.org/abs/2609.24170) evaluate this approach with GPT-6 Astra without task-specific fine-tuning, demonstrating direct command selection from visual input and instructions. PEAR ([Tang et al., 2026](https://arxiv.org/abs/2611.18562)) instead develops this capability through reinforcement learning in simulation. Task-success rewards train the language model itself to select end-effector poses, with inverse kinematics and a robot controller handling execution. This offers a way to incorporate robot control into the post-training of a general reasoning model.

The main advantage is that robot command generation becomes part of a general-purpose model's capabilities, allowing its broader knowledge and reasoning to participate directly in control ([Zhang et al., 2026](https://arxiv.org/abs/2609.24170); [Tang et al., 2026](https://arxiv.org/abs/2611.18562)). Robot interaction can further develop this capability, with PEAR demonstrating transfer from simulation to real robots while retaining performance on broader reasoning and vision benchmarks ([Tang et al., 2026](https://arxiv.org/abs/2611.18562)). Its central limitation is the trade-off between reasoning quality and feedback latency. Longer reasoning can improve action selection while delaying corrections ([Tang et al., 2026](https://arxiv.org/abs/2611.18562)), which is particularly consequential for tasks requiring precise or rapid physical interaction. Precision, dynamic manipulation, and coordinated two-arm control remain challenging in current evaluations ([Zhang et al., 2026](https://arxiv.org/abs/2609.24170)).

Taken together, these approaches reflect a shift in how pretrained intelligence participates in robot control. VLA models adapt visual and linguistic knowledge to action learning, while world-model-based policies bring predictive knowledge into planning and control. LLM-as-policy approaches extend this direction by making robot interaction a domain in which a general-purpose model itself learns to reason and act. As multimodal capabilities grow, robotics may increasingly become part of the development of general-purpose intelligence, with physical interaction both drawing on and extending the model's existing capabilities.

## References

- H. Bharadhwaj et al. [Gen2Act: Human Video Generation in Novel Scenarios Enables Generalizable Robot Manipulation](https://proceedings.mlr.press/v305/bharadhwaj25a.html). CoRL, 2025.
- H. Bi et al. [Motus: A Unified Latent Action World Model](https://arxiv.org/abs/2512.13030). CVPR, 2026.
- K. Black et al. [π₀: A Vision-Language-Action Flow Model for General Robot Control](https://www.roboticsproceedings.org/rss21/p010.html). RSS, 2025a.
- K. Black et al. [π₀.₅: A Vision-Language-Action Model with Open-World Generalization](https://proceedings.mlr.press/v305/black25a.html). CoRL, 2025b.
- B. Hou et al. [World Model for Robot Learning: A Comprehensive Survey](https://arxiv.org/abs/2605.00080). arXiv:2605.00080, 2026.
- S. Jiang et al. [Encoded but Not in Control: Revealing the Grounding Gap in Vision-Language Robot Policies](https://arxiv.org/abs/2610.06235). arXiv:2610.06235, 2026.
- M. J. Kim et al. [OpenVLA: An Open-Source Vision-Language-Action Model](https://arxiv.org/abs/2406.09246). CoRL, 2024.
- M. J. Kim et al. [Cosmos Policy: Fine-Tuning Video Models for Visuomotor Control and Planning](https://arxiv.org/abs/2601.16163). ICLR, 2026.
- J. Li et al. [DreamTrue: Action-Faithful Robot World Model with Counterfactual Post-Training](https://arxiv.org/abs/2610.12468). arXiv:2610.12468, 2026.
- J. Tang et al. [Training Reasoning Models in Simulation to Natively Use Real Robots](https://arxiv.org/abs/2611.18562). arXiv:2611.18562, 2026.
- W. Zhang et al. [An Unexpected Robot Policy: Early Evaluations of GPT-6 Astra on RoboDojo and Beyond](https://arxiv.org/abs/2609.24170). arXiv:2609.24170, 2026.
