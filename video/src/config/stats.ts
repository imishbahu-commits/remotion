/**
 * EVERY NUMBER IN THIS FILE IS A PACING PLACEHOLDER.
 *
 * Open item #1 from the storyboard: "Source and verify real statistics for
 * Shots 3.3 and 5.1/5.2" — replace the values below with sourced figures and
 * fill in `source` before publishing. Nothing else in the codebase hardcodes
 * a number, so this is the only file you need to touch.
 */

export type Stat = {
	value: number;
	display: string;
	label: string;
	verified: boolean;
	source: string | null;
};

export const STAT_OPEN_LOOP: Stat = {
	value: 90,
	display: '90%',
	label: 'OF VIEWERS LET THE NEXT EPISODE ROLL',
	verified: false,
	source: null,
};

export const STAT_HOURS_PER_DAY: Stat = {
	value: 3.0,
	display: '3.0',
	label: 'HOURS / DAY',
	verified: false,
	source: null,
};

export const STAT_LIFETIME_YEARS: Stat = {
	value: 9,
	display: '9',
	label: 'YEARS',
	verified: false,
	source: null,
};
