import { style, createVar } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
/** CSS tagged template performs no transformations on the CSS string
 *   and just exists to provide syntax highlighting.
 */
const css = String.raw;

const formBackground = createVar();
export default {
	characterPreview: style({
		backgroundColor: vars.colors.teal[1],
		border: vars.border.shorthand,
		padding: '1rem',
		height: 'min-content',
	}),

	characterForm: style({
		vars: {
			[formBackground]: vars.colors.sand[1],
		},
		padding: '1rem',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
	}),

	tabButtonList: style({
		paddingInline: '1rem',
		display: 'flex',
		gap: '1rem',
	}),

	tabButton: style({
		padding: '0.1rem 0.3rem',
		border: vars.border.shorthand,
		transform: `translateY(${vars.border.width})`,
		color: '333',

		selectors: {
			'body:not(.js) &': {
				display: 'none',
			},
		},
	}),

	tabButtonActive: style({
		color: 'black',
		background: formBackground,
		borderBottomColor: formBackground,
		position: 'relative',
		zIndex: 1,
	}),

	tabWrapper: style({
		position: 'relative',
		height: '100%',
	}),

	tab: style({
		height: '100%',
		display: 'none',
		position: 'absolute',
		inset: 0,

		selectors: {
			'&.active': {
				display: 'block',
			},
		},
	}),

	tabFieldset: style({
		background: formBackground,
		border: vars.border.shorthand,
		borderRadius: 0,
		color: 'black',
		height: '100%',
		maxHeight: '30rem',
		maxWidth: '20rem',
		overflowY: 'scroll',

		selectors: {
			'body:not(.js) &': {
				display: 'block',
			},
		},
	}),

	feature: style({
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		alignContent: 'center',
		borderRadius: 0,
	}),

	featureInputWrapper: style({
		display: 'flex',
		gap: '0.3rem',
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
	}),

	featureChangeButton: style({
		height: 'min-content',
		padding: '0rem 0.5rem 0.1rem',
		background: formBackground,
		border: vars.border.shorthand,
		color: 'black',
	}),

	featureOption: style({
		display: 'none',
		width: '6rem',

		selectors: {
			'&.active': {
				display: 'block',
			},

			'body:not(.js) &': {
				display: 'block',
				color: vars.colors.gray[1],
			},

			'body:not(.js) &:checked': {
				color: 'inherit',
			},
		},
	}),
	root: style({
		backgroundImage: css`url("/sprites/wood.svg")`,
		backgroundRepeat: 'repeat',

		minHeight: '100vh',
		fontSize: '1.7rem',

		display: 'grid',
		gridTemplateRows: css`auto fit-content(1fr)`,
		gridTemplateColumns: css`repeat(auto-fit, minmax(auto, 500px))`,
		flexWrap: 'wrap',

		justifyContent: 'center',
		placeItems: 'center',
		gap: '2rem',

		padding: '1rem',
		paddingBottom: css`max(10%, 1rem)`,
	}),
};
