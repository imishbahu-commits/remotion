import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CameraPlate, cam} from './components/Camera';
import {ForegroundSweep} from './components/Bridges';
import {Caption, Kicker, SpringWords} from './components/Type';
import {ANCHORS} from './config/anchors';
import {TIME_DISTORTION} from './config/stats';
import {HEADLINE, UI} from '../config/fonts';

/**
 * CAMERA CONTINUITY CONTRACT
 * ==========================
 * Each scene exports its entry/exit camera state. The invariant enforced by
 * cameraContinuity.test-able values in continuity.ts is:
 *
 *     EXIT[n] === ENTRY[n+1]
 *
 * so the motion vector never resets at a boundary.
 */

const SAFE = {x: 84, bottom: 300, top: 220};

// ---------------------------------------------------------------- Scene 1
// Push-in, 24mm, eye height, decelerating over the full 4s.
export const S1_ENTRY = cam(1.0, 0, 0);
export const S1_EXIT = cam(1.14, -1.5, -1.0);

export const Scene1: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
	<AbsoluteFill>
		<CameraPlate
			src="s1-casino-floor-wide.png"
			entry={S1_ENTRY}
			exit={S1_EXIT}
			move="pushDecel"
			durationInFrames={durationInFrames}
			origin={ANCHORS.chandelier}
			scrim={0.14}
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
			<SpringWords
				text="COUNT THE CLOCKS"
				startFrame={8}
				stagger={5}
				accentWords={['CLOCKS']}
				fontSize={112}
			/>
			<div style={{height: 22}} />
			<Caption text="You won't find one." at={44} fontSize={44} />
		</AbsoluteFill>
	</AbsoluteFill>
);

// ---------------------------------------------------------------- Scene 2
// Whip-pan entry continues S1's vector, settling into a top-down drift.
export const S2_ENTRY = S1_EXIT;
export const S2_EXIT = cam(1.3, 1.0, 1.5);

export const Scene2: React.FC<{durationInFrames: number}> = ({
	durationInFrames,
}) => {
	return (
		<AbsoluteFill>
			<CameraPlate
				src="s2-floorplan-maze.png"
				entry={S2_ENTRY}
				exit={S2_EXIT}
				move="whipSettle"
				durationInFrames={durationInFrames}
				origin={ANCHORS.pathGlow}
				scrim={0.1}
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
				<SpringWords
					text="It's not an accident"
					startFrame={16}
					stagger={4}
					accentWords={['accident']}
					fontSize={78}
				/>
				<div style={{height: 20}} />
				<Caption
					text="One of the most deliberate design decisions in retail history."
					at={78}
					fontSize={40}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- Scene 3.1
// Emerges from the zoom-through as a push-in, then begins a clockwise orbit.
export const S31_ENTRY = cam(1.34, 0, 0, -2.2);
export const S31_EXIT = cam(1.12, 1.2, 0.6, 2.4);

export const Scene31: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
	<AbsoluteFill>
		<CameraPlate
			src="s3-1-ceiling-radial.png"
			entry={S31_ENTRY}
			exit={S31_EXIT}
			move="orbit"
			durationInFrames={durationInFrames}
			origin={ANCHORS.ceilingHub}
			scrim={0.12}
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
			<SpringWords
				text="No clocks. No windows."
				startFrame={10}
				stagger={4}
				accentWords={['clocks.', 'windows.']}
				fontSize={82}
			/>
			<div style={{height: 18}} />
			<Caption text="So you never see the sun move." at={62} fontSize={40} />
		</AbsoluteFill>
	</AbsoluteFill>
);

// ---------------------------------------------------------------- Scene 3.2
// Orbit tangent carries directly into a lateral track, same direction.
export const S32_ENTRY = S31_EXIT;
export const S32_EXIT = cam(1.2, -2.6, 0.2, 0);

export const Scene32: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
	<AbsoluteFill>
		<CameraPlate
			src="s3-2-aisle-tracking.png"
			entry={S32_ENTRY}
			exit={S32_EXIT}
			move="track"
			durationInFrames={durationInFrames}
			origin={ANCHORS.aisleVanish}
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
			<SpringWords
				text="Mazelike layouts"
				startFrame={10}
				stagger={4}
				accentWords={['Mazelike']}
				fontSize={86}
			/>
			<div style={{height: 18}} />
			<Caption text="Leaving takes longer than staying." at={58} fontSize={40} />
		</AbsoluteFill>
	</AbsoluteFill>
);

