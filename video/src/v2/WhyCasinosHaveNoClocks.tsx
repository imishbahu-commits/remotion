import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {
	CircleMatchBridge,
	IrisOpen,
	RackFocusBridge,
	RackFocusOut,
	WhipPan,
	ZoomThroughBridge,
} from './components/Bridges';
import {Bloom, Grain, TemperatureGrade} from './components/Grade';
import {ANCHORS, ANCHOR_RADIUS} from './config/anchors';
import {SHOTS, type ShotId, shot} from './config/timeline';
import {AMBIENT_SRC, ambientVolumeAt} from './config/audio';
import {loadFonts} from '../config/fonts';
import {
	Scene1,
	Scene2,
	Scene31,
	Scene32,
	Scene33,
	Scene4,
	Scene5,
	Scene6,
	Scene7,
} from './Scenes';

loadFonts();

/**
 * "WHY CASINOS HAVE NO CLOCKS" — 1080x1920, 30fps, 1800 frames.
 *
 * ZERO HARD CUTS.
 * ===============
 * Every one of the seven boundaries is a continuous camera move or a matched
 * element morph.
 *
 * HOW THE OVERLAP WORKS (this is the part that is easy to get wrong):
 * a shot's slot on the timeline is [from, from + duration). The bridge for
 * boundary i occupies the LAST `bridge` frames of shot i. The overlap is
 * created by shot i+1 starting EARLY — at `from(i+1) - bridge(i)` — and
 * rendering on top of shot i inside the bridge's mask. Shot i is NOT extended.
 *
 * Consequence: an incoming shot's local frame 0 is the moment it begins to be
 * revealed, so its camera move is already running while the mask opens. There
 * must be no inner time offset on the incoming scene, or the mask reveals
 * empty space and the transition silently renders as a hard cut.
 *
 * Boundary ledger:
 *   1 -> 2    match-cut on light      chandelier glow -> pathway glow
 *   2 -> 3.1  zoom-through            dive into the glow, emerge on the ceiling
 *   3.1 -> 3.2 orbit-continue         rotation becomes lateral track
 *   3.2 -> 3.3 rack focus             foreground sweep motivates the pull
 *   3.3 -> 4  shape match             glass rim -> clock face
 *   4 -> 5    radial-wipe morph       clock face -> phone glow
 *   5 -> 6    temperature crossfade   married to a pan (warm -> neutral)
 *   6 -> 7    iris open               circular timer UI opens the end card
 */

/** bridge length INTO a shot = the previous shot's bridge value. */
const bridgeIn = (id: ShotId): number => {
	const i = SHOTS.findIndex((s) => s.id === id);
	return i <= 0 ? 0 : SHOTS[i - 1].bridge;
};

/**
 * Timeline slot for a shot, widened at the head by its incoming bridge so it
 * overlaps the outgoing shot. `visible` is how long it is on screen, which is
 * also the span its camera move must cover.
 */
const slot = (id: ShotId) => {
	const s = shot(id);
	const bIn = bridgeIn(id);
	return {
		from: s.from - bIn,
		visible: s.durationInFrames + bIn,
		bIn,
		bOut: s.bridge,
		/** local frame at which this shot's own outgoing bridge starts */
		outAt: bIn + s.durationInFrames - s.bridge,
	};
};

export const WhyCasinosHaveNoClocks: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#070503'}}>
			<Shots />

			{/* ---- one global post-process stack, applied over everything ---- */}
			<TemperatureGrade />
			<Bloom />
			<Grain />

			{/* Ambient bed with the 0.4s duck at the S4->S5 morph.
			    Renders nothing until a bed is chosen — see OPEN ITEM #2. */}
			{AMBIENT_SRC ? (
				<Audio src={AMBIENT_SRC} volume={(f) => ambientVolumeAt(f)} />
			) : null}
		</AbsoluteFill>
	);
};

