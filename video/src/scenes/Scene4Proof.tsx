import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Plate} from '../components/Plate';
import {KineticWords} from '../components/KineticText';
import {FadeToBlack} from '../components/Transitions';
import {COLORS, SAFE} from '../config/theme';

/**
 * SCENE 4 — THE PROOF | frames 660-1050
 * Four rapid B-roll shots, 90f each, hard cuts on VO clause boundaries.
 * Ken Burns zoom/direction is randomised per clip (2-4%) so no two moves match.
 */

type Beat = {
	src: string;
	text: string;
	punch: string[];
	zoom: number;
	direction: 'in' | 'out';
	panX: number;
	panY: number;
	name: string;
};

const BEATS: Beat[] = [
	{
		src: 'shot-4-1-silhouette-couch-tv.png',
		text: 'every cliffhanger',
		punch: ['cliffhanger'],
		zoom: 4,
		direction: 'in',
		panX: -10,
		panY: 0,
		name: '4.1 Couch silhouette',
	},
	{
		src: 'shot-4-2-countdown-macro.png',
		text: 'every countdown',
		punch: ['countdown'],
		zoom: 2.2,
		direction: 'out',
		panX: 8,
		panY: -6,
		name: '4.2 Countdown macro',
	},
	{
		src: 'shot-4-3-are-you-still-watching.png',
		text: 'every "are you still watching"',
		punch: ['watching'],
		zoom: 3.2,
		direction: 'in',
		panX: 0,
		panY: 10,
		name: '4.3 Still watching',
	},
	{
		src: 'shot-4-4-engineer-late-night.png',
		text: "It's not laziness. It's ENGINEERING.",
		punch: ['ENGINEERING'],
		zoom: 2.8,
		direction: 'out',
		panX: -12,
		panY: 4,
		name: '4.4 Engineer',
	},
];

export const Scene4Proof: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.black}}>
			{BEATS.map((b, i) => (
				<Sequence
					key={b.src}
					from={i * 90}
					durationInFrames={90}
					name={b.name}
				>
					<Plate
						src={b.src}
						zoom={b.zoom}
						direction={b.direction}
						panX={b.panX}
						panY={b.panY}
						durationInFrames={90}
						scrim={0.2}
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
							text={b.text}
							startFrame={3}
							stagger={3}
							punchWords={b.punch}
							fontSize={i === 3 ? 72 : 78}
							accent={COLORS.coolGlow}
						/>
					</AbsoluteFill>
				</Sequence>
			))}

			{/*
			 * 4.4 -> 5.1 slow fade to black, 15 frames + 0.3s (9f) hold.
			 * Scene 4 is 390f long, so the fade must START at 390 - 15 - 9 = 366
			 * to leave exactly 9 frames of black before Scene 5 takes over.
			 */}
			<FadeToBlack at={366} frames={15} />
		</AbsoluteFill>
	);
};
