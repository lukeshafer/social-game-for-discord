import { style } from '@vanilla-extract/css';

export default {
	gameWindow: style({
		width: '100vw',
		height: '100vh',
		position: 'relative',
		backgroundColor: 'white',
		overflow: 'hidden',
	}),

	mapWrapper: style({
		position: 'absolute',
		top: '50%',
		left: '50%',
		background: 'repeat',
	}),

	character: style({
		position: 'absolute',
		top: 0,
		left: 0,
	}),
};
