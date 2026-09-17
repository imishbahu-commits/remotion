import React from 'react';
import {Composition} from 'remotion';
import {NetflixAutoplayShort} from './NetflixAutoplayShort';
import {DURATION, FPS, HEIGHT, WIDTH} from './config/theme';

export const RemotionRoot: React.FC = () => {
	return (
		<>
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
