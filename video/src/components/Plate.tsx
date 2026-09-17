import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

type Direction = 'in' | 'out';

export type PlateProps = {
	/** filename inside public/storyboard */
	src: string;
	/** Ken Burns zoom amount in percent. Storyboard asks for 2-5%, varied per shot. */
	zoom?: number;
	direction?: Direction;
	/** Slow pan, in px across the whole shot. */
	panX?: number;
	panY?: number;
	durationInFrames: number;
	/** Extra darkening so type always reads on top. */
	scrim?: number;
	style?: React.CSSProperties;
};

/**
 * A single generated storyboard image with a Ken Burns move.
 *
 * Every plate is generated at 1080x1920 (upscaled from 768x1376), so we always
 * start slightly scaled up: this hides any sub-pixel edge during the move and
 * means the zoom never reveals the frame border.
 */
export const Plate: React.FC<PlateProps> = ({
	src,
	zoom = 3,
	direction = 'in',
	panX = 0,
	panY = 0,
	durationInFrames,
	scrim = 0,
	style,
}) => {
	const frame = useCurrentFrame();
	const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const base = 1.04;
	const amount = zoom / 100;
	const scale =
		direction === 'in' ? base + amount * progress : base + amount * (1 - progress);

	const x = panX * progress;
	const y = panY * progress;

	return (
		<AbsoluteFill style={{overflow: 'hidden', ...style}}>
			<Img
				src={staticFile(`storyboard/${src}`)}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					transform: `scale(${scale}) translate(${x}px, ${y}px)`,
					transformOrigin: 'center center',
				}}
			/>
			{scrim > 0 ? (
				<AbsoluteFill style={{backgroundColor: `rgba(4,8,16,${scrim})`}} />
			) : null}
		</AbsoluteFill>
	);
};
