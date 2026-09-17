/**
 * Frame map + camera continuity map for "Why Casinos Have No Clocks".
 *
 * Every boundary carries a BRIDGE: the outgoing shot's motion vector and a
 * shared visual anchor continue into the incoming shot. There are zero hard
 * cuts — each `bridge` value is the number of frames the two shots co-exist
 * while the match is executed.
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 1800;

export type ShotId =
	| 's1'
	| 's2'
	| 's31'
	| 's32'
	| 's33'
	| 's4'
	| 's5'
	| 's6'
	| 's7';

export type Shot = {
	id: ShotId;
	from: number;
	durationInFrames: number;
	/** frames of overlap with the NEXT shot, during which the bridge runs */
	bridge: number;
	plate: string;
	vo: string;
};

export const SHOTS: Shot[] = [
	{
		id: 's1',
		from: 0,
		durationInFrames: 120,
		bridge: 12,
		plate: 's1-casino-floor-wide.png',
		vo: "Walk into any casino and count the clocks. You won't find one.",
	},
	{
		id: 's2',
		from: 120,
		durationInFrames: 180,
		bridge: 14,
		plate: 's2-floorplan-maze.png',
		vo: "It's not an accident. It's one of the most deliberate design decisions in retail history.",
	},
	{
		id: 's31',
		from: 300,
		durationInFrames: 135,
		bridge: 12,
		plate: 's3-1-ceiling-radial.png',
		vo: 'No clocks. No windows. So you never see the sun move.',
	},
	{
		id: 's32',
		from: 435,
		durationInFrames: 135,
		bridge: 12,
		plate: 's3-2-aisle-tracking.png',
		vo: 'Mazelike layouts, so leaving takes longer than staying.',
	},
	{
		id: 's33',
		from: 570,
		durationInFrames: 150,
		bridge: 18,
		plate: 's3-3-cocktail-macro.png',
		vo: "Free drinks, so your judgment slows down exactly when your money's on the table.",
	},
	{
		id: 's4',
		from: 720,
		durationInFrames: 360,
		bridge: 16,
		plate: 's4-clock-radial-blur.png',
		vo: "Studies on casino design call it time distortion architecture. And it works.",
	},
	{
		id: 's5',
		from: 1080,
		durationInFrames: 360,
		bridge: 20,
		plate: 's5-phone-radial-glow.png',
		vo: 'This isn\'t unique to casinos anymore. Social apps, streaming platforms borrowed the same playbook.',
	},
	{
		id: 's6',
		from: 1440,
		durationInFrames: 240,
		bridge: 16,
		plate: 's6-hand-timer-warm-to-neutral.png',
		vo: 'The fix is the same one that works in a casino. Bring your own clock.',
	},
	{
		id: 's7',
		from: 1680,
		durationInFrames: 120,
		bridge: 0,
		plate: 's7-endcard-white.png',
		vo: 'Follow for more of the invisible design decisions shaping your day.',
	},
];

export const shot = (id: ShotId): Shot => {
	const s = SHOTS.find((x) => x.id === id);
	if (!s) throw new Error(`Unknown shot ${id}`);
	return s;
};

/**
 * Colour temperature arc. This IS the emotional structure:
 * 2800K warm casino -> screen-blue accent at Scene 5 -> 5600K neutral at Scene 6.
 * Expressed as keyframes in frames -> Kelvin.
 */
export const TEMP_KEYFRAMES: {frame: number; kelvin: number}[] = [
	{frame: 0, kelvin: 2800},
	{frame: 720, kelvin: 2800},
	{frame: 1080, kelvin: 3000},
	{frame: 1260, kelvin: 4200},
	{frame: 1440, kelvin: 4200},
	{frame: 1660, kelvin: 5600},
	{frame: 1800, kelvin: 5600},
];
