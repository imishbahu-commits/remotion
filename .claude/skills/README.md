# Installed agent skills

Third-party skill packs installed for this project, in addition to Remotion's own skills.

> Remotion's first-party skills live in `packages/skills/skills/` and are symlinked into
> `.agents/skills/`. **Do not** add third-party skills there — that directory is the
> published `@remotion/skills` package and is policed by `bun run checkskills`.
> Everything in this directory is project-local.

## Precedence in this repo

This is the Remotion monorepo, and `video/` is a Remotion project.

1. **Remotion is the render runtime here.** The HyperFrames router advertises itself as a
   "mandatory entry point" whose default output framework is HyperFrames. That default does
   **not** apply in this repo — we have explicitly chosen Remotion for the deliverable.
   Use the HyperFrames skills for motion-design vocabulary, animation/keyframe craft, and
   the block catalogue; don't let the router migrate `video/` to HTML compositions.
2. **`remotion-best-practices` wins on API questions** (`.agents/skills/`). The packs below
   are for *craft* — timing, easing, composition, colour — not Remotion API truth.
3. **OpenMontage is reference-only.** See the licence warning below.

## What's installed

| Pack | Skills | Licence | Use for |
|------|--------|---------|---------|
| [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | `motion-design` | MIT | Universal motion principles — the three pillars, motion personality archetypes, duration/easing tables, Disney's 12 principles adapted for UI, choreography, troubleshooting ("looks robotic", "feels cheap") |
| [iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills) | `animation-principles`, `color-motion`, `shot-composition`, `motion-art-direction`, `beat-sync-editing`, `remotion-video`, `logo-animation`, `motion-background`, `after-effects` | MIT | Motion-graphics craft. `shot-composition` covers safe areas and focal hierarchy across aspect ratios; `beat-sync-editing` covers cutting to music; `color-motion` covers grading and OKLCH interpolation |
| [raintree-technology/apple-hig-skills](https://github.com/raintree-technology/apple-hig-skills) | `hig-foundations`, `hig-platforms`, `hig-patterns`, `hig-inputs`, `hig-technologies`, `hig-project-context`, and 8 `hig-components-*` | See upstream | Apple Human Interface Guidelines — typography, semantic colour, SF Symbols, layout, safe areas, dark mode, accessibility, across iOS/macOS/visionOS/watchOS/tvOS |
| [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | 20 skills — router `hyperframes`, plus `hyperframes-core`, `-animation`, `-keyframes`, `-creative`, `-audio`, `-cli`, `-registry`, `media-use`, `figma`, and the creation workflows (`motion-graphics`, `faceless-explainer`, `product-launch-video`, `music-to-video`, `embedded-captions`, `talking-head-recut`, `pr-to-video`, `slideshow`, `general-video`, `remotion-to-hyperframes`) | Apache-2.0 | HTML-native video craft. Read `hyperframes-animation` and `hyperframes-keyframes` for seek-safe animation theory that transfers directly to Remotion's frame-driven model |
| [kufeng76/OpenMontage](https://github.com/kufeng76/OpenMontage) | `openmontage` (12 pipelines + core/creative/meta) | **AGPL-3.0-only** | Production orchestration above the renderer — pipeline selection, stage directors, provider scoring, pre-compose validation and post-render self-review |

44 skill directories total, ~21 MB.

## Licence warning

**OpenMontage is AGPL-3.0-only** — stronger copyleft than anything else here, and than
Remotion's own licence. It is vendored as **agent reference knowledge only**. Do not copy
code or substantial text from `openmontage/` into `packages/**` or into any shipped
artifact. The other four packs are MIT or Apache-2.0 and are safe to learn from.

Only OpenMontage's Markdown knowledge was vendored; its Python toolchain (`tools/`,
`pipeline_defs/`, `schemas/`) was not, so skills that invoke a tool binary are not
executable here.

## Relevance to `video/`

For the Netflix autoplay short in `video/`, the directly useful ones are:

- `motion-design` and `animation-principles` — validate the spring constants and easing.
  The storyboard's punch spring (damping 10 / stiffness 120) reads as the "Energetic"
  archetype; the Scene 6 resolution deliberately slows to "Premium".
- `shot-composition` — 9:16 safe areas, which is what `SAFE` in `src/config/theme.ts` encodes.
- `color-motion` — the cool-blue-to-warm-gold grade transition.
- `beat-sync-editing` — pending audio work; the sub-bass hit on the "9 YEARS" frame.
- `hig-foundations` — the phone UI mockups in the plates should read as plausible iOS.

## Reinstalling

```bash
npx skills add LottieFiles/motion-design-skill --skill '*' --agent claude-code --copy -y
npx skills add iart-ai/motion-design-skills   --skill '*' --agent claude-code --copy -y
npx skills add raintree-technology/apple-hig-skills --skill '*' --agent claude-code --copy -y
npx skills add heygen-com/hyperframes         --skill '*' --agent claude-code --copy -y
# OpenMontage ships no SKILL.md files, so it is vendored manually:
#   git clone --depth 1 https://github.com/kufeng76/OpenMontage
#   cp -r OpenMontage/skills/* .claude/skills/openmontage/
```

`--copy` is deliberate: it writes real files instead of symlinking into a temp checkout,
so the skills survive in the repo.
