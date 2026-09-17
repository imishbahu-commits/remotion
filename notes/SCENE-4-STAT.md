# Open Item #1 — Scene 4 statistic: BLOCKING, and the research changed the story

**Status: unresolved, needs your editorial decision. Every render is currently
watermarked `DO NOT PUBLISH — STAT UNSOURCED` until it is.**

You asked me to source a real statistic for Scene 4. I could not, and the
reason is more consequential than a missing number.

## The claim the script currently makes is contested

The v2 script leans on: *casinos remove clocks, therefore people stay
measurably longer.* Searching for a citable figure surfaced the opposite:

- **Mark Griffiths** (Nottingham Trent), reviewing **15+ empirical studies** on
  casino design, found **no conclusive research** on the effect of windows or
  wall clocks on gamblers. His review closes by noting that the no-clocks /
  no-windows features "many authors have commented upon" have **"little
  empirical research on the effect."**
  <https://irep.ntu.ac.uk/id/eprint/4044/>

- **Bill Friedman** — the casino designer who wrote the rulebook on windowless
  casino design — publicly calls it a **myth** that clocks and windows were
  removed "to manipulate players to gamble longer," saying serious players
  demanded their removal. Operators cite screen glare and HVAC load.
  <https://www.casino.org/news/vegas-myths-busted-casinos-sunlight-and-clocks-to-trick-gamblers/>

- Horseshoe Casino's GM calls the clocks explanation a "conspiracy theory"
  in the same 2011 Time Out piece that cites the Griffiths review.

Putting a hard percentage next to this claim would mean **inventing evidence
for a contested premise.** I won't ship that silently, hence the watermark.

## What the evidence actually supports

There *is* solid research on casino time distortion — it just points at the
**sensory environment**, not the absence of clocks:

| Finding | Source |
|---|---|
| The typical ambient casino soundscape "promotes understated estimates of elapsed duration of play" — players systematically **underestimate** how long they've played. n=160 slot players. Adding slow, loud music gave them a temporal cue and made estimates **more accurate**. | Noseworthy & Finlay (2009), *J. Gambling Studies* 25:331–342, [doi:10.1007/s10899-009-9136-x](https://doi.org/10.1007/s10899-009-9136-x) |
| Problem VLT gamblers took roughly **twice as long** as occasional gamblers to respond to irrelevant light stimuli while playing — measurable attentional narrowing / dissociation. | Diskin & Hodgins (1999) *JGS* 15(1):17–28; (2001) *Can. J. Behav. Sci.* 33(1):58–64 |
| Casino layout and décor measurably shift at-risk gambling intentions; floor layout and theme matter most to players. | Finlay, Kanetkar, Londerville & Marmurek (2006); Marmurek et al. (2007), U. Guelph |
| Red light + casino sounds eliminates the normal cognitive slowdown after losses — faster decisions, less reflection. | Reviewed in *The Conversation*, Jun 2025 |

## Three options

1. **Retarget Scene 4 (recommended).** Keep the hook — "Why Casinos Have No
   Clocks" is still a true observation about the buildings — but make the
   *evidentiary* beat about the engineered sensory environment causing people
   to underestimate elapsed time. Same emotional payload, defensible. A
   pre-filled `UNDERESTIMATION_ALT` stat (the Diskin & Hodgins 2x figure) is
   already sitting in `video/src/v2/config/stats.ts`; swapping it in flips
   `verified` to true and the watermark disappears automatically.

2. **Lean into the myth-busting.** The strongest version of this video might
   be that the clocks story is *itself* folk wisdom, and the real manipulation
   is subtler — sound, light, layout, free drinks. This is a better video, but
   it needs a VO rewrite.

3. **Supply your own sourced figure.** Fill in `TIME_DISTORTION` and set
   `verified: true`.

Scene 4's VO was already rewritten to keep the unsourced number out of the
narration, so the spoken track survives options 1 and 3 unchanged.

## How the guard works

`video/src/v2/config/stats.ts` is the single source of truth. While
`verified` is false, `StatBlock` renders a red `DO NOT PUBLISH — STAT
UNSOURCED` badge over the stat in every frame of Scene 4. Setting `verified:
true` with a non-null `source` removes it. There is no way to ship the
placeholder by accident.
