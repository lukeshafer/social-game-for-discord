export type TabName = keyof typeof characterOptions;
export const characterOptions = {
	appearance: {
		'skin-tone': [
			{
				key: '1',
				name: '1',
			},
			{
				key: '2',
				name: '2',
			},
			{
				key: '3',
				name: '3',
			},
			{
				key: '4',
				name: '4',
			},
			{
				key: '2',
				name: '2',
			},
			{
				key: '2',
				name: '2',
			},
			{
				key: '2',
				name: '2',
			},
		],
		'body-type': {
			chubby: '',
			chunky: '',
			skinny: '',
			buff: '',
		},
		'mobility-aid': {
			none: '',
			cane: '',
			wheelchair: '',
		},
	},
	head: {
		'face-shape': {
			round: '',
			tall: '',
			square: '',
			oval: '',
		},
		'hair-texture': {
			straight: '',
			wavy: '',
			curly: '',
			coily: '',
			'protective-style': '',
		},
		'hair-length': {
			short: '',
			medium: '',
			long: '',
		},
		'hair-color': {
			black: '',
			'dark-brown': '',
			'light-brown': '',
			blonde: '',
			red: '',
			gray: '',
			pink: '',
			green: '',
			blue: '',
			purple: '',
			white: '',
			'red-dyed': '',
		},
		'eye-color': {
			brown: '',
			amber: '',
			gray: '',
			blue: '',
			green: '',
			hazel: '',
		},
		'facial-hair': {
			none: '',
			beard: '',
			goatee: '',
			mustache: '',
		},
	},
} satisfies {
	[tabName: string]: {
		[optionName: string]: {
			key: string;
			name: string;
		}[];
	};
};
