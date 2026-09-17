import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {GRADE_SHIFT_END, GRADE_SHIFT_START} from '../config/theme';

/**
 * Single top-level colour grade applied over EVERY shot.
 *
 * The storyboard is explicit about this: don't trust the generated images to
 * match each other, force cohesion with one shared LUT-style filter. We
 * approximate a LUT with a cool duotone wash + contrast, then cross-fade to a
 * warm gold wash across shot 6.1 (frames 1440-1680) for the resolution beat.
 */
export const Grade: React.FC = () => {
	const frame = useCurrentFrame();

	const warmth = interpolate(
		frame,
		[GRADE_SHIFT_START, GRADE_SHIFT_END],
		[0, 1],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{/* Cool blue wash — 2800K shadows */}
			<AbsoluteFill
				style={{
					background:
						'linear-gradient(180deg, rgba(10,30,60,0.42) 0%, rgba(4,10,22,0.30) 45%, rgba(8,18,40,0.46) 100%)',
					mixBlendMode: 'multiply',
					opacity: 1 - warmth,
				}}
			/>
			{/* Cool highlight lift — 6500K */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(60% 45% at 50% 38%, rgba(90,170,255,0.20) 0%, rgba(0,0,0,0) 70%)',
					mixBlendMode: 'screen',
					opacity: 1 - warmth,
				}}
			/>
			{/* Warm gold resolution — 3200K */}
			<AbsoluteFill
				style={{
					background:
						'linear-gradient(180deg, rgba(90,50,10,0.34) 0%, rgba(40,22,6,0.22) 50%, rgba(70,40,10,0.34) 100%)',
					mixBlendMode: 'multiply',
					opacity: warmth,
				}}
			/>
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(60% 45% at 50% 42%, rgba(255,186,90,0.24) 0%, rgba(0,0,0,0) 72%)',
					mixBlendMode: 'screen',
					opacity: warmth,
				}}
			/>
			{/* Vignette — keeps the eye centred on a 9:16 crop */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(74% 58% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};

/** Subtle film grain so the upscaled plates don't look plasticky. */
export const Grain: React.FC = () => {
	const frame = useCurrentFrame();
	// Re-seed every 2 frames so the grain animates without strobing.
	const seed = Math.floor(frame / 2);
	const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>
<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='${seed}'/>
<feColorMatrix type='saturate' values='0'/></filter>
<rect width='180' height='180' filter='url(#n)' opacity='1'/></svg>`;

	return (
		<AbsoluteFill
			style={{
				backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
				backgroundSize: '360px 360px',
				opacity: 0.052,
				mixBlendMode: 'overlay',
				pointerEvents: 'none',
			}}
		/>
	);
};
