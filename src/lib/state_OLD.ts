import { createEffect, createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';

import { clamp } from '@/utils';
import { NPCs, maps } from '@/data';
import type { NPC, NPC_Name, GameMap, MapName } from '@/data';
import { TILE_SIZE, PLAYER_WIDTH, PLAYER_HEIGHT } from '@/constants';
import {
	InteractionHandler,
	type InteractionHitBox,
} from '@/objects/interaction-handler';

type Delta = 0 | 1 | -1;

export interface PlayerControls {
	up: string;
	down: string;
	left: string;
	right: string;
	interact: string;
}

const Direction = {
	left: 1,
	up: 2,
	right: 3,
	down: 4,
} as const;
type DirectionEnum = typeof Direction;
type DirectionValue = DirectionEnum[keyof DirectionEnum];

const interactionHandler = new InteractionHandler();

let isControlsSet = false;
let curDir: DirectionValue = Direction.down;
export const [player, updatePlayer] = createStore({
	y: 0,
	x: 0,
	dx: 0 as Delta,
	dy: 0 as Delta,
	xMax: 0,
	yMax: 0,
	movementLocked: false,
	get direction() {
		return playerDirection();
	},
	get position() {
		return playerPosition();
	},
	get movementData() {
		return playerMovementData();
	},
	placeAt: (x: number, y: number) => {
		updatePlayer('x', x);
		updatePlayer('y', y);
	},
	setBoundsTo: (bounds: { xMax: number; yMax: number }) => {
		updatePlayer('xMax', bounds.xMax);
		updatePlayer('yMax', bounds.yMax);
	},
	moveFor: (timeElapsed: number) => {
		if (player.movementLocked) return;
		const SPEED = 200; // px per second
		timeElapsed = timeElapsed / 1000; // convert to seconds from milliseconds
		const distance = SPEED * timeElapsed;
		const diagonalMod = 0.8; // a little more than sqrt 0.5
		// 							sqrt 0.5 feels sluggish
		if (player.dx !== 0) {
			const xDistance = player.dy ? distance * diagonalMod : distance;
			const newX = collision.handle(
				'x',
				clamp(player.x + xDistance * player.dx, 0, player.xMax)
			);
			updatePlayer('x', newX);
		}
		if (player.dy !== 0) {
			const yDistance = player.dx ? distance * diagonalMod : distance;
			const newY = collision.handle(
				'y',
				clamp(player.y + yDistance * player.dy, 0, player.yMax)
			);
			updatePlayer('y', newY);
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
			if (e.key === controls.up && player.dy !== 1) {
				updatePlayer('dy', -1);
			} else if (e.key === controls.down && player.dy !== -1) {
				updatePlayer('dy', 1);
			}

			// Horizontal movement
			if (e.key === controls.left && player.dx !== 1) {
				updatePlayer('dx', -1);
			} else if (e.key === controls.right && player.dx !== -1) {
				updatePlayer('dx', 1);
			}

			if (e.key === controls.interact) {
				let directionData: InteractionHitBox;
				switch (player.direction) {
					case 1:
						directionData = {
							x: player.x - TILE_SIZE,
							y: player.y,
							width: TILE_SIZE,
							height: PLAYER_HEIGHT,
						};
						break;
					case 2:
						directionData = {
							x: player.x,
							y: player.y - TILE_SIZE,
							width: PLAYER_WIDTH,
							height: TILE_SIZE,
						};
						break;
					case 3:
						directionData = {
							x: player.x + PLAYER_WIDTH,
							y: player.y,
							width: TILE_SIZE,
							height: PLAYER_HEIGHT,
						};
						break;
					case 4:
						directionData = {
							x: player.x,
							y: player.y + PLAYER_HEIGHT,
							width: PLAYER_WIDTH,
							height: TILE_SIZE,
						};
				}

				interactionHandler.checkForInteraction(directionData);
			}
		};
		const handleKeyUp = (e: Pick<KeyboardEvent, 'key'>) => {
			currentKeysPressed.delete(e.key);
			if (e.key === controls.up && player.dy === -1) {
				updatePlayer('dy', 0);
			}
			if (e.key === controls.down && player.dy === 1) {
				updatePlayer('dy', 0);
			}
			if (e.key === controls.left && player.dx === -1) {
				updatePlayer('dx', 0);
			}
			if (e.key === controls.right && player.dx === 1) {
				updatePlayer('dx', 0);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		isControlsSet = true;
	},
	setMovementLocked: (locked: boolean) => {
		updatePlayer('movementLocked', locked);
	},
});
const playerPosition = createMemo(() => {
	return { x: player.x, y: player.y } as const;
});
const playerDirection = createMemo(() => {
	const dx = player.dx;
	const dy = player.dy;
	const xDir = (dx + dx * dx * 2) as 0 | 1 | 3;
	const yDir = (dy + dy * dy * 3) as 0 | 2 | 4;

	if (yDir !== curDir && xDir !== curDir) {
		curDir = xDir || yDir || curDir;
	}
	return curDir;
});
const playerMovementData = createMemo(() => {
	return {
		dx: player.dx,
		dy: player.dy,
		xMax: player.xMax,
		yMax: player.yMax,
	};
});
createEffect(() => {
	console.log(player.direction);
});

export const [map, updateMap] = createStore({
	name: undefined as MapName | undefined,
	get info(): GameMap {
		if (!this.name)
			return {
				id: '',
				width: 0,
				height: 0,
				objects: [],
				displayName: '',
				backgroundTile: '',
			};
		return maps[this.name];
	},
	get position(): { x: number; y: number } {
		if (!this.info) return { x: 0, y: 0 };
		const { width, height } = this.info,
			[mapWidth, mapHeight] = [width * TILE_SIZE, height * TILE_SIZE],
			{ height: viewHeight, width: viewWidth } = gameView,
			[minX, minY] = [viewWidth / 2, viewHeight / 2],
			[maxX, maxY] = [mapWidth - minX, mapHeight - minY];
		return {
			x:
				mapWidth > viewWidth
					? -clamp(player.x + PLAYER_WIDTH / 2, minX, maxX)
					: -mapWidth / 2,
			y:
				mapHeight > viewHeight
					? -clamp(player.y + PLAYER_HEIGHT / 2, minY, maxY)
					: -mapHeight / 2,
		};
	},
	setTo: (name: MapName) => {
		updateMap('name', name);
	},
});

export const [gameView, setGameView] = createStore({
	width: 0,
	height: 0,
	setSize: (width: number, height: number) => {
		setGameView('width', width);
		setGameView('height', height);
	},
});

export const [npcs, updateNpcs] = createStore({
	list: [] as NPCState[],
	add: (npc: NPCInitState) => {
		const info = NPCs[npc.key];
		const npcState = { ...npc, info };
		updateNpcs('list', (npcs) => [...npcs, npcState]);

		if (info.messages.length > 0) npcs.registerInteraction(npcState);
	},
	resetTo: (input: NPCInitState[]) => {
		const npcStateArray = input.map((npc) => ({ ...npc, info: NPCs[npc.key] }));
		updateNpcs('list', npcStateArray);
		interactionHandler.reset();
		npcStateArray.forEach((npc) => {
			if (npc.info.messages.length > 0) npcs.registerInteraction(npc);
		});
	},
	registerInteraction(npc: NPCState) {
		let currentIndex = 0;
		interactionHandler.registerInteraction({
			x: npc.x,
			y: npc.y,
			width: npc.info.width * TILE_SIZE,
			height: npc.info.height * TILE_SIZE,
			callback: () => {
				const msg = npc.info.messages[currentIndex];
				if (msg) dialog.open(msg, npc.info.name);
				currentIndex = (currentIndex + 1) % npc.info.messages.length;
			},
		});
	},

	get collisionData() {
		return;
	},
});

type NPCInitState = Omit<NPCState, 'info'>;
interface NPCState {
	info: NPC;
	key: NPC_Name;
	x: number;
	y: number;
}

export type Player = typeof player;

//let isColliding;
const collisionObjects = createMemo<CollisionBounds[]>(() => {
	const npcCollisionData = npcs.list.map((npc) => ({
		x: npc.x,
		y: npc.y,
		width: npc.info.width * TILE_SIZE,
		height: npc.info.height * TILE_SIZE,
	}));
	// ... other collision data
	return [...npcCollisionData];
});
const collision = {
	check: (target: CollisionBounds) =>
		collisionObjects().find((obj) => {
			if (target.x + target.width <= obj.x) return false;
			if (target.x >= obj.x + obj.width) return false;
			if (target.y + target.height <= obj.y) return false;
			if (target.y >= obj.y + obj.height) return false;
			return true;
		}),
	handle: (axis: 'x' | 'y', newPos: number) => {
		const delta = player[`d${axis}`];
		if (delta === 0) return newPos;
		const collisionObject = collision.check({
			x: axis === 'x' ? newPos : player.x,
			y: axis === 'y' ? newPos : player.y,
			height: PLAYER_HEIGHT,
			width: PLAYER_WIDTH,
		});

		if (!collisionObject) return newPos;

		const objSize =
			axis === 'x' ? collisionObject.width : collisionObject.height;
		const playerSize = axis === 'x' ? PLAYER_WIDTH : PLAYER_HEIGHT;
		return delta === 1
			? collisionObject[axis] - playerSize
			: collisionObject[axis] + objSize;
	},
};

interface CollisionBounds {
	x: number;
	y: number;
	width: number;
	height: number;
}

export const [dialog, setDialog] = createStore({
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
});
