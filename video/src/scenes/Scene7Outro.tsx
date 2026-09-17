import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Plate} from '../components/Plate';
import {COLORS, SAFE} from '../config/theme';
import {HEADLINE, UI} from '../config/fonts';

/**
 * SCENE 7 — OUTRO / CTA | frames 1680-1800 (120f)
 * Bold end-card text, follow icon pulses on a 1s loop.
 */
export const Scene7Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		frame: frame - 6,
		fps,
		config: {damping: 200, stiffness: 100, mass: 0.7},
		durationInFrames: 22,
	});

	// 1s pulse cycle on the follow icon.
	const pulse = 1 + 0.06 * Math.sin((frame / fps) * Math.PI * 2);
	const glow = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2);

	const fadeIn = interpolate(frame, [0, 10], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.coolShadow, opacity: fadeIn}}>
			<Plate
				src="shot-7-1-end-card.png"
				zoom={2}
				direction="in"
				durationInFrames={120}
				scrim={0.25}
			/>

			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					paddingLeft: SAFE.x,
					paddingRight: SAFE.x,
				}}
			>
				<div
					style={{
						transform: `translateY(${interpolate(entrance, [0, 1], [30, 0])}px)`,
						opacity: entrance,
						textAlign: 'center',
					}}
				>
					<div
						style={{
							fontFamily: HEADLINE,
							fontSize: 92,
							color: COLORS.white,
							lineHeight: 1.04,
							letterSpacing: '-0.02em',
							textShadow: '0 8px 34px rgba(0,0,0,0.7)',
						}}
					>
						THE HIDDEN
						<br />
						<span style={{color: COLORS.warmGlow}}>DESIGN TRICKS</span>
						<br />
						RUNNING YOUR LIFE
					</div>
					<div
						style={{
							marginTop: 34,
							fontFamily: UI,
							fontWeight: 700,
							fontSize: 30,
							letterSpacing: '0.24em',
							color: COLORS.dim,
							textTransform: 'uppercase',
						}}
					>
						Follow for more
					</div>
				</div>
			</AbsoluteFill>

			{/* Pulsing follow icon, bottom-right */}
			<AbsoluteFill
				style={{
					justifyContent: 'flex-end',
					alignItems: 'flex-end',
					padding: SAFE.x,
					paddingBottom: SAFE.bottom - 90,
				}}
			>
				<div
					style={{
						width: 104,
						height: 104,
						borderRadius: '50%',
						border: `3px solid ${COLORS.warmGlow}`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						transform: `scale(${pulse})`,
						boxShadow: `0 0 ${18 + glow * 26}px ${COLORS.warmAccent}${glow > 0.5 ? '99' : '55'}`,
						opacity: entrance,
					}}
				>
					<div
						style={{
							width: 0,
							height: 0,
							borderTop: '18px solid transparent',
							borderBottom: '18px solid transparent',
							borderLeft: `28px solid ${COLORS.warmGlow}`,
							marginLeft: 8,
						}}
					/>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
