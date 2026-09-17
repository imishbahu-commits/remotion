import {continueRender, delayRender, staticFile} from 'remotion';

// Typography per the storyboard spec:
//   headline -> bold condensed sans (Archivo Black)
//   UI/lower third -> geometric sans (Inter)
// Fonts are bundled locally (via @fontsource, copied into public/fonts) so
// rendering never depends on a network fetch.

export const HEADLINE = 'ArchivoBlack';
export const UI = 'InterLocal';

let loaded: Promise<void> | null = null;

export const loadFonts = () => {
	if (loaded) {
		return loaded;
	}

	const handle = delayRender('Loading fonts');

	loaded = (async () => {
		const headline = new FontFace(
			HEADLINE,
			`url(${staticFile('fonts/archivo-black.woff2')}) format('woff2')`,
		);
		const ui = new FontFace(
			UI,
			`url(${staticFile('fonts/inter.woff2')}) format('woff2')`,
			{weight: '400'},
		);
		const uiBold = new FontFace(
			UI,
			`url(${staticFile('fonts/inter-700.woff2')}) format('woff2')`,
			{weight: '700'},
		);

		await Promise.all([headline.load(), ui.load(), uiBold.load()]);
		document.fonts.add(headline);
		document.fonts.add(ui);
		document.fonts.add(uiBold);
		continueRender(handle);
	})();

	return loaded;
};
