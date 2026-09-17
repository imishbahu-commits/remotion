import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Plate} from '../components/Plate';
import {KineticWords} from '../components/KineticText';
import {FadeFromBlack, WhipBlurOut} from '../components/Transitions';
import {COLORS, SAFE} from '../config/theme';

/**
 * SCENE 1 — HOOK | frames 0-120
 *  1.1 (0-60)   CU phone, slow 3% push-in. "doesn't want you to FINISH"
 *  1.2 (60-120) ECU thumb hovering Cancel. "NEVER STOP"
 * Transition 1.1 -> 1.2 is a hard cut (0f); 1.2 -> 2.1 is a 6f whip-blur.
 */
export const Scene1Hook: React.FC = () => {
	return (
		<AbsoluteFill>
			{/* Shot 1.1 */}
			<Sequence durationInFrames={60} name="1.1 Phone autoplay">
				<Plate
					src="shot-1-1-phone-autoplay-countdown.png"
					zoom={3}
					direction="in"
					durationInFrames={60}
					scrim={0.12}
				/>
				<AbsoluteFill
					style={{
						justifyContent: 'flex-start',
						alignItems: 'center',
						paddingTop: SAFE.top,
						paddingLeft: SAFE.x,
						paddingRight: SAFE.x,
					}}
				>
					<KineticWords
						text="doesn't want you to FINISH"
						startFrame={4}
						stagger={4}
						punchWords={['FINISH']}
						fontSize={100}
						accent={COLORS.coolGlow}
					/>
				</AbsoluteFill>
			</Sequence>

			{/* Shot 1.2 — hard cut in */}
			<Sequence from={60} durationInFrames={60} name="1.2 Thumb hovers Cancel">
				<Plate
					src="shot-1-2-thumb-hover-cancel.png"
					zoom={2}
					direction="in"
					durationInFrames={60}
					scrim={0.16}
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
					<KineticWords
						text="NEVER STOP"
						startFrame={2}
						stagger={3}
						punchWords={['NEVER', 'STOP']}
						fontSize={140}
						accent={COLORS.coolGlow}
					/>
				</AbsoluteFill>
				{/* 1.2 -> 2.1 whip-blur wipe, 6 frames */}
				<WhipBlurOut at={54} frames={6} />
			</Sequence>

			<FadeFromBlack frames={10} />
		</AbsoluteFill>
	);
};
