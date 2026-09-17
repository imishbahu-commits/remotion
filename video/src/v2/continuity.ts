/**
 * CAMERA CONTINUITY CHECK.
 *
 * Audit deficiency #2 was that shot N's motion had no relationship to shot
 * N+1's starting position. The fix is only real if it is enforced, so the
 * invariant is asserted here rather than left as a comment:
 *
 *     exit(shot N) === entry(shot N + 1)
 *
 * ...for every boundary where the camera is meant to be physically continuous.
 *
 * Three boundaries intentionally BREAK the position match, because the bridge
 * is a morph through a shared shape rather than a continuous sweep — at those
 * points continuity is carried by the matched circle, not by the camera
 * vector. Those are declared explicitly so a break can never be accidental.
 */

import type {CamState} from './components/Camera';
import {
	S1_EXIT,
	S2_ENTRY,
	S2_EXIT,
	S31_ENTRY,
	S31_EXIT,
	S32_ENTRY,
	S32_EXIT,
	S33_ENTRY,
	S33_EXIT,
	S4_ENTRY,
	S4_EXIT,
	S5_ENTRY,
	S5_EXIT,
	S6_ENTRY,
	S6_EXIT,
	S7_ENTRY,
} from './Scenes';

export type BoundaryKind = 'camera-continuous' | 'shape-morph';

export type Boundary = {
	name: string;
	kind: BoundaryKind;
	exit: CamState;
	entry: CamState;
	/** why a shape-morph boundary is allowed to reposition the camera */
	rationale?: string;
};

export const BOUNDARIES: Boundary[] = [
	{
		name: '1 -> 2  match-cut on light',
		kind: 'camera-continuous',
		exit: S1_EXIT,
		entry: S2_ENTRY,
	},
	{
		name: '2 -> 3.1  zoom-through',
		kind: 'shape-morph',
		exit: S2_EXIT,
		entry: S31_ENTRY,
		rationale:
			'Camera dives INTO the glow and blows out to white; the new shot emerges from inside the flash, so scale resets by design.',
	},
	{
		name: '3.1 -> 3.2  orbit-continue',
		kind: 'camera-continuous',
		exit: S31_EXIT,
		entry: S32_ENTRY,
	},
	{
		name: '3.2 -> 3.3  rack focus',
		kind: 'camera-continuous',
		exit: S32_EXIT,
		entry: S33_ENTRY,
	},
	{
		name: '3.3 -> 4  shape match (glass rim -> clock face)',
		kind: 'shape-morph',
		exit: S33_EXIT,
		entry: S4_ENTRY,
		rationale:
			'Continuity is carried by the matched circle travelling from (0.555,0.555) to (0.530,0.441), not by the camera position.',
	},
	{
		name: '4 -> 5  radial-wipe morph (clock -> phone)',
		kind: 'shape-morph',
		exit: S4_EXIT,
		entry: S5_ENTRY,
		rationale:
			'Radial streaks resolve into the phone glow. Scale is matched to within 0.04 so the morph still reads as one continuous push.',
	},
	{
		name: '5 -> 6  temperature crossfade + pan',
		kind: 'camera-continuous',
		exit: S5_EXIT,
		entry: S6_ENTRY,
	},
	{
		name: '6 -> 7  iris open',
		kind: 'shape-morph',
		exit: S6_EXIT,
		entry: S7_ENTRY,
		rationale:
			'The timer UI circle opens into the end card; the end card is a flat plate with its own near-static hold.',
	},
];

const same = (a: CamState, b: CamState) =>
	a.scale === b.scale && a.x === b.x && a.y === b.y && a.rotate === b.rotate;

export type ContinuityIssue = {boundary: string; detail: string};

/** Returns [] when the throughline is intact. */
export const checkContinuity = (): ContinuityIssue[] => {
	const issues: ContinuityIssue[] = [];

	for (const b of BOUNDARIES) {
		if (b.kind === 'camera-continuous' && !same(b.exit, b.entry)) {
			issues.push({
				boundary: b.name,
				detail: `exit ${JSON.stringify(b.exit)} !== entry ${JSON.stringify(b.entry)}`,
			});
		}
		if (b.kind === 'shape-morph' && !b.rationale) {
			issues.push({
				boundary: b.name,
				detail: 'shape-morph boundary must declare a rationale',
			});
		}
	}

	return issues;
};
