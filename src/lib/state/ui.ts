import { createStore } from 'solid-js/store';
import { player } from '@/state/player';

const [gameViewStore, setGameView] = createStore({
	width: 0,
	height: 0,
	setSize: (width: number, height: number) => {
		setGameView('width', width);
		setGameView('height', height);
	},
});

const [dialogStore, setDialog] = createStore({
	isOpen: false,
	text: '',
	speaker: '',
	open: (text: string, speaker?: string) => {
		player.setMovementLocked(true);
		setDialog('text', text);
		setDialog('speaker', speaker || '');
		setDialog('isOpen', true);
	},
	close: () => {
		player.setMovementLocked(false);
		setDialog('isOpen', false);
		setDialog('text', '');
		setDialog('speaker', '');
	},
	// TODO: implement a "next" method for longer dialogues
});

export const [gameView] = createStore(gameViewStore);
export const [dialog] = createStore(dialogStore);
