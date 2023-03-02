import { globalStyle } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

globalStyle('menu', {
	margin: 0,
});

globalStyle('*', {
	scrollbarWidth: 'auto',
	scrollbarColor: `${vars.colors.gray['9']} ${vars.colors.gray['1']}`,
});

globalStyle('*::-webkit-scrollbar', {
	width: 22,
});

globalStyle('*::-webkit-scrollbar-track', {
	background: 'transparent',
});

globalStyle('*::-webkit-scrollbar-thumb', {
	width: '10px',
	background: vars.colors.gray['6'],
	border: vars.border.shorthand,
});

globalStyle('*::-webkit-scrollbar-thumb:hover', {
	background: 'rgba(0, 0, 0, 0.7)',
});

/** Reset */
// TODO: uncomment once cascade layers are in Vanilla Extract
//
//globalStyle('*, *::before, *::after', {
//boxSizing: 'border-box',
//fontFamily: 'inherit',
//});

//globalStyle('a', {
//textDecoration: 'none',
//color: 'inherit',
//cursor: 'pointer',
//});

//globalStyle('button', {
//backgroundColor: 'transparent',
//color: 'inherit',
//borderWidth: 0,
//padding: 0,
//cursor: 'pointer',
//});

//globalStyle('figure', {
//margin: 0,
//});

//globalStyle('input::-moz-focus-inner', {
//borderWidth: 0,
//padding: 0,
//margin: 0,
//});

//globalStyle('ul, ol, dd', {
//margin: 0,
//padding: 0,
//listStyle: 'none',
//});

//globalStyle('h1, h2, h3, h4, h5, h6', {
//margin: 0,
//fontSize: 'inherit',
//fontWeight: 'inherit',
//});

//globalStyle('p', {
//margin: 0,
//});

//globalStyle('cite', {
//fontStyle: 'normal',
//});

//globalStyle('fieldset', {
//borderWidth: 0,
//padding: 0,
//margin: 0,
//});
