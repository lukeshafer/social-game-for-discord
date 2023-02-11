import { createStore } from 'solid-js/store';
import type { Player } from './player';
import { clamp } from '@/utils';
import { TILE_SIZE, PLAYER_WIDTH, PLAYER_HEIGHT } from '@/constants';
import type { WindowState } from '@/components/GameObjects';

// TODO finish map store
export function initMap(props: {
	name: MapName;
	player: Player;
	window: WindowState;
}) {
	const [map, setMap] = createStore({
		...maps[props.name],
		get x() {
			const mapWidth = maps[props.name].width * TILE_SIZE;
			if (mapWidth > props.window.width) {
				const half = Math.ceil(props.window.width / 2);
				return -clamp(
					props.player.position.x + PLAYER_WIDTH / 2, // center the player
					half,
					mapWidth - half
				);
			} else return -mapWidth / 2;
		},
		get y() {
			const mapHeight = maps[props.name].height * TILE_SIZE;
			if (mapHeight > props.window.height) {
				const half = Math.ceil(props.window.height / 2);
				return -clamp(
					props.player.position.y + PLAYER_HEIGHT / 2, // center the player
					half,
					mapHeight - half
				);
			} else return -mapHeight / 2;
		},
	});
	return map;
}

import grassTile from '@/assets/sprites/grass-tile.svg';

const maps = {
	testMap: {
		id: 'test-map',
		displayName: 'Test Map',
		backgroundTile: grassTile,
		width: 100,
		height: 100,
		objects: [],
	},
} satisfies Record<string, GameMap>;

export const mapList = Object.keys(maps) as MapName[];
export function getMap(name: MapName) {
	return maps[name];
}

/*** TYPES ***/
/**
 * Data for a map
 * @remarks a map is a location the player can walk around in, like a house or a town
 * - __id__: the id of the map
 * - __displayName__: the name of the map to show in-game
 * - __backgroundTile__: the tile to use for the background
 * - __width__: the width of the map in tiles - not pixels
 * - __height__: the height of the map in tiles
 */
export interface GameMap {
	id: string;
	displayName: string;
	backgroundTile: string;
	width: number;
	height: number;
	objects: GameObject[];
}

interface GameObject {
	x: number;
	y: number;
	direction: Direction;
}

const DIRECTION = {
	NORTH: 1,
	SOUTH: 2,
	WEST: 3,
	EAST: 4,
} as const;

type Direction = keyof typeof DIRECTION;

export type MapName = keyof typeof maps;
