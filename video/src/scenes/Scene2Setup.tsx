import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {KineticWords, Label} from '../components/KineticText';
import {VerticalWipeOut} from '../components/Transitions';
import {COLORS, SAFE} from '../config/theme';

/**
 * SCENE 2 — SETUP | frames 120-300 (180f)
 *
 * Split comparison: left = 2011 manual play, right = TODAY autoplay.
 * The right panel slides in from the right over 15 frames.
 *
 * Implementation note: the plates are full 9:16 phone mockups, so slicing the
 * frame 50/50 would cut each phone in half. Instead each side is rendered as a
 * complete device card, which keeps both UIs legible at a glance — that
 * comparison IS the point of the scene.
 */

const CARD_W = 430;
const CARD_H = Math.round((CARD_W * 1920) / 1080); // preserve 9:16

const DeviceCard: React.FC<{
	src: string;
	glow: string;
	zoom: number;
	dim?: boolean;
}> = ({src, glow, zoom, dim}) => {
	const frame = useCurrentFrame();
	const scale = 1.02 + (zoom / 100) * interpolate(frame, [0, 180], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				width: CARD_W,
				height: CARD_H,
				borderRadius: 34,
				overflow: 'hidden',
				position: 'relative',
				border: `2px solid ${glow}66`,
				boxShadow: `0 0 60px ${glow}33, 0 24px 60px rgba(0,0,0,0.6)`,
			}}
		>
			<Img
				src={staticFile(`storyboard/${src}`)}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					transform: `scale(${scale})`,
				}}
			/>
			{dim ? (
				<AbsoluteFill style={{backgroundColor: 'rgba(6,12,24,0.42)'}} />
			) : null}
		</div>
	);
};

export const Scene2Setup: React.FC = () => {
	const frame = useCurrentFrame();

	// Right card slides in from the right over 15 frames.
	const slide = interpolate(frame, [0, 15], [620, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const rightOpacity = interpolate(frame, [0, 10], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const leftOpacity = interpolate(frame, [0, 8], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(70% 50% at 50% 42%, ${COLORS.coolMid} 0%, ${COLORS.coolShadow} 70%)`,
			}}
		>
			{/* Labels */}
			<AbsoluteFill
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'flex-start',
					gap: 106,
					paddingTop: 330,
				}}
			>
				<div style={{width: CARD_W, textAlign: 'center'}}>
					<Label at={14} fontSize={30} color={COLORS.dim}>
						2011
					</Label>
				</div>
				<div style={{width: CARD_W, textAlign: 'center'}}>
					<Label at={22} fontSize={30} color={COLORS.coolGlow}>
						Today
					</Label>
				</div>
			</AbsoluteFill>

			{/* Device cards */}
			<AbsoluteFill
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 40,
					paddingBottom: 120,
				}}
			>
				<div style={{opacity: leftOpacity}}>
					<DeviceCard
						src="shot-2-1a-left-panel-2011-manual-play.png"
						glow="#8fa3bb"
						zoom={2}
						dim
					/>
				</div>
				<div
					style={{
						transform: `translateX(${slide}px)`,
						opacity: rightOpacity,
					}}
				>
					<DeviceCard
						src="shot-2-1b-right-panel-today-autoplay.png"
						glow={COLORS.coolGlow}
						zoom={4}
					/>
				</div>
			</AbsoluteFill>

			{/* VO text — pinned to the lower safe area */}
			<AbsoluteFill
				style={{
					justifyContent: 'flex-end',
					alignItems: 'center',
					paddingBottom: SAFE.bottom - 40,
					paddingLeft: SAFE.x,
					paddingRight: SAFE.x,
				}}
			>
				{frame < 104 ? (
					<KineticWords
						text="In 2012 they made one small change"
						startFrame={14}
						stagger={3}
						punchWords={['one', 'small', 'change']}
						fontSize={68}
						accent={COLORS.coolGlow}
					/>
				) : (
					<KineticWords
						text="AUTOPLAY"
						startFrame={106}
						stagger={2}
						punchWords={['AUTOPLAY']}
						fontSize={128}
						accent={COLORS.coolGlow}
					/>
				)}
			</AbsoluteFill>

			{/* 2.1 -> 3.1 vertical wipe, 8 frames */}
			<VerticalWipeOut at={172} frames={8} />
		</AbsoluteFill>
	);
};