/** Progress 0..1 across a bridge occupying local frames [start, start+len]. */
const useSpan = (start: number, len: number) => {
	const frame = useCurrentFrame();
	return interpolate(frame, [start, start + len], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
};

const Shots: React.FC = () => {
	const a = slot('s1');
	const b = slot('s2');
	const c = slot('s31');
	const d = slot('s32');
	const e = slot('s33');
	const f = slot('s4');
	const g = slot('s5');
	const h = slot('s6');
	const i = slot('s7');

	return (
		<AbsoluteFill>
			{/* ---------------- S1 — no incoming bridge, it opens the film ------- */}
			<Sequence from={a.from} durationInFrames={a.visible}>
				<Scene1 durationInFrames={a.visible} />
			</Sequence>

			{/* ---------------- S2 — revealed from inside S1's chandelier -------- */}
			{/* chandelier (0.481,0.393) -> path glow (0.460,0.391): ~0.02 delta,
			    so the two lights sit on top of each other. */}
			<Sequence from={b.from} durationInFrames={b.visible}>
				<S2Bridged slot={b} />
			</Sequence>

			{/* ---------------- S3.1 — emerges from the zoom-through flash ------- */}
			<Sequence from={c.from} durationInFrames={c.visible}>
				<S31Bridged slot={c} />
			</Sequence>

			{/* ---------------- S3.2 — orbit continues into a lateral track ------ */}
			<Sequence from={d.from} durationInFrames={d.visible}>
				<S32Bridged slot={d} />
			</Sequence>

			{/* ---------------- S3.3 — rack focus resolves onto the glass -------- */}
			<Sequence from={e.from} durationInFrames={e.visible}>
				<S33Bridged slot={e} />
			</Sequence>

			{/* ---------------- S4 — SHAPE MATCH: glass rim -> clock face -------- */}
			{/* mask centre lerps (0.555,0.555) -> (0.530,0.441), both measured. */}
			<Sequence from={f.from} durationInFrames={f.visible}>
				<S4Bridged slot={f} />
			</Sequence>

			{/* ---------------- S5 — RADIAL MORPH: clock -> phone glow ----------- */}
			{/* (0.530,0.441) -> (0.552,0.445): ~0.02 delta, no correction needed. */}
			<Sequence from={g.from} durationInFrames={g.visible}>
				<S5Bridged slot={g} />
			</Sequence>

			{/* ---------------- S6 — temperature crossfade married to a pan ------ */}
			<Sequence from={h.from} durationInFrames={h.visible}>
				<S6Bridged slot={h} />
			</Sequence>

			{/* ---------------- S7 — iris opens out of the circular timer UI ----- */}
			<Sequence from={i.from} durationInFrames={i.visible}>
				<S7Bridged slot={i} />
			</Sequence>
		</AbsoluteFill>
	);
};

type Slot = ReturnType<typeof slot>;

const S2Bridged: React.FC<{slot: Slot}> = ({slot: s}) => {
	const p = useSpan(0, s.bIn);

	return (
		<CircleMatchBridge
			progress={p}
			fromAnchor={ANCHORS.chandelier}
			toAnchor={ANCHORS.pathGlow}
			fromRadius={0.09}
			feather={120}
		>
			{/* the whip carries S1's leftward vector into S2 */}
			<WhipPan progress={p} incoming distance={300}>
				<Scene2 durationInFrames={s.visible} />
			</WhipPan>
		</CircleMatchBridge>
	);
};

const S31Bridged: React.FC<{slot: Slot}> = ({slot: s}) => {
	const p = useSpan(0, s.bIn);

	return (
		<ZoomThroughBridge progress={p} anchor={ANCHORS.pathGlow}>
			<CircleMatchBridge
				progress={p}
				fromAnchor={ANCHORS.pathGlow}
				toAnchor={ANCHORS.ceilingHub}
				fromRadius={0.04}
				feather={160}
			>
				<Scene31 durationInFrames={s.visible} />
			</CircleMatchBridge>
		</ZoomThroughBridge>
	);
};

const S32Bridged: React.FC<{slot: Slot}> = ({slot: s}) => {
	// in: orbit tangent becomes a lateral track — soft dissolve keeps the
	// rotation reading as one continuous move rather than a masked reveal.
	const pIn = useSpan(0, s.bIn);
	// out: S3.2 defocuses across its own tail, which IS the rack focus. Owning
	// both halves is what makes it a focus pull instead of a dissolve between
	// two separately-focused images.
	const pOut = useSpan(s.outAt, s.bOut);

	return (
		<AbsoluteFill style={{opacity: pIn}}>
			<RackFocusOut progress={pOut}>
				<Scene32 durationInFrames={s.visible} />
			</RackFocusOut>
		</AbsoluteFill>
	);
};

const S33Bridged: React.FC<{slot: Slot}> = ({slot: s}) => {
	const p = useSpan(0, s.bIn);
	const opacity = interpolate(p, [0.1, 0.9], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{opacity}}>
			<RackFocusBridge progress={p}>
				<Scene33 durationInFrames={s.visible} bridgeIn={s.bIn} />
			</RackFocusBridge>
		</AbsoluteFill>
	);
};

const S4Bridged: React.FC<{slot: Slot}> = ({slot: s}) => {
	const p = useSpan(0, s.bIn);

	return (
		<CircleMatchBridge
			progress={p}
			fromAnchor={ANCHORS.glassRim}
			toAnchor={ANCHORS.clockFace}
			fromRadius={ANCHOR_RADIUS.glassRim}
			feather={70}
		>
			<Scene4 durationInFrames={s.visible} />
		</CircleMatchBridge>
	);
};

const S5Bridged: React.FC<{slot: Slot}> = ({slot: s}) => {
	const p = useSpan(0, s.bIn);

	return (
		<CircleMatchBridge
			progress={p}
			fromAnchor={ANCHORS.clockFace}
			toAnchor={ANCHORS.phoneGlow}
			fromRadius={ANCHOR_RADIUS.clockFace}
			feather={100}
		>
			<Scene5 durationInFrames={s.visible} />
		</CircleMatchBridge>
	);
};

const S6Bridged: React.FC<{slot: Slot}> = ({slot: s}) => {
	const p = useSpan(0, s.bIn);
	// Light-temperature crossfade married to a pan: the dissolve and the
	// lateral move happen together so neither reads as an edit.
	const x = interpolate(p, [0, 1], [140, 0]);

	return (
		<AbsoluteFill style={{opacity: p, transform: `translateX(${x}px)`}}>
			<Scene6 durationInFrames={s.visible} />
		</AbsoluteFill>
	);
};

const S7Bridged: React.FC<{slot: Slot}> = ({slot: s}) => {
	const p = useSpan(0, s.bIn);

	return (
		<IrisOpen progress={p} anchor={ANCHORS.timerUI}>
			<Scene7 durationInFrames={s.visible} />
		</IrisOpen>
	);
};
