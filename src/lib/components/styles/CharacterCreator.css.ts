import { style, createVar } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
/** CSS tagged template performs no transformations on the CSS string
 *   and just exists to provide syntax highlighting.
 */
const css = String.raw;

const formBackground = createVar();
export default {
	root: style({
		backgroundImage: vars.tiles.wood,
		backgroundRepeat: 'repeat',
		backgroundSize: '128px',

		minHeight: '100svh',
		fontSize: '1.7rem',

		display: 'grid',
		gridTemplateRows: 'auto',
		gridAutoRows: css`minmax(60%, 1fr)`,
		gridTemplateColumns: css`repeat(auto-fit, 400px)`,
		flexWrap: 'wrap',

		justifyContent: 'center',
		placeItems: 'center',

		padding: '1rem',
		//paddingBottom: css`max(10%, 1rem)`,
	}),

	characterPreview: style({
		backgroundColor: vars.colors.teal[1],
		border: vars.border.shorthand,
		fontSize: '1.5rem',
		padding: 'var(--padding)',
		width: 'var(--width)',
		height: 'auto',
		//maxWidth: '15vw',
		aspectRatio: '0.5',
		position: 'relative',
		vars: {
			'--width': '10rem',
			'--padding': '0.5rem',
			'--img-width': 'calc(var(--width) - (var(--padding) * 2))',
		},
	}),

	characterPreviewImageBackground: style({
		position: 'absolute',
		top: '0',
		left: 0,
		width: '100%',
		height: '100%',
		background: 'var(--bg)',
		imageRendering: 'crisp-edges',
		mask: 'var(--img) top / 100% no-repeat',
	}),

	characterPreviewImage: style({
		width: '100%',
		top: '0',
		left: 0,
		height: 'auto',
		imageRendering: 'crisp-edges',
		position: 'absolute',
		mixBlendMode: 'multiply',
	}),

	characterForm: style({
		vars: {
			[formBackground]: vars.colors.sand[1],
		},
		padding: '1rem',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
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
		color: vars.colors.gray['8'],
		backgroundColor: vars.colors.sand[2],

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
		maxHeight: '30rem',
	}),

	tab: style({
		//height: '100%',
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

	textInput: style({
		width: '100%',
		maxWidth: '12rem',
		border: vars.border.shorthand,
		paddingInline: '0.5rem',
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
};