// ---------------------------------------------------------------- Scene 3.3
// Rack-focus pull from blur to a macro close-up; slow pull-back sets up the
// shape match onto the clock.
export const S33_ENTRY = S32_EXIT;
export const S33_EXIT = cam(1.04, 0, 0, 0);

export const Scene33: React.FC<{durationInFrames: number; bridgeIn: number}> = ({
	durationInFrames,
	bridgeIn,
}) => {
	const frame = useCurrentFrame();
	const sweep = interpolate(frame, [0, bridgeIn], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<CameraPlate
				src="s3-3-cocktail-macro.png"
				entry={S33_ENTRY}
				exit={S33_EXIT}
				move="pullBack"
				durationInFrames={durationInFrames}
				origin={ANCHORS.glassRim}
				scrim={0.1}
			/>
			<ForegroundSweep progress={sweep} />
			<AbsoluteFill
				style={{
					justifyContent: 'flex-end',
					alignItems: 'center',
					paddingBottom: SAFE.bottom,
					paddingLeft: SAFE.x,
					paddingRight: SAFE.x,
				}}
			>
				<SpringWords
					text="Free drinks"
					startFrame={14}
					stagger={4}
					accentWords={['Free']}
					fontSize={90}
				/>
				<div style={{height: 18}} />
				<Caption
					text="Your judgment slows exactly when your money's on the table."
					at={60}
					fontSize={40}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- Scene 4
// Push-in on the clock face; hands blur into radial streaks toward Scene 5.
export const S4_ENTRY = cam(1.22, 0, 0, -3);
export const S4_EXIT = cam(1.5, 0, 0, 5);

export const Scene4: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill>
			<CameraPlate
				src="s4-clock-radial-blur.png"
				entry={S4_ENTRY}
				exit={S4_EXIT}
				move="driftIn"
				durationInFrames={durationInFrames}
				origin={ANCHORS.clockFace}
				scrim={0.06}
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
				<Kicker at={12}>Time distortion architecture</Kicker>
			</AbsoluteFill>

			<StatBlock frame={frame} />

			<AbsoluteFill
				style={{
					justifyContent: 'flex-end',
					alignItems: 'center',
					paddingBottom: SAFE.bottom,
					paddingLeft: SAFE.x,
					paddingRight: SAFE.x,
				}}
			>
				<Caption text="And it works." at={210} fontSize={44} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/**
 * The stat. Renders an unmissable warning badge while unverified — see
 * config/stats.ts. This is audit deficiency #5: the placeholder leads, loudly.
 */
const StatBlock: React.FC<{frame: number}> = ({frame}) => {
	const appear = interpolate(frame, [30, 56], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const verified = TIME_DISTORTION.verified && TIME_DISTORTION.source;

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			<div style={{opacity: appear, textAlign: 'center'}}>
				<div
					style={{
						fontFamily: HEADLINE,
						fontSize: verified ? 260 : 150,
						color: '#ffe9c2',
						lineHeight: 1,
						fontVariantNumeric: 'tabular-nums',
						textShadow: '0 0 90px rgba(255,190,90,0.45)',
					}}
				>
					{TIME_DISTORTION.display}
				</div>
				<div
					style={{
						marginTop: 18,
						fontFamily: UI,
						fontWeight: 700,
						fontSize: 24,
						letterSpacing: '0.2em',
						color: verified ? 'rgba(255,255,255,0.7)' : '#ff6b5e',
						textTransform: 'uppercase',
						maxWidth: 620,
						lineHeight: 1.5,
					}}
				>
					{TIME_DISTORTION.label}
				</div>

				{!verified ? (
					<div
						style={{
							marginTop: 26,
							display: 'inline-block',
							padding: '12px 22px',
							border: '2px solid #ff6b5e',
							borderRadius: 10,
							fontFamily: UI,
							fontWeight: 700,
							fontSize: 20,
							letterSpacing: '0.12em',
							color: '#ff6b5e',
							background: 'rgba(60,10,6,0.55)',
							textTransform: 'uppercase',
						}}
					>
						Do not publish — stat unsourced
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- Scene 5
// Radial glow match from the clock; push-in continues at matched speed.
export const S5_ENTRY = cam(1.46, 0, 0, 4);
export const S5_EXIT = cam(1.16, -1.0, -0.4, 0);

export const Scene5: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
	<AbsoluteFill>
		<CameraPlate
			src="s5-phone-radial-glow.png"
			entry={S5_ENTRY}
			exit={S5_EXIT}
			move="driftIn"
			durationInFrames={durationInFrames}
			origin={ANCHORS.phoneGlow}
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
			<SpringWords
				text="Same playbook"
				startFrame={40}
				stagger={4}
				accentWords={['playbook']}
				fontSize={92}
			/>
			<div style={{height: 20}} />
			<Caption
				text="Remove the exit. Remove the clock."
				at={132}
				fontSize={44}
			/>
		</AbsoluteFill>
	</AbsoluteFill>
);

// ---------------------------------------------------------------- Scene 6
// Pan right following the hand; temperature resolves to neutral (global grade).
export const S6_ENTRY = S5_EXIT;
export const S6_EXIT = cam(1.04, 1.4, 0, 0);

export const Scene6: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
	<AbsoluteFill>
		<CameraPlate
			src="s6-hand-timer-warm-to-neutral.png"
			entry={S6_ENTRY}
			exit={S6_EXIT}
			move="track"
			durationInFrames={durationInFrames}
			origin={ANCHORS.timerUI}
			scrim={0.1}
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
			<SpringWords
				text="Bring your own clock"
				startFrame={20}
				stagger={5}
				accentWords={['own']}
				fontSize={84}
			/>
			<div style={{height: 20}} />
			<Caption text="Set a timer before you start." at={110} fontSize={44} />
		</AbsoluteFill>
	</AbsoluteFill>
);

// ---------------------------------------------------------------- Scene 7
export const S7_ENTRY = cam(1.06, 0, 0);
export const S7_EXIT = cam(1.0, 0, 0);

export const Scene7: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const pulse = 1 + 0.05 * Math.sin((frame / 30) * Math.PI * 2);

	return (
		<AbsoluteFill style={{backgroundColor: '#f6f5f2'}}>
			<CameraPlate
				src="s7-endcard-white.png"
				entry={S7_ENTRY}
				exit={S7_EXIT}
				move="linearHold"
				durationInFrames={durationInFrames}
			/>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					paddingLeft: SAFE.x,
					paddingRight: SAFE.x,
				}}
			>
				<div style={{textAlign: 'center'}}>
					<SpringWords
						text="THE INVISIBLE DESIGN"
						startFrame={6}
						stagger={3}
						fontSize={74}
						color="#14110d"
						accent="#8a6a22"
						accentWords={['INVISIBLE']}
						onLight
					/>
					<div style={{height: 10}} />
					<SpringWords
						text="SHAPING YOUR DAY"
						startFrame={20}
						stagger={3}
						fontSize={74}
						color="#14110d"
						onLight
					/>
					<div style={{height: 30}} />
					<Kicker at={44} color="rgba(20,17,13,0.55)">
						Follow for more
					</Kicker>
				</div>
			</AbsoluteFill>
			{/* Follow affordance, centred under the lockup. Was bottom-right,
			    which collided with the plate's own corner detail. */}
			<AbsoluteFill
				style={{
					justifyContent: 'flex-end',
					alignItems: 'center',
					paddingBottom: 330,
				}}
			>
				<div
					style={{
						width: 96,
						height: 96,
						borderRadius: '50%',
						border: '3px solid #14110d',
						transform: `scale(${pulse})`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						opacity: interpolate(frame, [52, 68], [0, 1], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						}),
					}}
				>
					<div
						style={{
							width: 0,
							height: 0,
							borderTop: '16px solid transparent',
							borderBottom: '16px solid transparent',
							borderLeft: '25px solid #14110d',
							marginLeft: 7,
						}}
					/>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
