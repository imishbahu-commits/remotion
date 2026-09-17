import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Plate} from '../components/Plate';
import {KineticWords} from '../components/KineticText';
import {CountUp, PunchNumber, StatLabel} from '../components/Numerals';
import {FadeFromBlack, ImpactFlash} from '../components/Transitions';
import {COLORS, SAFE} from '../config/theme';
import {STAT_HOURS_PER_DAY, STAT_LIFETIME_YEARS} from '../config/stats';

/**
 * SCENE 5 — STAKES / TWIST | frames 1050-1440
 *  5.1 (1050-1230, 180f) CountUp 0 -> 3.0 HOURS/DAY over clock/calendar bokeh.
 *  5.2 (1230-1440, 210f) Hard punch cut to "9 YEARS" over flying pages.
 *
 * Note the 0.5s near-silence beat before the 5.2 reveal: we hold an almost
 * black frame for 15f, then hit the numeral on the impact frame with a flash.
 */
export const Scene5Stakes: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.black}}>
			{/* 5.1 — lifts out of the 0.3s black hold that ends scene 4 */}
			<Sequence durationInFrames={180} name="5.1 Hours per day">
				<Plate
					src="shot-5-1-hours-per-day-bg.png"
					zoom={2.5}
					direction="in"
					durationInFrames={180}
					scrim={0.16}
				/>
				<AbsoluteFill
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						paddingLeft: SAFE.x,
						paddingRight: SAFE.x,
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 18,
						}}
					>
						<CountUp
							to={STAT_HOURS_PER_DAY.value}
							startFrame={14}
							durationInFrames={110}
							decimals={1}
							fontSize={300}
						/>
						<StatLabel at={30} width={520}>
							{STAT_HOURS_PER_DAY.label}
						</StatLabel>
					</div>
				</AbsoluteFill>
				<AbsoluteFill
					style={{
						justifyContent: 'flex-end',
						alignItems: 'center',
						paddingBottom: SAFE.bottom - 60,
						paddingLeft: SAFE.x,
						paddingRight: SAFE.x,
					}}
				>
					<KineticWords
						text="driven by this exact loop"
						startFrame={120}
						stagger={3}
						punchWords={['loop']}
						fontSize={56}
						accent={COLORS.coolGlow}
					/>
				</AbsoluteFill>
				{/* lift out of the 0.3s black hold that ends scene 4 */}
				<FadeFromBlack frames={10} />
			</Sequence>

			{/* 5.2 — hard punch cut, silence beat, then impact */}
			<Sequence from={180} durationInFrames={210} name="5.2 Nine years">
				<SilenceBeatAndReveal />
			</Sequence>
		</AbsoluteFill>
	);
};

const SilenceBeatAndReveal: React.FC = () => {
	const frame = useCurrentFrame();

	// 0.5s (15f) of near-silence / near-black before the reveal lands.
	const IMPACT = 15;

	// Plate stays very dark through the beat, then blooms up on impact.
	const plateOpacity = interpolate(frame, [0, IMPACT - 2, IMPACT], [0.1, 0.16, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.black}}>
			<AbsoluteFill style={{opacity: plateOpacity}}>
				<Plate
					src="shot-5-2-calendar-pages-flipping.png"
					zoom={5}
					direction="in"
					durationInFrames={210}
					scrim={0.14}
				/>
			</AbsoluteFill>

			<ImpactFlash at={IMPACT} frames={8} />

			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<PunchNumber
					value={STAT_LIFETIME_YEARS.display}
					suffix={STAT_LIFETIME_YEARS.label}
					impactFrame={IMPACT}
					fontSize={440}
				/>
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					justifyContent: 'flex-end',
					alignItems: 'center',
					paddingBottom: SAFE.bottom - 40,
					paddingLeft: SAFE.x,
					paddingRight: SAFE.x,
				}}
			>
				<KineticWords
					text="of loops that were never meant to end"
					startFrame={78}
					stagger={3}
					punchWords={['never']}
					fontSize={54}
					accent={COLORS.coolGlow}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
