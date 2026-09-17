import React from 'react';
import {
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {COLORS, PUNCH_SPRING} from '../config/theme';
import {HEADLINE, UI} from '../config/fonts';

/**
 * Word-by-word kinetic headline.
 *
 * `punchWords` get the spring specified in the storyboard
 * (damping 10, stiffness 120) plus an accent colour — that's the
 * "punch-scale on FINISH" behaviour.
 */
export const KineticWords: React.FC<{
	text: string;
	startFrame?: number;
	/** frames between each word appearing */
	stagger?: number;
	punchWords?: string[];
	fontSize?: number;
	accent?: string;
	align?: 'center' | 'left';
	maxWidth?: number;
}> = ({
	text,
	startFrame = 0,
	stagger = 4,
	punchWords = [],
	fontSize = 104,
	accent = COLORS.coolGlow,
	align = 'center',
	maxWidth = 900,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const words = text.split(' ');

	const normalise = (w: string) => w.replace(/[^\p{L}\p{N}]/gu, '').toUpperCase();
	const punchSet = punchWords.map(normalise);

	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				gap: `0.10em 0.26em`,
				justifyContent: align === 'center' ? 'center' : 'flex-start',
				maxWidth,
				fontFamily: HEADLINE,
				fontSize,
				lineHeight: 1.02,
				textAlign: align,
			}}
		>
			{words.map((word, i) => {
				const isPunch = punchSet.includes(normalise(word));
				const appear = startFrame + i * stagger;
				const local = frame - appear;

				const s = spring({
					frame: local,
					fps,
					config: isPunch
						? PUNCH_SPRING
						: {damping: 200, stiffness: 120, mass: 0.6},
					durationInFrames: isPunch ? 26 : 18,
				});

				const scale = isPunch
					? interpolate(s, [0, 1], [0.58, 1])
					: interpolate(s, [0, 1], [0.94, 1]);
				const opacity = interpolate(local, [0, 5], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const y = interpolate(s, [0, 1], [26, 0]);

				return (
					<span
						key={`${word}-${i}`}
						style={{
							display: 'inline-block',
							transform: `translateY(${y}px) scale(${scale})`,
							opacity,
							color: isPunch ? accent : COLORS.white,
							textShadow: isPunch
								? `0 0 42px ${accent}88, 0 6px 28px rgba(0,0,0,0.75)`
								: '0 6px 28px rgba(0,0,0,0.8)',
							letterSpacing: '-0.015em',
						}}
					>
						{word}
					</span>
				);
			})}
		</div>
	);
};

/** Letter-by-letter reveal — used for "THE ZEIGARNIK EFFECT" (3 frames/letter). */
export const LetterReveal: React.FC<{
	text: string;
	startFrame?: number;
	framesPerLetter?: number;
	fontSize?: number;
	accent?: string;
}> = ({text, startFrame = 0, framesPerLetter = 3, fontSize = 96, accent = COLORS.coolGlow}) => {
	const frame = useCurrentFrame();
	const letters = text.split('');

	return (
		<div
			style={{
				fontFamily: HEADLINE,
				fontSize,
				lineHeight: 1.05,
				textAlign: 'center',
				letterSpacing: '-0.01em',
				maxWidth: 940,
			}}
		>
			{letters.map((ch, i) => {
				const local = frame - (startFrame + i * framesPerLetter);
				const opacity = interpolate(local, [0, 4], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const blur = interpolate(local, [0, 6], [10, 0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				return (
					<span
						key={i}
						style={{
							opacity,
							filter: `blur(${blur}px)`,
							color: COLORS.white,
							textShadow: `0 0 38px ${accent}66`,
							whiteSpace: ch === ' ' ? 'pre' : undefined,
						}}
					>
						{ch}
					</span>
				);
			})}
		</div>
	);
};

/** Clause-by-clause slide-up, synced to VO breath groups. */
export const ClauseStack: React.FC<{
	clauses: {text: string; at: number}[];
	fontSize?: number;
	accentIndex?: number;
	accent?: string;
}> = ({clauses, fontSize = 62, accentIndex = -1, accent = COLORS.coolGlow}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 18,
				alignItems: 'center',
				fontFamily: HEADLINE,
				fontSize,
				lineHeight: 1.12,
				textAlign: 'center',
				maxWidth: 900,
			}}
		>
			{clauses.map((c, i) => {
				const s = spring({
					frame: frame - c.at,
					fps,
					config: {damping: 200, stiffness: 110, mass: 0.7},
					durationInFrames: 20,
				});
				return (
					<div
						key={i}
						style={{
							transform: `translateY(${interpolate(s, [0, 1], [46, 0])}px)`,
							opacity: s,
							color: i === accentIndex ? accent : COLORS.white,
							textShadow: '0 6px 26px rgba(0,0,0,0.8)',
						}}
					>
						{c.text}
					</div>
				);
			})}
		</div>
	);
};

/** Small geometric-sans label — lower thirds, panel tags, stat captions. */
export const Label: React.FC<{
	children: React.ReactNode;
	at?: number;
	fontSize?: number;
	color?: string;
	letterSpacing?: number;
}> = ({children, at = 0, fontSize = 26, color = COLORS.dim, letterSpacing = 0.22}) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame - at, [0, 12], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				fontFamily: UI,
				fontWeight: 700,
				fontSize,
				letterSpacing: `${letterSpacing}em`,
				color,
				opacity,
				textTransform: 'uppercase',
			}}
		>
			{children}
		</div>
	);
};
