import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

// A simple pseudo-random function helper for deterministic randomness per particle index
const randomNum = (seed: number) => {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
};

export const StickmanExplosion: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	// Timeline Milestones
	const WALK_END_FRAME = 50;
	const EXPLOSION_FRAME = 75;

	// 1. Walking Animation / Position
	const stickmanStartLeft = -100;
	const stickmanStopLeft = width / 2 - 80;

	const stickmanX = interpolate(
		frame,
		[0, WALK_END_FRAME],
		[stickmanStartLeft, stickmanStopLeft],
		{
			extrapolateRight: 'clamp',
		},
	);

	// Walking cycle logic (using sin wave for limb angles during walk)
	const isWalking = frame < WALK_END_FRAME;
	const walkCycle = isWalking ? frame * 0.4 : 0;
	const leftLegAngle = Math.sin(walkCycle) * 30;
	const rightLegAngle = -Math.sin(walkCycle) * 30;
	const leftArmAngle = -Math.sin(walkCycle) * 20;
	const rightArmAngle = Math.sin(walkCycle) * 20;

	// 2. Alert / Surprise animation just before explosion (frames 50 to 75)
	const surpriseScale = spring({
		frame: frame - WALK_END_FRAME,
		fps,
		config: {damping: 10, mass: 0.5},
	});
	const showSurprise = frame >= WALK_END_FRAME && frame < EXPLOSION_FRAME;

	// 3. Bomb animation (X: width / 2 + 50, Y: height / 2 + 100)
	const bombX = width / 2 + 80;
	const bombY = height / 2 + 120;

	// Fuse burning spark particles
	const sparks = Array.from({length: 12}).map((_, i) => {
		const angle = (i * 360) / 12 + (frame * 15);
		const distance = 15 + randomNum(i) * 10 + (frame % 5);
		const opacity = interpolate(frame % 5, [0, 4], [1, 0]);
		return {angle, distance, opacity};
	});

	// Fuse length shrinking
	const fusePercent = interpolate(frame, [0, EXPLOSION_FRAME], [1, 0], {
		extrapolateRight: 'clamp',
	});

	// 4. Screen Shake & Explosion Visuals
	const hasExploded = frame >= EXPLOSION_FRAME;
	const explosionProgress = (frame - EXPLOSION_FRAME) / (150 - EXPLOSION_FRAME);

	// Screen Shake logic (heavy shake at explosion, decaying over time)
	const shakeIntensity = interpolate(
		frame,
		[EXPLOSION_FRAME, EXPLOSION_FRAME + 25],
		[40, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	const shakeX = hasExploded ? (Math.sin(frame * 2.3) * shakeIntensity) : 0;
	const shakeY = hasExploded ? (Math.cos(frame * 1.9) * shakeIntensity) : 0;

	// Shockwave expansion
	const shockwaveScale = spring({
		frame: frame - EXPLOSION_FRAME,
		fps,
		config: {damping: 15, stiffness: 60},
	});
	const shockwaveOpacity = interpolate(
		frame - EXPLOSION_FRAME,
		[0, 15],
		[1, 0],
		{extrapolateRight: 'clamp'},
	);

	// Explosion Particles (Fire & Debris)
	const explosionParticles = Array.from({length: 45}).map((_, i) => {
		const angle = (i * 360) / 45 + randomNum(i * 3) * 15;
		const speed = 10 + randomNum(i * 5) * 25;
		const distanceSpring = spring({
			frame: frame - EXPLOSION_FRAME,
			fps,
			config: {damping: 12, stiffness: 40 + randomNum(i) * 30},
		});
		const distance = distanceSpring * speed * 25;
		const scale = interpolate(frame - EXPLOSION_FRAME, [0, 20], [20, 0], {
			extrapolateRight: 'clamp',
		});
		const opacity = interpolate(frame - EXPLOSION_FRAME, [15, 30], [1, 0], {
			extrapolateRight: 'clamp',
		});
		const color = i % 3 === 0 ? '#ff4d00' : i % 3 === 1 ? '#ffcc00' : '#ffffff';

		return {
			x: bombX + Math.cos((angle * Math.PI) / 180) * distance,
			y: bombY + Math.sin((angle * Math.PI) / 180) * distance,
			scale,
			opacity,
			color,
		};
	});

	// Ragdoll stickman pieces flying apart after explosion
	const ragdollSpring = spring({
		frame: frame - EXPLOSION_FRAME,
		fps,
		config: {damping: 15, stiffness: 25},
	});

	// We calculate individual trajectories for the stickman parts: head, torso, armL, armR, legL, legR
	const getLimbProps = (baseAngle: number, speedMultiplier: number) => {
		const angleRad = (baseAngle * Math.PI) / 180;
		const dist = ragdollSpring * 400 * speedMultiplier;
		const rot = ragdollSpring * 720 * (speedMultiplier > 1 ? 1 : -1);
		const opacity = interpolate(frame - EXPLOSION_FRAME, [30, 55], [1, 0], {
			extrapolateRight: 'clamp',
		});
		return {
			dx: Math.cos(angleRad) * dist,
			dy: Math.sin(angleRad) * dist + (ragdollSpring * ragdollSpring * 150), // gravity effect
			rot,
			opacity,
		};
	};

	const headRagdoll = getLimbProps(220, 1.5);
	const torsoRagdoll = getLimbProps(180, 0.8);
	const armLRagdoll = getLimbProps(260, 1.2);
	const armRRagdoll = getLimbProps(320, 1.3);
	const legLRagdoll = getLimbProps(150, 0.9);
	const legRRagdoll = getLimbProps(120, 1.1);

	// Blinding flash at explosion moment (frame 75 to 77)
	const flashOpacity = interpolate(
		frame - EXPLOSION_FRAME,
		[0, 2, 8],
		[0.9, 0.9, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	// BOOM text scale and rotation
	const boomScale = spring({
		frame: frame - EXPLOSION_FRAME,
		fps,
		config: {damping: 8, stiffness: 120},
	});
	const boomOpacity = interpolate(
		frame - EXPLOSION_FRAME,
		[25, 45],
		[1, 0],
		{extrapolateRight: 'clamp'},
	);

	// Smoke rising after the explosion
	const smokePlumes = Array.from({length: 8}).map((_, i) => {
		const delay = i * 4;
		const smokeFrame = frame - EXPLOSION_FRAME - delay;
		const t = smokeFrame / 40;
		const opacity = interpolate(t, [0, 0.2, 1], [0, 0.6, 0], {
			extrapolateRight: 'clamp',
		});
		const scale = interpolate(t, [0, 1], [15, 60], {
			extrapolateRight: 'clamp',
		});
		const xOffset = Math.sin(t * 5 + i) * 50;
		const yOffset = -t * 200;

		return {
			x: bombX + xOffset,
			y: bombY + yOffset,
			scale: smokeFrame > 0 ? scale : 0,
			opacity: smokeFrame > 0 ? opacity : 0,
		};
	});

	return (
		<AbsoluteFill style={{backgroundColor: '#11131c', overflow: 'hidden'}}>
			{/* Entire stage with shake applied */}
			<div
				style={{
					width: '100%',
					height: '100%',
					transform: `translate(${shakeX}px, ${shakeY}px)`,
					position: 'relative',
				}}
			>
				{/* Stylized background grid */}
				<svg
					style={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						opacity: 0.15,
					}}
				>
					<defs>
						<pattern
							id="grid"
							width="80"
							height="80"
							patternUnits="userSpaceOnUse"
						>
							<path
								d="M 80 0 L 0 0 0 80"
								fill="none"
								stroke="#ffffff"
								strokeWidth="2"
							/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#grid)" />
				</svg>

				{/* Ground Line */}
				<div
					style={{
						position: 'absolute',
						bottom: '20%',
						width: '100%',
						height: '4px',
						backgroundColor: '#40455c',
					}}
				/>

				{/* 1. Stickman character (before explosion) */}
				{!hasExploded && (
					<div
						style={{
							position: 'absolute',
							left: stickmanX,
							top: height / 2 - 50,
							width: 160,
							height: 250,
						}}
					>
						{/* Animated Stickman using SVG */}
						<svg width="160" height="250" viewBox="0 0 160 250">
							{/* Head */}
							<circle
								cx="80"
								cy="50"
								r="18"
								fill="none"
								stroke="#ffffff"
								strokeWidth="5"
							/>
							{/* Eyes (funny expressions) */}
							{showSurprise ? (
								<>
									{/* Alarmed dots */}
									<circle cx="73" cy="48" r="3" fill="#ffffff" />
									<circle cx="87" cy="48" r="3" fill="#ffffff" />
								</>
							) : (
								<>
									<circle cx="74" cy="50" r="2" fill="#ffffff" />
									<circle cx="86" cy="50" r="2" fill="#ffffff" />
								</>
							)}

							{/* Torso */}
							<line
								x1="80"
								y1="68"
								x2="80"
								y2="140"
								stroke="#ffffff"
								strokeWidth="5"
								strokeLinecap="round"
							/>

							{/* Left Arm */}
							<g transform={`rotate(${leftArmAngle}, 80, 75)`}>
								<line
									x1="80"
									y1="75"
									x2="50"
									y2="110"
									stroke="#ffffff"
									strokeWidth="5"
									strokeLinecap="round"
								/>
							</g>

							{/* Right Arm */}
							<g transform={`rotate(${rightArmAngle}, 80, 75)`}>
								<line
									x1="80"
									y1="75"
									x2="110"
									y2="110"
									stroke="#ffffff"
									strokeWidth="5"
									strokeLinecap="round"
								/>
							</g>

							{/* Left Leg */}
							<g transform={`rotate(${leftLegAngle}, 80, 140)`}>
								<line
									x1="80"
									y1="140"
									x2="60"
									y2="200"
									stroke="#ffffff"
									strokeWidth="5"
									strokeLinecap="round"
								/>
							</g>

							{/* Right Leg */}
							<g transform={`rotate(${rightLegAngle}, 80, 140)`}>
								<line
									x1="80"
									y1="140"
									x2="100"
									y2="200"
									stroke="#ffffff"
									strokeWidth="5"
									strokeLinecap="round"
								/>
							</g>
						</svg>

						{/* Alert surprise "!?" overhead */}
						{showSurprise && (
							<div
								style={{
									position: 'absolute',
									top: -60,
									left: 60,
									fontSize: 48,
									fontWeight: 'bold',
									color: '#ff3366',
									transform: `scale(${surpriseScale})`,
									textShadow: '0 0 8px rgba(255,51,102,0.8)',
									fontFamily: 'Impact, sans-serif',
								}}
							>
								!?
							</div>
						)}
					</div>
				)}

				{/* 2. Ragdoll Stickman Limbs (After explosion) */}
				{hasExploded && (
					<div
						style={{
							position: 'absolute',
							left: stickmanStopLeft,
							top: height / 2 - 50,
							width: 160,
							height: 250,
						}}
					>
						{/* Head flying */}
						<svg
							style={{
								position: 'absolute',
								overflow: 'visible',
								transform: `translate(${headRagdoll.dx}px, ${headRagdoll.dy}px) rotate(${headRagdoll.rot}deg)`,
								opacity: headRagdoll.opacity,
							}}
						>
							<circle
								cx="80"
								cy="50"
								r="18"
								fill="none"
								stroke="#ffffff"
								strokeWidth="5"
							/>
							{/* Alarmed crossed eyes */}
							<line x1="71" y1="45" x2="77" y2="51" stroke="#ffffff" strokeWidth="2" />
							<line x1="77" y1="45" x2="71" y2="51" stroke="#ffffff" strokeWidth="2" />
							<line x1="83" y1="45" x2="89" y2="51" stroke="#ffffff" strokeWidth="2" />
							<line x1="89" y1="45" x2="83" y2="51" stroke="#ffffff" strokeWidth="2" />
						</svg>

						{/* Torso flying */}
						<svg
							style={{
								position: 'absolute',
								overflow: 'visible',
								transform: `translate(${torsoRagdoll.dx}px, ${torsoRagdoll.dy}px) rotate(${torsoRagdoll.rot}deg)`,
								opacity: torsoRagdoll.opacity,
							}}
						>
							<line
								x1="80"
								y1="68"
								x2="80"
								y2="140"
								stroke="#ffffff"
								strokeWidth="5"
								strokeLinecap="round"
							/>
						</svg>

						{/* Left Arm flying */}
						<svg
							style={{
								position: 'absolute',
								overflow: 'visible',
								transform: `translate(${armLRagdoll.dx}px, ${armLRagdoll.dy}px) rotate(${armLRagdoll.rot}deg)`,
								opacity: armLRagdoll.opacity,
							}}
						>
							<line
								x1="80"
								y1="75"
								x2="50"
								y2="110"
								stroke="#ffffff"
								strokeWidth="5"
								strokeLinecap="round"
							/>
						</svg>

						{/* Right arm flying */}
						<svg
							style={{
								position: 'absolute',
								overflow: 'visible',
								transform: `translate(${armRRagdoll.dx}px, ${armRRagdoll.dy}px) rotate(${armRRagdoll.rot}deg)`,
								opacity: armRRagdoll.opacity,
							}}
						>
							<line
								x1="80"
								y1="75"
								x2="110"
								y2="110"
								stroke="#ffffff"
								strokeWidth="5"
								strokeLinecap="round"
							/>
						</svg>

						{/* Left leg flying */}
						<svg
							style={{
								position: 'absolute',
								overflow: 'visible',
								transform: `translate(${legLRagdoll.dx}px, ${legLRagdoll.dy}px) rotate(${legLRagdoll.rot}deg)`,
								opacity: legLRagdoll.opacity,
							}}
						>
							<line
								x1="80"
								y1="140"
								x2="60"
								y2="200"
								stroke="#ffffff"
								strokeWidth="5"
								strokeLinecap="round"
							/>
						</svg>

						{/* Right leg flying */}
						<svg
							style={{
								position: 'absolute',
								overflow: 'visible',
								transform: `translate(${legRRagdoll.dx}px, ${legRRagdoll.dy}px) rotate(${legRRagdoll.rot}deg)`,
								opacity: legRRagdoll.opacity,
							}}
						>
							<line
								x1="80"
								y1="140"
								x2="100"
								y2="200"
								stroke="#ffffff"
								strokeWidth="5"
								strokeLinecap="round"
							/>
						</svg>
					</div>
				)}

				{/* 3. The Bomb (Fades / scales down at explosion frame) */}
				{!hasExploded && (
					<div
						style={{
							position: 'absolute',
							left: bombX - 40,
							top: bombY - 60,
							width: 80,
							height: 80,
						}}
					>
						<svg width="80" height="80" viewBox="0 0 80 80">
							{/* Bomb Fuse Path */}
							<path
								d={`M 40 10 Q 55 -5 ${bombX - 35 + (20 * fusePercent)} ${bombY - 65 - (10 * fusePercent)}`}
								fill="none"
								stroke="#96613c"
								strokeWidth="3"
								strokeDasharray="20"
								strokeDashoffset={20 * (1 - fusePercent)}
							/>

							{/* Bomb Body */}
							<circle cx="40" cy="45" r="28" fill="#1d1f27" stroke="#ffffff" strokeWidth="4" />
							{/* Glossy Reflection */}
							<path
								d="M 22 28 A 20 20 0 0 1 38 18"
								fill="none"
								stroke="#ffffff"
								strokeWidth="3"
								strokeLinecap="round"
								opacity="0.3"
							/>
							{/* Cap */}
							<rect x="34" y="10" width="12" height="8" rx="2" fill="#32364a" stroke="#ffffff" strokeWidth="2" />
						</svg>

						{/* Fuse Sparks */}
						<div
							style={{
								position: 'absolute',
								left: 40 + 15 * fusePercent,
								top: -15 - 10 * fusePercent,
							}}
						>
							<svg width="60" height="60" style={{overflow: 'visible', transform: 'translate(-30px, -30px)'}}>
								{sparks.map((spark, idx) => {
									const radians = (spark.angle * Math.PI) / 180;
									const sx = 30 + Math.cos(radians) * spark.distance;
									const sy = 30 + Math.sin(radians) * spark.distance;
									return (
										<circle
											key={idx}
											cx={sx}
											cy={sy}
											r="3"
											fill="#ffa31a"
											opacity={spark.opacity}
											style={{
												filter: 'drop-shadow(0 0 3px #ff3300)',
											}}
										/>
									);
								})}
							</svg>
						</div>
					</div>
				)}

				{/* 4. Explosion Effects (Shockwaves, Fire, Smoke, Text) */}
				{hasExploded && (
					<>
						{/* Rising Smoke Plumes */}
						{smokePlumes.map((smoke, idx) => (
							<div
								key={`smoke-${idx}`}
								style={{
									position: 'absolute',
									left: smoke.x,
									top: smoke.y,
									width: smoke.scale,
									height: smoke.scale,
									borderRadius: '50%',
									backgroundColor: 'rgba(100, 105, 125, 0.4)',
									opacity: smoke.opacity,
									transform: 'translate(-50%, -50%)',
									filter: 'blur(10px)',
									pointerEvents: 'none',
								}}
							/>
						))}

						{/* Radial Shockwave Ring */}
						<div
							style={{
								position: 'absolute',
								left: bombX,
								top: bombY,
								width: shockwaveScale * 600,
								height: shockwaveScale * 600,
								borderRadius: '50%',
								border: '8px solid rgba(255, 255, 255, 0.8)',
								boxShadow: '0 0 30px rgba(255, 120, 0, 0.6) inset, 0 0 30px rgba(255, 120, 0, 0.6)',
								opacity: shockwaveOpacity,
								transform: 'translate(-50%, -50%) scale(1)',
								pointerEvents: 'none',
							}}
						/>

						{/* High-speed Fire particles */}
						{explosionParticles.map((p, idx) => (
							<div
								key={`part-${idx}`}
								style={{
									position: 'absolute',
									left: p.x,
									top: p.y,
									width: p.scale,
									height: p.scale,
									borderRadius: '50%',
									backgroundColor: p.color,
									opacity: p.opacity,
									transform: 'translate(-50%, -50%)',
									boxShadow: `0 0 15px ${p.color}`,
									pointerEvents: 'none',
								}}
							/>
						))}

						{/* Spectacular Comic-style "BOOM!" Text */}
						<div
							style={{
								position: 'absolute',
								left: bombX,
								top: bombY - 140,
								transform: `translate(-50%, -50%) scale(${boomScale}) rotate(${(frame % 2 === 0 ? 8 : -8)}deg)`,
								opacity: boomOpacity,
								pointerEvents: 'none',
								textAlign: 'center',
							}}
						>
							<div
								style={{
									fontFamily: '"Impact", "Arial Black", sans-serif',
									fontSize: 100,
									color: '#ffcc00',
									textShadow: `
										-4px -4px 0 #000,
										 4px -4px 0 #000,
										-4px  4px 0 #000,
										 4px  4px 0 #000,
										 0px  15px 25px rgba(255, 50, 0, 0.9)
									`,
									letterSpacing: 4,
								}}
							>
								KABOOM!
							</div>
						</div>
					</>
				)}

				{/* 5. Full Screen Flash Layer */}
				{hasExploded && flashOpacity > 0 && (
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							backgroundColor: '#ffffff',
							opacity: flashOpacity,
							pointerEvents: 'none',
						}}
					/>
				)}
			</div>
		</AbsoluteFill>
	);
};
