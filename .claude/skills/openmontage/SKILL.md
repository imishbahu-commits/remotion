---
name: openmontage
description: Agentic video production pipelines — 12 end-to-end pipelines (explainer, cinematic, animation, documentary montage, clip factory, talking head, screen demo, podcast repurpose, localization/dub, avatar, hybrid, character animation) with stage director skills, creative technique playbooks, provider selection, and quality-gate/reviewer protocols. Use when planning or orchestrating a full video production from brief to render, choosing between Remotion and HyperFrames as the render runtime, picking a pipeline for a video request, or applying production governance like pre-compose validation and post-render self-review.
license: AGPL-3.0-only
metadata:
  upstream: https://github.com/kufeng76/OpenMontage
  vendored: 2026-09-17
  tags: video, production, pipelines, agentic, remotion, hyperframes
---

# OpenMontage

Vendored from [OpenMontage](https://github.com/kufeng76/OpenMontage) — an agentic video
production system. This directory holds its **Layer 2** knowledge: how a production is
staged, governed, and reviewed.

> **Licence warning — read before reusing.** OpenMontage is **AGPL-3.0-only**, which is
> stronger copyleft than everything else in this repo. The `LICENSE` file here is the
> upstream text. Treat this directory as **reference knowledge for agents**, not as a
> source to copy code from into Remotion packages. Copying AGPL code into
> `packages/**` would create a licence conflict with Remotion's own licence.

## Start here

1. [`INDEX.md`](INDEX.md) — full skill index and the 3-layer knowledge architecture.
2. [`AGENT_GUIDE.md`](AGENT_GUIDE.md) — the agent contract for running a production.
3. Pick a pipeline under [`pipelines/`](pipelines), then read its stage director skills.

## Layout

| Path | What's in it |
|------|--------------|
| [`core/`](core) | Engine-level skills — `remotion.md`, `hyperframes.md`, `ffmpeg.md`, `color-grading.md`, `subtitle-sync.md`, `whisperx.md` |
| [`creative/`](creative) | Technique playbooks — cinematic, b-roll planning, data-viz, image/music generation, enhancement strategy, prompting |
| [`meta/`](meta) | Cross-cutting protocol — `reviewer.md`, `checkpoint-protocol.md`, `creative-intake.md`, `taste-direction.md`, `animation-runtime-selector.md` |
| [`pipelines/`](pipelines) | The 12 production pipelines, each with per-stage director skills |

## Why it's here

This repo already builds videos with Remotion. OpenMontage adds the layer *above* the
renderer: how to choose a pipeline, stage a production, select providers, and gate
quality before and after a render. `core/remotion.md` and
`meta/animation-runtime-selector.md` are the useful entry points for deciding when
Remotion is the right runtime versus HyperFrames.

Note that upstream expects a full Python toolchain (`tools/`, `pipeline_defs/`,
`schemas/`). Only the Markdown knowledge is vendored here — the Python tools are not.
Skills that call a tool binary won't be executable in this checkout; read them as
guidance and substitute the equivalent local step.
