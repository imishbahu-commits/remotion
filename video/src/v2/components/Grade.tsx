import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {TEMP_KEYFRAMES} from '../config/timeline';

/**
 * COLOUR TEMPERATURE ARC — a single continuous keyframed grade, not a swap.
 *
 * 2800K warm casino -> screen-blue accent at Scene 5 -> 5600K neutral at Scene 6.
 * The audit is explicit that this arc IS the emotional structure, so it is
 * driven from one keyframe list spanning the whole piece.
 */

const kelvinAt = (frame: number) => {
	const frames = TEMP_KEYFRAMES.map((k) => k.frame);
	const kelvins = TEMP_KEYFRAMES.map((k) => k.kelvin);
	return interpolate(frame, frames, kelvins, {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
};

/** Approximate an RGB gel for a given colour temperature. */
const gelFor = (kelvin: number) => {
	// 2800K -> strong amber; 5600K -> neutral
	const warmth = interpolate(kelvin, [2800, 5600], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return {warmth};
};

export const TemperatureGrade: React.FC = () => {
	const frame = useCurrentFrame();
	const k = kelvinAt(frame);
	const {warmth} = gelFor(k);

	// Warm gel multiplies in amber; as we cool it fades and a light neutral
	// lift comes in. Scene 5 gets a screen-blue accent via the cool layer.
	const amber = 0.34 * warmth;
	const cool = 0.22 * (1 - warmth);

	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill
				style={{
					background:
						'linear-gradient(180deg, rgba(120,72,18,1) 0%, rgba(90,54,12,1) 55%, rgba(120,80,24,1) 100%)',
					mixBlendMode: 'multiply',
					opacity: amber,
				}}
			/>
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(62% 46% at 50% 40%, rgba(255,196,110,0.30) 0%, rgba(0,0,0,0) 72%)',
					mixBlendMode: 'screen',
					opacity: warmth,
				}}
			/>
			<AbsoluteFill
				style={{
					background:
						'linear-gradient(180deg, rgba(140,170,210,1) 0%, rgba(160,185,220,1) 100%)',
					mixBlendMode: 'soft-light',
					opacity: cool,
				}}
			/>
			{/* Vignette — keeps the 9:16 eye centred in the casino, but it must
			    RELEASE as the piece resolves. The end card is a bright neutral
			    plate; holding a 0.5 vignette over it crushes the white into a
			    grey oval and kills the "stepping out into daylight" beat that
			    the whole colour arc is building toward. So it rides the same
			    warmth curve as everything else. */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(76% 60% at 50% 50%, rgba(0,0,0,0) 56%, rgba(0,0,0,0.5) 100%)',
					opacity: 0.25 + warmth * 0.75,
				}}
			/>
		</AbsoluteFill>
	);
};

/** Bloom on warm-lit shots, fading out as the piece cools. */
export const Bloom: React.FC = () => {
	const frame = useCurrentFrame();
	const k = kelvinAt(frame);
	const warmth = interpolate(k, [2800, 5600], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background:
					'radial-gradient(48% 34% at 50% 40%, rgba(255,206,130,0.16) 0%, rgba(0,0,0,0) 70%)',
				mixBlendMode: 'screen',
				// Bloom is a property of the warm practical lights. Once the
				// piece cools to 5600K there is nothing left to bloom, and
				// screening amber over the neutral end card just fogs it.
				opacity: warmth,
				pointerEvents: 'none',
			}}
		/>
	);
};

/** Consistent film grain across every shot. */
export const Grain: React.FC = () => {
	const frame = useCurrentFrame();
	const seed = Math.floor(frame / 2);
	const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' seed='${seed}'/>
<feColorMatrix type='saturate' values='0'/></filter>
<rect width='200' height='200' filter='url(#n)'/></svg>`;

	return (
		<AbsoluteFill
			style={{
				backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
				backgroundSize: '400px 400px',
				opacity: 0.05,
				mixBlendMode: 'overlay',
				pointerEvents: 'none',
			}}
		/>
	);
};
