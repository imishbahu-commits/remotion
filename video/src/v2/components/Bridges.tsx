import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {type Anchor, lerpAnchor} from '../config/anchors';

/**
 * BRIDGES — the fix for audit deficiency #1 and #4.
 *
 * v1 used hard cuts with a whoosh on top. These are real bridges: a shared
 * element (light, shape, direction) is carried continuously across the
 * boundary, and the mask driving the reveal is keyframed to grow/move between
 * the two shots' MEASURED anchor positions.
 *
 * Every bridge is a masked crossfade. The outgoing shot renders underneath,
 * the incoming shot renders on top inside a mask that animates from the
 * outgoing anchor to the incoming anchor.
 */

const EASE = Easing.bezier(0.45, 0, 0.15, 1);

/**
 * MATCH-CUT ON SHAPE / LIGHT.
 *
 * A circular mask centred on the outgoing shot's anchor grows to fill frame
 * while travelling to the incoming shot's anchor. Used for:
 *   glass rim -> clock face   (shape match)
 *   clock face -> phone glow  (radial light match)
 *   chandelier -> path glow   (light match)
 */
export const CircleMatchBridge: React.FC<{
	progress: number;
	fromAnchor: Anchor;
	toAnchor: Anchor;
	/** starting radius as fraction of frame width */
	fromRadius: number;
	children: React.ReactNode;
	/** soft edge in px */
	feather?: number;
}> = ({progress, fromAnchor, toAnchor, fromRadius, children, feather = 90}) => {
	const p = EASE(Math.max(0, Math.min(1, progress)));
	const a = lerpAnchor(fromAnchor, toAnchor, p);

	// grow from the anchor's own radius out past the frame diagonal
	const r = interpolate(p, [0, 1], [fromRadius * 100, 145]);
	const inner = Math.max(0, r - (feather / 1080) * 100);

	const mask = `radial-gradient(circle at ${a.x * 100}% ${a.y * 100}%, #000 ${inner}%, rgba(0,0,0,0) ${r}%)`;

	return (
		<AbsoluteFill
			style={{
				maskImage: mask,
				WebkitMaskImage: mask,
				willChange: 'mask-image',
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

/**
 * ZOOM-THROUGH.
 *
 * Camera dives into a glowing element until it blows out to white, then the
 * next shot emerges from that flash. Used for pathway -> ceiling.
 */
export const ZoomThroughBridge: React.FC<{
	progress: number;
	anchor: Anchor;
	color?: string;
	children: React.ReactNode;
}> = ({progress, anchor, color = 'rgba(255,214,150,1)', children}) => {
	const p = EASE(Math.max(0, Math.min(1, progress)));

	// the flash peaks mid-bridge and clears as the new shot arrives
	const flash = interpolate(p, [0, 0.45, 0.75, 1], [0, 0.92, 0.5, 0], {
		extrapolateRight: 'clamp',
	});
	const r = interpolate(p, [0, 1], [4, 160]);
	const bloom = `radial-gradient(circle at ${anchor.x * 100}% ${anchor.y * 100}%, ${color} 0%, rgba(255,214,150,0) ${r}%)`;

	return (
		<>
			{children}
			<AbsoluteFill
				style={{
					backgroundImage: bloom,
					opacity: flash,
					mixBlendMode: 'screen',
					pointerEvents: 'none',
				}}
			/>
		</>
	);
};

/**
 * RACK-FOCUS.
 *
 * Foreground blur wipes across as focus pulls from blur to sharp. The outgoing
 * shot defocuses while the incoming shot resolves — no cut, a focus pull.
 */
export const RackFocusBridge: React.FC<{
	progress: number;
	children: React.ReactNode;
}> = ({progress, children}) => {
	const p = EASE(Math.max(0, Math.min(1, progress)));
	const blur = interpolate(p, [0, 1], [26, 0]);
	const scale = interpolate(p, [0, 1], [1.06, 1]);

	return (
		<AbsoluteFill
			style={{
				filter: `blur(${blur}px)`,
				transform: `scale(${scale})`,
				willChange: 'filter, transform',
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

/** The defocus applied to the OUTGOING shot during a rack focus. */
export const RackFocusOut: React.FC<{
	progress: number;
	children: React.ReactNode;
}> = ({progress, children}) => {
	const p = EASE(Math.max(0, Math.min(1, progress)));
	const blur = interpolate(p, [0, 1], [0, 22]);
	return (
		<AbsoluteFill style={{filter: `blur(${blur}px)`, willChange: 'filter'}}>
			{children}
		</AbsoluteFill>
	);
};

/** A tray sweeping through the immediate foreground, motivating the rack. */
export const ForegroundSweep: React.FC<{progress: number}> = ({progress}) => {
	const p = Math.max(0, Math.min(1, progress));
	const x = interpolate(p, [0, 1], [-60, 160]);
	const opacity = interpolate(p, [0, 0.2, 0.8, 1], [0, 0.85, 0.85, 0]);

	return (
		<AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					left: `${x}%`,
					top: '-10%',
					width: '46%',
					height: '120%',
					background:
						'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(20,14,8,0.92) 35%, rgba(30,20,10,0.92) 65%, rgba(0,0,0,0) 100%)',
					filter: 'blur(34px)',
					opacity,
					transform: 'rotate(-6deg)',
				}}
			/>
		</AbsoluteFill>
	);
};

/**
 * WHIP-PAN.
 *
 * Directional blur + slide that carries the outgoing motion vector. Applied to
 * both shots so the pan is continuous through the boundary.
 */
export const WhipPan: React.FC<{
	progress: number;
	/** px of horizontal travel */
	distance?: number;
	incoming?: boolean;
	children: React.ReactNode;
}> = ({progress, distance = 420, incoming = false, children}) => {
	const p = EASE(Math.max(0, Math.min(1, progress)));
	const x = incoming
		? interpolate(p, [0, 1], [distance, 0])
		: interpolate(p, [0, 1], [0, -distance]);
	const blur = interpolate(p, [0, 0.5, 1], incoming ? [22, 10, 0] : [0, 14, 24]);

	return (
		<AbsoluteFill
			style={{
				transform: `translateX(${x}px)`,
				filter: `blur(${blur}px)`,
				willChange: 'transform, filter',
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

/**
 * IRIS-OPEN.
 *
 * Circular reveal matching the timer's circular UI, opening into the end card.
 */
export const IrisOpen: React.FC<{
	progress: number;
	anchor: Anchor;
	children: React.ReactNode;
}> = ({progress, anchor, children}) => {
	const p = EASE(Math.max(0, Math.min(1, progress)));
	const r = interpolate(p, [0, 1], [0, 150]);
	const mask = `radial-gradient(circle at ${anchor.x * 100}% ${anchor.y * 100}%, #000 ${Math.max(0, r - 3)}%, rgba(0,0,0,0) ${r}%)`;

	return (
		<AbsoluteFill style={{maskImage: mask, WebkitMaskImage: mask}}>
			{children}
		</AbsoluteFill>
	);
};

/** Helper: local progress of a bridge that ends at `endFrame`. */
export const useBridgeProgress = (endFrame: number, frames: number) => {
	const frame = useCurrentFrame();
	return interpolate(frame, [endFrame - frames, endFrame], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
};
