import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Scene1Hook} from './scenes/Scene1Hook';
import {Scene2Setup} from './scenes/Scene2Setup';
import {Scene3Mechanism} from './scenes/Scene3Mechanism';
import {Scene4Proof} from './scenes/Scene4Proof';
import {Scene5Stakes} from './scenes/Scene5Stakes';
import {Scene6Resolution} from './scenes/Scene6Resolution';
import {Scene7Outro} from './scenes/Scene7Outro';
import {Grade, Grain} from './components/Grade';
import {COLORS} from './config/theme';
import {loadFonts} from './config/fonts';

loadFonts();

/**
 * "The Netflix Trick That Hacked Your Brain"
 * 1080x1920 @ 30fps, 1800 frames (60s).
 *
 * Scene boundaries follow the storyboard shot list exactly:
 *   1 HOOK        0    - 120
 *   2 SETUP       120  - 300
 *   3 MECHANISM   300  - 660
 *   4 PROOF       660  - 1050
 *   5 STAKES      1050 - 1440
 *   6 RESOLUTION  1440 - 1680
 *   7 OUTRO       1680 - 1800
 */
export const NetflixAutoplayShort: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.black}}>
			<Sequence durationInFrames={120} name="S1 HOOK">
				<Scene1Hook />
			</Sequence>

			<Sequence from={120} durationInFrames={180} name="S2 SETUP">
				<Scene2Setup />
			</Sequence>

			<Sequence from={300} durationInFrames={360} name="S3 MECHANISM">
				<Scene3Mechanism />
			</Sequence>

			<Sequence from={660} durationInFrames={390} name="S4 PROOF">
				<Scene4Proof />
			</Sequence>

			<Sequence from={1050} durationInFrames={390} name="S5 STAKES">
				<Scene5Stakes />
			</Sequence>

			<Sequence from={1440} durationInFrames={240} name="S6 RESOLUTION">
				<Scene6Resolution />
			</Sequence>

			<Sequence from={1680} durationInFrames={120} name="S7 OUTRO">
				<Scene7Outro />
			</Sequence>

			{/* Single shared grade + grain across every shot, per the consistency guide. */}
			<Grade />
			<Grain />
		</AbsoluteFill>
	);
};
