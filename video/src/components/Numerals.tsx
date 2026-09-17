import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../config/theme';
import {HEADLINE, UI} from '../config/fonts';

/**
 * CountUp with tabular figures.
 *
 * The storyboard asks for "tabular-nums monospace-style font for clean
 * counting" so digits don't jitter as they change width.
 */
export const CountUp: React.FC<{
	to: number;
	startFrame: number;
	durationInFrames: number;
	decimals?: number;
	fontSize?: number;
	color?: string;
}> = ({
	to,
	startFrame,
	durationInFrames,
	decimals = 1,
	fontSize = 300,
	color = COLORS.white,
}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [startFrame, startFrame + durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	// Ease-out so the count decelerates into its final value.
	const eased = 1 - Math.pow(1 - p, 3);
	const value = (to * eased).toFixed(decimals);

	return (
		<div
			style={{
				fontFamily: HEADLINE,
				fontSize,
				color,
				lineHeight: 1,
				fontVariantNumeric: 'tabular-nums',
				fontFeatureSettings: '"tnum" 1',
				textShadow: `0 0 70px ${COLORS.coolAccent}55, 0 10px 40px rgba(0,0,0,0.7)`,
			}}
		>
			{value}
		</div>
	);
};

/**
 * Oversized punch-in numeral for the "9 YEARS" reveal.
 * Lands hard on its impact frame — pairs with the sub-bass hit.
 */
export const PunchNumber: React.FC<{
	value: string;
	suffix?: string;
	impactFrame: number;
	fontSize?: number;
	color?: string;
}> = ({value, suffix, impactFrame, fontSize = 420, color = COLORS.white}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const s = spring({
		frame: frame - impactFrame,
		fps,
		config: {damping: 12, stiffness: 180, mass: 0.9},
		durationInFrames: 30,
	});

	const scale = interpolate(s, [0, 1], [1.9, 1]);
	const opacity = interpolate(frame - impactFrame, [0, 3], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	// Shockwave ring on impact.
	const ring = interpolate(frame - impactFrame, [0, 22], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div
				style={{
					position: 'absolute',
					width: 520,
					height: 520,
					borderRadius: '50%',
					border: `3px solid ${COLORS.coolGlow}`,
					opacity: (1 - ring) * 0.5,
					transform: `scale(${0.5 + ring * 1.5})`,
					top: '50%',
					left: '50%',
					marginTop: -260,
					marginLeft: -260,
				}}
			/>
			<div
				style={{
					fontFamily: HEADLINE,
					fontSize,
					color,
					lineHeight: 0.92,
					transform: `scale(${scale})`,
					opacity,
					fontVariantNumeric: 'tabular-nums',
					textShadow: `0 0 90px ${COLORS.coolAccent}66, 0 12px 48px rgba(0,0,0,0.8)`,
				}}
			>
				{value}
			</div>
			{suffix ? (
				<div
					style={{
						fontFamily: HEADLINE,
						fontSize: fontSize * 0.28,
						color,
						opacity,
						letterSpacing: '0.06em',
						marginTop: -10,
					}}
				>
					{suffix}
				</div>
			) : null}
		</div>
	);
};

/** Caption under a stat. */
export const StatLabel: React.FC<{children: React.ReactNode; at: number; width?: number}> = ({
	children,
	at,
	width = 620,
}) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame - at, [0, 14], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const y = interpolate(frame - at, [0, 14], [16, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				fontFamily: UI,
				fontWeight: 700,
				fontSize: 26,
				letterSpacing: '0.2em',
				color: COLORS.dim,
				textTransform: 'uppercase',
				textAlign: 'center',
				width,
				lineHeight: 1.5,
				opacity,
				transform: `translateY(${y}px)`,
			}}
		>
			{children}
		</div>
	);
};
