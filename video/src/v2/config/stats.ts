/**
 * ============================================================================
 * OPEN ITEM #1 — STILL BLOCKING, AND THE RESEARCH CHANGED THE STORY.
 * ============================================================================
 *
 * I went looking for a citable figure for "casinos remove clocks, therefore
 * you lose N% more time". It does not exist, and the reason matters more than
 * the missing number:
 *
 *   - Mark Griffiths (Nottingham Trent), reviewing 15+ empirical studies on
 *     casino design, found NO conclusive research on the effect of windows or
 *     wall clocks on gamblers. His own review concludes there is "little
 *     empirical research on the effect" of the no-clocks/no-windows features
 *     that "many authors have commented upon".
 *     https://irep.ntu.ac.uk/id/eprint/4044/
 *
 *   - Bill Friedman — the casino designer who literally wrote the rulebook on
 *     windowless casino design — publicly calls it a myth that clocks and
 *     windows were removed "to manipulate players to gamble longer", saying
 *     serious players demanded their removal. Operators cite screen glare and
 *     HVAC load as the practical reasons.
 *     https://www.casino.org/news/vegas-myths-busted-casinos-sunlight-and-clocks-to-trick-gamblers/
 *
 * So the specific causal claim the script leans on — no clocks => measurably
 * longer sessions — is NOT established. Publishing a hard percentage next to
 * it would be inventing evidence for a contested claim.
 *
 * WHAT *IS* WELL SUPPORTED (and is the honest version of this story):
 *
 *   - Noseworthy & Finlay (2009), J. Gambling Studies 25:331-342, n=160 slot
 *     players: the typical ambient casino soundscape "promotes understated
 *     estimates of elapsed duration of play" — players systematically
 *     UNDERESTIMATE how long they have been playing. Adding slow, loud music
 *     gave players a temporal cue and made their estimates MORE accurate.
 *     https://doi.org/10.1007/s10899-009-9136-x
 *
 *   - Diskin & Hodgins (1999, 2001): problem VLT gamblers took roughly TWICE
 *     as long as occasional gamblers to respond to irrelevant light stimuli
 *     while playing — measurable narrowing of attention / dissociation.
 *
 *   - Finlay et al. and Marmurek et al. (U. Guelph): casino layout and decor
 *     measurably shift at-risk gambling intentions.
 *
 * RECOMMENDED EDITORIAL FIX (needs your call — see notes/SCENE-4-STAT.md):
 * retarget Scene 4 from "no clocks makes you stay X% longer" to the claim the
 * evidence actually supports — that the engineered SENSORY environment makes
 * people underestimate elapsed time. Same emotional beat, defensible.
 *
 * Until you choose, `verified` stays false and every render is watermarked
 * "DO NOT PUBLISH — STAT UNSOURCED". It is not possible to quietly ship this.
 */

export type SourcedStat = {
	value: number;
	display: string;
	label: string;
	verified: boolean;
	/** Full citation. Must be non-null when verified. */
	source: string | null;
};

export const TIME_DISTORTION: SourcedStat = {
	// PLACEHOLDER — pacing only. Not a real finding.
	value: 0,
	display: '—',
	label: 'PLACEHOLDER — NEEDS SOURCED FIGURE',
	verified: false,
	source: null,
};

/**
 * Pre-filled, defensible alternative. Swap this in for TIME_DISTORTION if you
 * accept the editorial retarget above; it is already sourced.
 */
export const UNDERESTIMATION_ALT: SourcedStat = {
	value: 160,
	display: '2x',
	label: 'Slower to notice the world around them',
	verified: true,
	source:
		'Diskin & Hodgins (1999/2001) — problem VLT gamblers responded ~twice as slowly as occasional gamblers to irrelevant light stimuli while playing. J. Gambling Studies 15(1) 17-28; Can. J. Behav. Sci. 33(1) 58-64.',
};

/** True when every stat used on screen has been sourced. */
export const ALL_STATS_VERIFIED = [TIME_DISTORTION].every(
	(s) => s.verified && s.source,
);
