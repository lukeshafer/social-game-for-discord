import TonyOnionSprite from '@/assets/sprites/tony-onion.gif';
import grassTile from '@/assets/sprites/grass-tile.svg';

export const NPCs = {
	TonyOnion: {
		name: 'Tony Onion' as const,
		width: 1.5 as const,
		height: 1.5 as const,
		sprite: TonyOnionSprite,
		messages: ["Get outta here. I'm busy.", 'What did I just say, bud? Scram!'],
	},
} satisfies Record<string, NPC>;

export const maps = {
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

/*** TYPES ***/
export interface NPC {
	name: string;
	width: number;
	height: number;
	sprite: string;
	messages: string[];
}

export type NPC_Name = keyof typeof NPCs;

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
