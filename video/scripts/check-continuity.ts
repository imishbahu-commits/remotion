/**
 * Asserts the camera throughline. Run: npm run check:continuity
 */
import {BOUNDARIES, checkContinuity} from '../src/v2/continuity';
import {SHOTS, DURATION} from '../src/v2/config/timeline';

let fail = false;

// 1. Frame map must tile the timeline with no gaps and no overruns.
let cursor = 0;
for (const s of SHOTS) {
	if (s.from !== cursor) {
		console.log(`FRAME MAP: ${s.id} starts at ${s.from}, expected ${cursor}`);
		fail = true;
	}
	cursor = s.from + s.durationInFrames;
}
if (cursor !== DURATION) {
	console.log(`FRAME MAP: shots end at ${cursor}, expected ${DURATION}`);
	fail = true;
}
console.log(`Frame map: ${SHOTS.length} shots tiling 0..${cursor} @30fps (${cursor / 30}s)`);

// 2. Every boundary must be bridged — no hard cuts allowed.
for (let i = 0; i < SHOTS.length - 1; i++) {
	if (SHOTS[i].bridge <= 0) {
		console.log(`HARD CUT: ${SHOTS[i].id} -> ${SHOTS[i + 1].id} has bridge=0`);
		fail = true;
	}
}
console.log(`Bridges: ${SHOTS.slice(0, -1).map((s) => `${s.id}:${s.bridge}f`).join('  ')}`);

// 3. Camera continuity.
console.log(`\nBoundaries: ${BOUNDARIES.length}`);
for (const b of BOUNDARIES) {
	console.log(`  [${b.kind === 'camera-continuous' ? 'CAM  ' : 'MORPH'}] ${b.name}`);
}
const issues = checkContinuity();
if (issues.length) {
	console.log('\nCONTINUITY FAIL:');
	for (const i of issues) console.log(' -', i.boundary, '::', i.detail);
	fail = true;
} else {
	console.log('\nOK: exit(N) === entry(N+1) at every camera-continuous boundary.');
}

process.exit(fail ? 1 : 0);
