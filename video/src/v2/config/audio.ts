/**
 * AUDIO BED + DUCK ENVELOPE.
 *
 * The storyboard calls for ambient casino tone under the whole piece, cutting
 * to near-silence for exactly 0.4s at the S4->S5 morph point. 0.4s at 30fps is
 * 12 frames, centred on the morph so the silence lands ON the match rather
 * than after it.
 *
 * OPEN ITEM #2: the VO/TTS voice is not yet confirmed, and that choice drives
 * Whisper caption sync. Until a voice is picked there is no VO track to mix
 * against, so only the ambient envelope is defined here. `AMBIENT_SRC` stays
 * null and the composition renders silent rather than shipping a placeholder
 * bed that would have to be re-timed anyway.
 */

import {interpolate} from 'remotion';
import {FPS, shot} from './timeline';

/** Set to a staticFile() path once the bed is chosen. */
export const AMBIENT_SRC: string | null = null;

/** The S4->S5 morph frame — the silence is centred here. */
export const MORPH_FRAME = shot('s5').from;

/** 0.4 seconds, exactly, as the storyboard specifies. */
export const DUCK_FRAMES = Math.round(0.4 * FPS); // 12

const HALF = DUCK_FRAMES / 2;
/** Short ramps in/out so the drop is a cut in feel but not a click. */
const RAMP = 2;

export const BASE_VOLUME = 0.55;
export const DUCK_VOLUME = 0.04; // "near-silence", not digital zero

/**
 * Ambient volume at a given frame. Flat at BASE_VOLUME except for the
 * 12-frame duck centred on the morph.
 */
export const ambientVolumeAt = (frame: number): number => {
	const start = MORPH_FRAME - HALF;
	const end = MORPH_FRAME + HALF;

	if (frame < start - RAMP || frame > end + RAMP) {
		return BASE_VOLUME;
	}

	return interpolate(
		frame,
		[start - RAMP, start, end, end + RAMP],
		[BASE_VOLUME, DUCK_VOLUME, DUCK_VOLUME, BASE_VOLUME],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
};
