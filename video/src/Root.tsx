import React from 'react';
import {Composition} from 'remotion';
import {NetflixAutoplayShort} from './NetflixAutoplayShort';
import {DURATION, FPS, HEIGHT, WIDTH} from './config/theme';
import {WhyCasinosHaveNoClocks} from './v2/WhyCasinosHaveNoClocks';
import {
	DURATION as V2_DURATION,
	FPS as V2_FPS,
	HEIGHT as V2_HEIGHT,
	WIDTH as V2_WIDTH,
} from './v2/config/timeline';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="WhyCasinosHaveNoClocks"
				component={WhyCasinosHaveNoClocks}
				durationInFrames={V2_DURATION}
				fps={V2_FPS}
				width={V2_WIDTH}
				height={V2_HEIGHT}
			/>
			<Composition
				id="NetflixAutoplayShort"
				component={NetflixAutoplayShort}
				durationInFrames={DURATION}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>
		</>
	);
};
