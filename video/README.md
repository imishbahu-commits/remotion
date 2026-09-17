# The Netflix Trick That Hacked Your Brain — Remotion build

Vertical short built from `netflix-autoplay-short-storyboard.pdf`.

**Output:** `out/netflix-autoplay-short.mp4` — 1080×1920, 30fps, 60.00s (1800 frames), H.264.

## Run it

```bash
cd video
npm install
npm run dev      # Remotion Studio (scrub the timeline, tweak, preview)
npm run render   # writes out/netflix-autoplay-short.mp4
```

### Rendering in this sandbox

Remotion's Chrome download host is blocked here, so a Chromium binary was sourced from npm
(`@sparticuz/chromium`) plus its NSS shared libraries. To reproduce:

```bash
export LD_LIBRARY_PATH=/tmp/chromelibs/lib:$LD_LIBRARY_PATH
npx remotion render NetflixAutoplayShort out/video.mp4 \
  --browser-executable=/tmp/chromium --concurrency=2
```

On a normal machine you can drop both flags — Remotion fetches its own browser.

## Structure

```
src/
  Root.tsx                    composition registration (1080x1920, 30fps, 1800f)
  NetflixAutoplayShort.tsx    scene timeline + global grade/grain
  config/
    theme.ts                  colours, safe margins, spring constants, grade timing
    stats.ts                  >> ALL PLACEHOLDER NUMBERS LIVE HERE <<
    fonts.ts                  Archivo Black (headline) + Inter (UI), bundled locally
  components/
    Plate.tsx                 storyboard image + per-shot Ken Burns move
    KineticText.tsx           word-by-word, letter-by-letter, clause stack, labels
    Numerals.tsx              CountUp (tabular figures), PunchNumber, StatLabel
    Transitions.tsx           whip-blur, vertical wipe, fades, impact flash
    Grade.tsx                 single shared LUT-style grade + film grain
  scenes/                     one file per storyboard scene
public/
  storyboard/                 the 15 generated 1080x1920 plates
  fonts/                      woff2 files
```

## Frame map (matches the shot list exactly)

| Scene | Frames | Content |
|-------|--------|---------|
| 1 Hook | 0–120 | 1.1 phone autoplay (3% push-in) · 1.2 thumb hovers Cancel |
| 2 Setup | 120–300 | 2011 vs Today device cards, right slides in over 15f |
| 3 Mechanism | 300–660 | Zeigarnik letter reveal · finished/unfinished · stat card |
| 4 Proof | 660–1050 | 4 B-roll beats @ 90f, hard cuts, varied Ken Burns |
| 5 Stakes | 1050–1440 | CountUp 0→3.0 · 0.3s black beat · "9 YEARS" punch |
| 6 Resolution | 1440–1680 | Cancel pressed, loop ring closes, cool→warm grade |
| 7 Outro | 1680–1800 | End card, follow icon pulses on a 1s loop |

Transition map from §2 of the brief is implemented in `Transitions.tsx` and applied at the
frame offsets above (whip-blur 6f, vertical wipe 8f, fade-to-black 15f + 9f hold, fade 10f).

## Deviations from the storyboard, and why

1. **Scene 2 is two device cards, not a 50/50 split.** The generated plates are full 9:16 phone
   mockups; slicing the frame in half cut each phone down the middle and the two halves read as
   one broken device. Both UIs are now fully visible, which is the actual point of the comparison.
2. **Scene 4 runs 660–1050 as specced, but the fade starts at frame 366 of the scene**
   (not 345) so the black hold is exactly 0.3s rather than ~1s.
3. **No audio.** VO, music and SFX are not included — see below.

## Not done yet

- **Audio.** No VO, music bed or SFX. The timeline is cut to the storyboard's VO pacing
  (~2.5 words/sec), so narration should drop in close to sync, but kinetic text timings will
  need nudging against a real recording. Sub-bass hit belongs on frame 1245 (the "9 YEARS"
  impact); UI ticks on each countdown change; whoosh on each wipe.
- **Real statistics.** Everything in `src/config/stats.ts` is a pacing placeholder
  (90%, 3.0 hrs/day, 9 years). Source them and set `verified: true` before publishing.
- **Music licensing.**

## Brand safety

Plates were generated with explicit "no logos / no brand marks" constraints and all streaming UI
is generic. The title references a real company — do a final review pass before publishing.
