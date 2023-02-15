import { PLAYER_HEIGHT, PLAYER_WIDTH, TILE_SIZE } from '@/constants';
import type { GameMap, MapName } from '@/data';
import { maps } from '@/data';
import { player } from './player';
import { gameView } from './ui';
import { clamp } from '@/utils';
import { createStore } from 'solid-js/store';

const [mapStore, updateMap] = createStore({
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

export const [map] = createStore(mapStore);
