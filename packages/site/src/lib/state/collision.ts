import { PLAYER_HEIGHT, PLAYER_WIDTH, TILE_SIZE } from '@/constants';
import { player } from '@/state/player';
import { npcs } from '@/state/npcs';
import { createMemo } from 'solid-js';

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

export const collision = {
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
