import { createStore } from 'solid-js/store';
import { clamp } from '@/utils';
import { getMap, type MapName } from '@/maps';
import { TILE_SIZE, PLAYER_WIDTH, PLAYER_HEIGHT } from '@/constants';

type Delta = 0 | 1 | -1;

export interface PlayerControls {
	up: string;
	down: string;
	left: string;
	right: string;
}

export const [state, setState] = createStore({
	player: {
		x: 0,
		y: 0,
		dx: 0 as Delta,
		dy: 0 as Delta,
		xMax: 0,
		yMax: 0,
		get position() {
			return { x: this.x, y: this.y } as const;
		},
		get movementData() {
			return {
				dx: this.dx,
				dy: this.dy,
				xMax: this.xMax,
				yMax: this.yMax,
			} as const;
		},
	},
	map: {
		name: undefined as MapName | undefined,
		get info() {
			if (this.name) return getMap(this.name);
			return undefined;
		},
		get position() {
			if (!this.info || !window) return undefined;
			const mapWidth = this.info.width * TILE_SIZE;
			const windowWidth = window.innerWidth;
			const minX = windowWidth / 2;
			const maxX = mapWidth - minX;
			const x =
				mapWidth > windowWidth
					? -clamp(state.player.x + PLAYER_WIDTH / 2, minX, maxX)
					: -mapWidth / 2;

			const mapHeight = this.info.height * TILE_SIZE;
			const windowHeight = window.innerHeight;
			const minY = windowHeight / 2;
			const maxY = mapHeight - minY;
			const y =
				mapHeight > window.innerHeight
					? -clamp(state.player.y + PLAYER_HEIGHT / 2, minY, maxY)
					: -mapHeight / 2;

			return {
				x,
				y,
			};
		},
	},
});

let isControlsSet = false;
export const player = {
	get state() {
		return state.player;
	},
	placeAt: (x: number, y: number) => {
		setState('player', 'x', x);
		setState('player', 'y', y);
	},
	setBoundsTo: (bounds: { xMax: number; yMax: number }) => {
		setState('player', 'xMax', bounds.xMax);
		setState('player', 'yMax', bounds.yMax);
	},
	moveFor: (timeElapsed: number) => {
		const SPEED = 200; // px per second
		timeElapsed = timeElapsed / 1000; // convert to seconds from milliseconds
		const distance = SPEED * timeElapsed;
		if (state.player.dx !== 0) {
			setState('player', 'x', (x) =>
				clamp(x + distance * state.player.dx, 0, state.player.xMax)
			);
		}
		if (state.player.dy !== 0) {
			setState('player', 'y', (y) =>
				clamp(y + distance * state.player.dy, 0, state.player.yMax)
			);
		}
	},
	initControls: (controls: PlayerControls) => {
		if (window === undefined || isControlsSet) return;
		const currentKeysPressed = new Set<string>();
		window.onblur = () =>
			currentKeysPressed.forEach((key) => handleKeyUp({ key }));
		const handleKeyDown = (e: KeyboardEvent) => {
			currentKeysPressed.add(e.key);
			// Vertical movement
			if (e.key === controls.up && state.player.dy !== 1) {
				setState('player', 'dy', -1);
			} else if (e.key === controls.down && state.player.dy !== -1) {
				setState('player', 'dy', 1);
			}

			// Horizontal movement
			if (e.key === controls.left && state.player.dx !== 1) {
				setState('player', 'dx', -1);
			} else if (e.key === controls.right && state.player.dx !== -1) {
				setState('player', 'dx', 1);
			}
		};
		const handleKeyUp = (e: Pick<KeyboardEvent, 'key'>) => {
			currentKeysPressed.delete(e.key);
			if (e.key === controls.up && state.player.dy === -1) {
				setState('player', 'dy', 0);
			}
			if (e.key === controls.down && state.player.dy === 1) {
				setState('player', 'dy', 0);
			}
			if (e.key === controls.left && state.player.dx === -1) {
				setState('player', 'dx', 0);
			}
			if (e.key === controls.right && state.player.dx === 1) {
				setState('player', 'dx', 0);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		isControlsSet = true;
	},
};

export const map = {
	get state() {
		return state.map;
	},
	setTo: (name: MapName) => {
		setState('map', 'name', name);
	},
};
