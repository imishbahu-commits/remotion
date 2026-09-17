import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

/**
 * Transitions from the storyboard's pacing map (section 2).
 *
 * These are implemented as overlays *inside* a scene rather than as
 * <TransitionSeries> presentations, because the map mixes hard cuts (0f) with
 * short wipes and one grade-crossing fade — driving them locally keeps every
 * scene's absolute frame numbers identical to the shot list.
 */

/** Whip-pan style wipe: fast horizontal blur + slide. 1.2 -> 2.1, 6 frames. */
export const WhipBlurOut: React.FC<{at: number; frames?: number}> = ({at, frames = 6}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [at, at + frames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	if (frame < at || frame > at + frames) return null;

	return (
		<AbsoluteFill
			style={{
				backdropFilter: `blur(${interpolate(p, [0, 0.5, 1], [0, 26, 0])}px)`,
				transform: `translateX(${interpolate(p, [0, 1], [0, -160])}px)`,
				backgroundColor: `rgba(6,12,24,${interpolate(p, [0, 0.5, 1], [0, 0.55, 0])})`,
			}}
		/>
	);
};

/** Vertical wipe, top to bottom. 2.1 -> 3.1, 8 frames. */
export const VerticalWipeOut: React.FC<{at: number; frames?: number}> = ({at, frames = 8}) => {
	const frame = useCurrentFrame();
	if (frame < at || frame > at + frames) return null;
	const p = interpolate(frame, [at, at + frames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(180deg, #060d1a 0%, #060d1a 92%, rgba(125,196,255,0.9) 100%)',
				transform: `translateY(${interpolate(p, [0, 1], [-100, 0])}%)`,
			}}
		/>
	);
};

/** Fade to black with a hold. 4.4 -> 5.1, 15 frames. */
export const FadeToBlack: React.FC<{at: number; frames?: number}> = ({at, frames = 15}) => {
	const frame = useCurrentFrame();
	if (frame < at) return null;
	const opacity = interpolate(frame, [at, at + frames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return <AbsoluteFill style={{backgroundColor: '#000', opacity}} />;
};

export const FadeFromBlack: React.FC<{frames?: number}> = ({frames = 12}) => {
	const frame = useCurrentFrame();
	if (frame > frames) return null;
	const opacity = interpolate(frame, [0, frames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return <AbsoluteFill style={{backgroundColor: '#000', opacity}} />;
};

/** Generic fade out (6.1 -> 7.1, 10 frames). */
export const FadeOut: React.FC<{at: number; frames?: number; color?: string}> = ({
	at,
	frames = 10,
	color = '#000',
}) => {
	const frame = useCurrentFrame();
	if (frame < at) return null;
	const opacity = interpolate(frame, [at, at + frames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return <AbsoluteFill style={{backgroundColor: color, opacity}} />;
};

/** Light flash used to sell a hard punch cut on a stat reveal. */
export const ImpactFlash: React.FC<{at: number; frames?: number; color?: string}> = ({
	at,
	frames = 8,
	color = 'rgba(180,220,255,0.55)',
}) => {
	const frame = useCurrentFrame();
	if (frame < at || frame > at + frames) return null;
	const opacity = interpolate(frame, [at, at + 2, at + frames], [0, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return <AbsoluteFill style={{backgroundColor: color, opacity}} />;
};
