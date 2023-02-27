import { createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';
import { collision } from './collision';
import { dialog } from './ui';

import { clamp } from '@/utils';
import { TILE_SIZE, PLAYER_WIDTH, PLAYER_HEIGHT } from '@/constants';
import {
	InteractionHandler,
	type InteractionHitBox,
} from '@/objects/interaction-handler';

type Delta = 0 | 1 | -1;

export interface PlayerControls {
	up: string[];
	down: string[];
	left: string[];
	right: string[];
	confirm: string[];
	cancel: string[];
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
export const playerInteractionHandler = interactionHandler;

let isControlsSet = false;
let curDir: DirectionValue = Direction.down;
export const [player, updatePlayer] = createStore({
	y: 0,
	x: 0,
	dx: 0 as Delta,
	dy: 0 as Delta,
	xMax: 0,
	yMax: 0,
	targetX: null as number | null,
	targetY: null as number | null,
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

		if (player.targetX !== null) {
			if (Math.abs(player.targetX - player.x) < distance) {
				updatePlayer('x', player.targetX);
				updatePlayer('targetX', null);
				updatePlayer('dx', 0);
			} else updatePlayer('dx', player.targetX > player.x ? 1 : -1);
		}
		if (player.targetY !== null) {
			if (Math.abs(player.targetY - player.y) < distance) {
				updatePlayer('y', player.targetY);
				updatePlayer('targetY', null);
				updatePlayer('dy', 0);
			} else updatePlayer('dy', player.targetY > player.y ? 1 : -1);
		}

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

			if (
				[
					...controls.up,
					...controls.down,
					...controls.left,
					...controls.right,
				].includes(e.key) &&
				(player.targetX !== null || player.targetY !== null)
			) {
				updatePlayer('targetX', null);
				updatePlayer('targetY', null);
				updatePlayer('dx', 0);
				updatePlayer('dy', 0);
			}

			// Vertical movement
			if (controls.up.includes(e.key) && player.dy !== 1) {
				updatePlayer('dy', -1);
			} else if (controls.down.includes(e.key) && player.dy !== -1) {
				updatePlayer('dy', 1);
			}

			// Horizontal movement
			if (controls.left.includes(e.key) && player.dx !== 1) {
				updatePlayer('dx', -1);
			} else if (controls.right.includes(e.key) && player.dx !== -1) {
				updatePlayer('dx', 1);
			}

			if (controls.confirm.includes(e.key)) {
				if (dialog.isOpen) {
					dialog.close();
					return;
				}
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

			if (controls.cancel.includes(e.key)) {
				dialog.close();
			}
		};
		const handleKeyUp = (e: Pick<KeyboardEvent, 'key'>) => {
			currentKeysPressed.delete(e.key);
			if (controls.up.includes(e.key) && player.dy === -1) {
				updatePlayer('dy', 0);
			}
			if (controls.down.includes(e.key) && player.dy === 1) {
				updatePlayer('dy', 0);
			}
			if (controls.left.includes(e.key) && player.dx === -1) {
				updatePlayer('dx', 0);
			}
			if (controls.right.includes(e.key) && player.dx === 1) {
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
	setTarget: (x: number, y: number) => {
		updatePlayer('targetX', x);
		updatePlayer('targetY', y);
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
