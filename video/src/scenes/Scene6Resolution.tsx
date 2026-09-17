import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Plate} from '../components/Plate';
import {ClauseStack} from '../components/KineticText';
import {FadeOut} from '../components/Transitions';
import {COLORS, SAFE} from '../config/theme';

/**
 * SCENE 6 — RESOLUTION | frames 1440-1680 (240f)
 *
 * Shot 6.1 is the payoff: same framing as 1.2 but the thumb presses Cancel.
 * Text reveals use slower easing than earlier scenes — that's what signals
 * resolution. The cool->warm grade shift is driven globally in <Grade/>.
 *
 * The "loop closes" graphic is drawn here as an SVG ring that completes.
 */
export const Scene6Resolution: React.FC = () => {
	const frame = useCurrentFrame();

	// Loop closing animation: arc sweeps shut, then settles.
	const close = interpolate(frame, [40, 150], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const R = 130;
	const C = 2 * Math.PI * R;
	// Start as an open loop (gap), end fully closed.
	const dash = interpolate(close, [0, 1], [C * 0.62, C]);

	const ringOpacity = interpolate(frame, [30, 50, 180, 215], [0, 0.9, 0.9, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Warm accent fades in as the grade shifts.
	const warm = interpolate(frame, [0, 200], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const ringColor = warm > 0.5 ? COLORS.warmGlow : COLORS.coolGlow;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.black}}>
			<Plate
				src="shot-6-1-thumb-presses-cancel-warm.png"
				zoom={2.5}
				direction="in"
				durationInFrames={240}
				scrim={0.14}
			/>

			{/* Loop-closing ring */}
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<svg width={320} height={320} style={{opacity: ringOpacity}}>
					<circle
						cx={160}
						cy={160}
						r={R}
						fill="none"
						stroke={ringColor}
						strokeWidth={5}
						strokeLinecap="round"
						strokeDasharray={`${dash} ${C}`}
						transform="rotate(-90 160 160)"
						style={{filter: `drop-shadow(0 0 22px ${ringColor})`}}
					/>
				</svg>
			</AbsoluteFill>

			{/* Calm, slower text — resolution easing */}
			<AbsoluteFill
				style={{
					justifyContent: 'flex-end',
					alignItems: 'center',
					paddingBottom: SAFE.bottom,
					paddingLeft: SAFE.x,
					paddingRight: SAFE.x,
				}}
			>
				<ClauseStack
					clauses={[
						{text: 'Awareness is the only override.', at: 16},
						{text: 'Once you see the loop,', at: 92},
						{text: 'you can close it yourself.', at: 150},
					]}
					fontSize={58}
					accentIndex={2}
					accent={COLORS.warmGlow}
				/>
			</AbsoluteFill>

			{/* 6.1 -> 7.1 fade, 10 frames */}
			<FadeOut at={230} frames={10} />
		</AbsoluteFill>
	);
};
