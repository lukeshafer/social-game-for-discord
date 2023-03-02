import { createTheme } from '@vanilla-extract/css';
import { colors } from './colors.css';

export const [themeClass, vars] = createTheme({
	colors,
	// "3px solid black",
	border: border(),

	tiles: {
		wood: css`url("/sprites/wood.svg")`,
	},
} as const);

function border() {
	const width = '3px';
	const style = 'solid';
	const color = 'black';
	return {
		width,
		style,
		color,
		shorthand: `${width} ${style} ${color}`,
	} as const;
}

/** CSS tagged template performs no transformations on the CSS string
 *   and just exists to provide syntax highlighting.
 */
function css(...input: Parameters<typeof String.raw>) {
	return String.raw(...input);
}
