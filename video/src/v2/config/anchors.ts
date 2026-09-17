/**
 * MEASURED visual anchors — not guessed.
 *
 * Each value is the luminance centroid of the glowing circular element in the
 * generated plate, computed from the actual pixels (see scripts/measure-anchors).
 * The match-cut masks interpolate BETWEEN these measured points, which is what
 * makes a morph land on the shape instead of near it.
 *
 * Normalised 0..1 of frame width/height.
 */
export type Anchor = {x: number; y: number};

export const ANCHORS = {
	/** Scene 1 — chandelier glow, the light we match-cut on. */
	chandelier: {x: 0.481, y: 0.393} as Anchor,
	/** Scene 2 — brightest point of the glowing pathway. */
	pathGlow: {x: 0.46, y: 0.391} as Anchor,
	/** Scene 3.1 — centre of the radial ceiling fixture (symmetrical by construction). */
	ceilingHub: {x: 0.5, y: 0.42} as Anchor,
	/** Scene 3.2 — vanishing point of the aisle's converging leading lines. */
	aisleVanish: {x: 0.5, y: 0.46} as Anchor,
	/** Scene 3.3 — rim of the cocktail glass. Morph source. */
	glassRim: {x: 0.555, y: 0.555} as Anchor,
	/** Scene 4 — clock face pivot. Morph target from glassRim, source to phoneGlow. */
	clockFace: {x: 0.53, y: 0.441} as Anchor,
	/** Scene 5 — phone screen radial glow. Near-identical to clockFace by design. */
	phoneGlow: {x: 0.552, y: 0.445} as Anchor,
	/** Scene 6 — the circular timer UI the iris opens from. */
	timerUI: {x: 0.54, y: 0.47} as Anchor,
} as const;

/** Radius (in fractions of frame width) of each circular anchor, for mask sizing. */
export const ANCHOR_RADIUS = {
	glassRim: 0.23,
	clockFace: 0.3,
	phoneGlow: 0.26,
	timerUI: 0.16,
} as const;

export const lerpAnchor = (a: Anchor, b: Anchor, t: number): Anchor => ({
	x: a.x + (b.x - a.x) * t,
	y: a.y + (b.y - a.y) * t,
});
