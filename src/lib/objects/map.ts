import { createStore } from "solid-js/store";
import { getMap, type MapName } from "@/maps";
import { clamp } from "@/utils";
import { TILE_SIZE } from "@/constants";

// TODO finish map store 
export function createMap(options: { name: MapName }) {
	const mapData = getMap(options.name);

	const mapPosition = () => {
		const mapWidth = mapData.width * TILE_SIZE;
		const mapHeight = mapData.height * TILE_SIZE;

		const calcOffset = (mapSize: number, windowSize: number, axis: "x" | "y") => {
			if (mapSize > windowSize) {
				const halfWindow = Math.ceil(windowSize / 2 ?? 0);
				return -clamp(
					player.position[axis] + (axis === "x" ? PLAYER_WIDTH / 2 : PLAYER_HEIGHT / 2), // center the player
					halfWindow,
					mapSize - halfWindow
				);
			} else return -mapSize / 2;
		};

		return {
			x: calcOffset(mapWidth, gameWindowElement?.clientWidth, "x"),
			y: calcOffset(mapHeight, gameWindowElement?.clientHeight, "y"),
		};
	}

	const [map, setMap] = createStore({

	})
}
