import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Anchor} from '../config/anchors';

/**
 * CAMERA THROUGHLINE
 * ==================
 * Deficiency #2 in the v1 audit: each shot had an isolated Ken Burns move with
 * no logic connecting shot N to shot N+1.
 *
 * Fix: a camera state is (scale, x, y, rotation). Every shot declares an
 * `entry` state and an `exit` state. The pipeline guarantees
 *
 *     exit(shot N) === entry(shot N + 1)
 *
 * so the motion VECTOR is continuous across the boundary — the incoming shot
 * starts already moving in the direction the outgoing shot was travelling.
 * That continuity is what reads as one camera rather than nine clips.
 *
 * All moves use spring() for acceleration/deceleration, never linear.
 */

export type CamState = {
	scale: number;
	/** percent of frame width */
	x: number;
	/** percent of frame height */
	y: number;
	rotate: number;
};

export const cam = (
	scale: number,
	x = 0,
	y = 0,
	rotate = 0,
): CamState => ({scale, x, y, rotate});

export type MoveKind =
	| 'pushDecel' // walking in and stopping — ease-out cubic feel
	| 'whipSettle' // fast lateral entry that settles
	| 'orbit' // simulated rotational drift
	| 'track' // lateral dolly
	| 'pullBack'
	| 'driftIn'
	| 'linearHold';

/**
 * Progress curve per move type. Returns 0..1.
 * Uses spring physics so the acceleration profile is physical, not linear.
 */
export const useMoveProgress = (
	kind: MoveKind,
	durationInFrames: number,
	localFrame: number,
) => {
	const {fps} = useVideoConfig();

	if (kind === 'linearHold') {
		return interpolate(localFrame, [0, durationInFrames], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
	}

	const configs: Record<Exclude<MoveKind, 'linearHold'>, Parameters<typeof spring>[0]['config'] & object> = {
		// heavy, decelerating — a person walking in and stopping
		pushDecel: {damping: 200, stiffness: 18, mass: 3.2},
		// fast in, settles hard
		whipSettle: {damping: 26, stiffness: 120, mass: 1.1},
		orbit: {damping: 200, stiffness: 14, mass: 3.6},
		track: {damping: 200, stiffness: 16, mass: 3.0},
		pullBack: {damping: 200, stiffness: 15, mass: 3.2},
		driftIn: {damping: 200, stiffness: 12, mass: 3.4},
	};

	return spring({
		frame: localFrame,
		fps,
		config: configs[kind],
		durationInFrames,
		durationRestThreshold: 0.001,
	});
};

export const interpCam = (a: CamState, b: CamState, t: number): CamState => ({
	scale: a.scale + (b.scale - a.scale) * t,
	x: a.x + (b.x - a.x) * t,
	y: a.y + (b.y - a.y) * t,
	rotate: a.rotate + (b.rotate - a.rotate) * t,
});

export const camToTransform = (c: CamState) =>
	`translate(${c.x}%, ${c.y}%) scale(${c.scale}) rotate(${c.rotate}deg)`;

/**
 * A plate under continuous camera control.
 *
 * `origin` lets the zoom happen AROUND the shot's visual anchor (the glowing
 * circle we're about to match-cut on) rather than around frame centre — so the
 * anchor stays locked in place while everything else moves toward it.
 */
export const CameraPlate: React.FC<{
	src: string;
	entry: CamState;
	exit: CamState;
	move: MoveKind;
	durationInFrames: number;
	origin?: Anchor;
	scrim?: number;
	style?: React.CSSProperties;
}> = ({src, entry, exit, move, durationInFrames, origin, scrim = 0, style}) => {
	const frame = useCurrentFrame();
	const t = useMoveProgress(move, durationInFrames, frame);
	const c = interpCam(entry, exit, t);

	return (
		<AbsoluteFill style={{overflow: 'hidden', ...style}}>
			<Img
				src={staticFile(`storyboard-v2/${src}`)}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					transform: camToTransform(c),
					transformOrigin: origin
						? `${origin.x * 100}% ${origin.y * 100}%`
						: 'center center',
					willChange: 'transform',
				}}
			/>
			{scrim > 0 ? (
				<AbsoluteFill style={{backgroundColor: `rgba(8,6,4,${scrim})`}} />
			) : null}
		</AbsoluteFill>
	);
};
