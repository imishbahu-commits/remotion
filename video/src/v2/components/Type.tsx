import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {HEADLINE, UI} from '../../config/fonts';

/**
 * Kinetic type. Per the audit's note to use apple-design spring reveals:
 * springs everywhere, no linear interpolation, restrained overshoot.
 */

const WARM = '#ffd79a';
const NEUTRAL = '#ffffff';

export const SpringWords: React.FC<{
	text: string;
	startFrame?: number;
	stagger?: number;
	accentWords?: string[];
	fontSize?: number;
	accent?: string;
	maxWidth?: number;
	color?: string;
	/** Set on light backgrounds: drops the dark scrim-shadow meant for plates. */
	onLight?: boolean;
}> = ({
	text,
	startFrame = 0,
	stagger = 4,
	accentWords = [],
	fontSize = 92,
	accent = WARM,
	maxWidth = 900,
	color = NEUTRAL,
	onLight = false,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const words = text.split(' ');
	const norm = (w: string) => w.replace(/[^\p{L}\p{N}]/gu, '').toUpperCase();
	const accents = accentWords.map(norm);

	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				gap: '0.10em 0.24em',
				justifyContent: 'center',
				maxWidth,
				fontFamily: HEADLINE,
				fontSize,
				lineHeight: 1.03,
				textAlign: 'center',
			}}
		>
			{words.map((w, i) => {
				const isAccent = accents.includes(norm(w));
				const local = frame - (startFrame + i * stagger);
				const s = spring({
					frame: local,
					fps,
					// Apple-ish: firm, minimal overshoot
					config: {damping: 22, stiffness: 140, mass: 0.85},
					durationInFrames: 24,
				});
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							transform: `translateY(${interpolate(s, [0, 1], [34, 0])}px) scale(${interpolate(s, [0, 1], [0.9, 1])})`,
							opacity: interpolate(local, [0, 6], [0, 1], {
								extrapolateLeft: 'clamp',
								extrapolateRight: 'clamp',
							}),
							color: isAccent ? accent : color,
							textShadow: onLight
								? 'none'
								: isAccent
									? `0 0 46px ${accent}77, 0 6px 26px rgba(0,0,0,0.8)`
									: '0 6px 26px rgba(0,0,0,0.85)',
							letterSpacing: '-0.015em',
						}}
					>
						{w}
					</span>
				);
			})}
		</div>
	);
};

export const Caption: React.FC<{
	text: string;
	at?: number;
	fontSize?: number;
	color?: string;
	maxWidth?: number;
}> = ({text, at = 0, fontSize = 46, color = 'rgba(255,255,255,0.94)', maxWidth = 860}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({
		frame: frame - at,
		fps,
		config: {damping: 26, stiffness: 130, mass: 0.9},
		durationInFrames: 20,
	});

	return (
		<div
			style={{
				fontFamily: UI,
				fontWeight: 700,
				fontSize,
				lineHeight: 1.28,
				textAlign: 'center',
				maxWidth,
				color,
				opacity: s,
				transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`,
				textShadow: '0 4px 22px rgba(0,0,0,0.85)',
			}}
		>
			{text}
		</div>
	);
};

export const Kicker: React.FC<{
	children: React.ReactNode;
	at?: number;
	color?: string;
	fontSize?: number;
}> = ({children, at = 0, color = 'rgba(255,255,255,0.62)', fontSize = 26}) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame - at, [0, 14], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return (
		<div
			style={{
				fontFamily: UI,
				fontWeight: 700,
				fontSize,
				letterSpacing: '0.24em',
				textTransform: 'uppercase',
				color,
				opacity,
			}}
		>
			{children}
		</div>
	);
};
