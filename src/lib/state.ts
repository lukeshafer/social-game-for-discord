import { createStore } from 'solid-js/store';
import { clamp } from '@/utils';
import { getMap, type MapName } from '@/maps';
import type { NPC, NPC_Name } from '@/data';
import { NPCs } from '@/data';
import { TILE_SIZE, PLAYER_WIDTH, PLAYER_HEIGHT } from '@/constants';
import { createMemo } from 'solid-js';

type Delta = 0 | 1 | -1;

export interface PlayerControls {
	up: string;
	down: string;
	left: string;
	right: string;
}

let isControlsSet = false;
export const [player, updatePlayer] = createStore({
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
	placeAt: (x: number, y: number) => {
		updatePlayer('x', x);
		updatePlayer('y', y);
	},
	setBoundsTo: (bounds: { xMax: number; yMax: number }) => {
		updatePlayer('xMax', bounds.xMax);
		updatePlayer('yMax', bounds.yMax);
	},
	moveFor: (timeElapsed: number) => {
		const SPEED = 200; // px per second
		timeElapsed = timeElapsed / 1000; // convert to seconds from milliseconds
		const distance = SPEED * timeElapsed;
		if (player.dx !== 0) {
			const newX = collision.handle(
				'x',
				clamp(player.x + distance * player.dx, 0, player.xMax)
			);
			updatePlayer('x', newX);
		}
		if (player.dy !== 0) {
			const newY = collision.handle(
				'y',
				clamp(player.y + distance * player.dy, 0, player.yMax)
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
});

export const [map, updateMap] = createStore({
	name: undefined as MapName | undefined,
	get info(): ReturnType<typeof getMap> {
		if (!this.name)
			return {
				id: '',
				width: 0,
				height: 0,
				objects: [],
				displayName: '',
				backgroundTile: '',
			};
		return getMap(this.name);
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
		updateNpcs('list', (npcs) => [
			...npcs,
			{
				...npc,
				info,
			},
		]);
	},
	resetTo: (npcs: NPCInitState[]) => {
		updateNpcs(
			'list',
			npcs.map((npc) => ({ ...npc, info: NPCs[npc.key] }))
		);
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
	get objects() {
		return collisionObjects();
	},
	check: (target: CollisionBounds) =>
		collision.objects.find((obj) => {
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
