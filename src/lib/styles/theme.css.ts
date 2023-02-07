import { createTheme, } from '@vanilla-extract/css'

export const [themeClass, vars] = createTheme({
	colors: {
		teal: {
			1: '#C3FAE8',
		},
		sand: {
			1: '#E6E4DC',
		},
		gray: {
			1: '#F1F3F5',
		}
	},

	// "3px solid black",
	border: border()
} as const)

function border() {
	const width = "3px"
	const style = "solid"
	const color = "black"
	return {
		width,
		style,
		color,
		shorthand: `${width} ${style} ${color}`,
	} as const
}
