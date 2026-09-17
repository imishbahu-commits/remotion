// Global look & feel — derived from the storyboard pre-production specs.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 1800;

export const COLORS = {
	// Cool blue base (2800K shadows / 6500K highlights)
	coolShadow: '#08111f',
	coolMid: '#0e2036',
	coolAccent: '#4da3ff',
	coolGlow: '#7fc4ff',
	// Warm gold resolution act (3200K)
	warmAccent: '#ffb347',
	warmGlow: '#ffd79a',
	white: '#ffffff',
	dim: 'rgba(255,255,255,0.62)',
	black: '#000000',
};

// Safe margins for a 9:16 short (avoids platform UI chrome).
export const SAFE = {
	x: 88,
	top: 210,
	bottom: 300,
};

// Spring specified in the storyboard for kinetic punch-ins.
export const PUNCH_SPRING = {damping: 10, stiffness: 120, mass: 0.8};

// The final act colour shift: cool blue -> warm gold across shot 6.1.
export const GRADE_SHIFT_START = 1440;
export const GRADE_SHIFT_END = 1680;
