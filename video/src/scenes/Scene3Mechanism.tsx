import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Plate} from '../components/Plate';
import {ClauseStack, LetterReveal} from '../components/KineticText';
import {StatLabel} from '../components/Numerals';
import {COLORS, SAFE} from '../config/theme';
import {HEADLINE} from '../config/fonts';
import {STAT_OPEN_LOOP} from '../config/stats';

/**
 * SCENE 3 — THE MECHANISM | frames 300-660
 *  3.1 (300-420) Brain + open loop. Letter-by-letter "THE ZEIGARNIK EFFECT".
 *  3.2 (420-540) finished vs unfinished. Clause-by-clause reveal.
 *  3.3 (540-660) Stat card. Percentage + label.
 * Internal: cross-fade on text, hard cut on visual.
 */

const CrossFadeIn: React.FC<{frames?: number; children: React.ReactNode}> = ({
	frames = 4,
	children,
}) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, frames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

export const Scene3Mechanism: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.coolShadow}}>
			{/* 3.1 */}
			<Sequence durationInFrames={120} name="3.1 Zeigarnik">
				<CrossFadeIn frames={4}>
					<Plate
						src="shot-3-1-zeigarnik-brain-open-loop.png"
						zoom={3.5}
						direction="in"
						durationInFrames={120}
						scrim={0.22}
					/>
				</CrossFadeIn>
				<AbsoluteFill
					style={{
						justifyContent: 'flex-end',
						alignItems: 'center',
						paddingBottom: SAFE.bottom,
						paddingLeft: SAFE.x,
						paddingRight: SAFE.x,
					}}
				>
					{/* 3 frames per letter, per the storyboard */}
					<LetterReveal
						text="THE ZEIGARNIK EFFECT"
						startFrame={8}
						framesPerLetter={3}
						fontSize={82}
					/>
				</AbsoluteFill>
			</Sequence>

			{/* 3.2 — hard cut on visual */}
			<Sequence from={120} durationInFrames={120} name="3.2 Finished vs unfinished">
				<Plate
					src="shot-3-2-finished-vs-unfinished.png"
					zoom={2.5}
					direction="out"
					durationInFrames={120}
					scrim={0.26}
				/>
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
							{text: 'Your brain remembers', at: 6},
							{text: 'UNFINISHED tasks', at: 30},
							{text: 'far better than finished ones', at: 58},
						]}
						fontSize={58}
						accentIndex={1}
					/>
				</AbsoluteFill>
			</Sequence>

			{/* 3.3 — stat card */}
			<Sequence from={240} durationInFrames={120} name="3.3 Stat card">
				<Plate
					src="shot-3-3-stat-card.png"
					zoom={4}
					direction="in"
					durationInFrames={120}
					scrim={0.1}
				/>
				<StatCardContent />
			</Sequence>
		</AbsoluteFill>
	);
};

/**
 * The numeral composited into the dark glassmorphic card plate.
 * Nothing is baked into the image — this is the "added in post" layer.
 */
const StatCardContent: React.FC = () => {
	const frame = useCurrentFrame();

	const scale = interpolate(frame, [4, 20], [0.86, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const opacity = interpolate(frame, [4, 18], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 26,
					transform: `scale(${scale})`,
					opacity,
				}}
			>
				<div
					style={{
						fontFamily: HEADLINE,
						fontSize: 260,
						color: COLORS.white,
						lineHeight: 1,
						fontVariantNumeric: 'tabular-nums',
						textShadow: `0 0 80px ${COLORS.coolAccent}66`,
					}}
				>
					{STAT_OPEN_LOOP.display}
				</div>
				<StatLabel at={20} width={560}>
					{STAT_OPEN_LOOP.label}
				</StatLabel>
			</div>
		</AbsoluteFill>
	);
};
