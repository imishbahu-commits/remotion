# Storyboard assets — "The Netflix Trick That Hacked Your Brain"

9:16 vertical · 1080×1920 · 30fps · 1800 frames (60s)

Generated from `netflix-autoplay-short-storyboard.pdf` — one image per image-prompt in the shot list.
`manifest.json` maps every shot ID → file → frame range → VO line → on-screen text, ready to drive a
Remotion `<Series>`.

## Shot index — all 15 complete

| Shot | Scene | Frames | File |
|------|-------|--------|------|
| 1.1 | Hook | 0–60 | `shot-1-1-phone-autoplay-countdown.png` |
| 1.2 | Hook | 60–120 | `shot-1-2-thumb-hover-cancel.png` |
| 2.1a | Setup (left) | 120–300 | `shot-2-1a-left-panel-2011-manual-play.png` |
| 2.1b | Setup (right) | 120–300 | `shot-2-1b-right-panel-today-autoplay.png` |
| 3.1 | Mechanism | 300–420 | `shot-3-1-zeigarnik-brain-open-loop.png` |
| 3.2 | Mechanism | 420–540 | `shot-3-2-finished-vs-unfinished.png` |
| 3.3 | Mechanism | 540–660 | `shot-3-3-stat-card.png` |
| 4.1 | Proof | 660–750 | `shot-4-1-silhouette-couch-tv.png` |
| 4.2 | Proof | 750–840 | `shot-4-2-countdown-macro.png` |
| 4.3 | Proof | 840–930 | `shot-4-3-are-you-still-watching.png` |
| 4.4 | Proof | 930–1020 | `shot-4-4-engineer-late-night.png` |
| 5.1 | Stakes | 1050–1230 | `shot-5-1-hours-per-day-bg.png` |
| 5.2 | Stakes | 1230–1440 | `shot-5-2-calendar-pages-flipping.png` |
| 6.1 | Resolution | 1440–1680 | `shot-6-1-thumb-presses-cancel-warm.png` |
| 7.1 | Outro | 1680–1800 | `shot-7-1-end-card.png` |

## Plates reserved for kinetic type

These four are intentionally empty in the center — numerals and headlines are composited in Remotion,
never baked into the image:

- **3.3** dark glassmorphic card → percentage stat
- **5.1** clock/calendar bokeh → CountUp `0 → 3.0 HOURS/DAY`
- **5.2** flying pages, dark center → `9 YEARS` punch reveal
- **7.1** navy/gold end card → CTA headline

## Continuity notes

- **6.1 is a deliberate callback to 1.2.** It was image-to-image generated *from* 1.2 so the camera
  framing, phone angle and macro crop match exactly — the only change is hover → press and
  cool blue → warm gold. Cutting between them reads as the same moment resolved.
- **Apply one shared LUT** at the Remotion top level. The sources don't natively match each other;
  the grade is what makes the Scene 4 montage read as one sequence.
- **Vary Ken Burns 2–5%** and direction per shot so the repeated motion doesn't feel mechanical.

## Known limitations

- Native generation is 768×1376; all files were upscaled with a center-crop `extent` to exact
  1080×1920. Interpolated, not natively sharp at full res — fine under fast cuts and slight zooms.
- Small UI text inside the photoreal frames (1.2, 4.2, 6.1) is decorative gibberish at 100% zoom,
  as generators can't render clean type. It reads fine at playback scale; if a shot lingers,
  mask and re-letter it in Remotion.
- **Stats are placeholders.** 3.3, 5.1 and 5.2 need sourced figures before publishing.
- Prompts excluded logos and brand marks and the outputs look clean, but eyeball them before
  publishing since the title names a real company.

## Usage

Copy into a Remotion project's `public/` and reference with `staticFile()`:

```tsx
import {staticFile, Img} from 'remotion';
<Img src={staticFile('storyboard/shot-1-1-phone-autoplay-countdown.png')} />
```
