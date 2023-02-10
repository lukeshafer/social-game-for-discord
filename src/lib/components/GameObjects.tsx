import { createEffect, createMemo, onCleanup, onMount, ParentProps } from "solid-js";
import { clamp } from "@/utils";
import { getMap, type MapName } from "@/maps";
import { NPCs, NPC_Name } from "@/data/npcs";
import { initPlayer, Player, type PlayerControls } from "@/objects/player";
import { FrameHandler } from "@/objects/frameHandler";
import style from "./styles/GameObjects.css";
import { TILE_SIZE, PLAYER_WIDTH, PLAYER_HEIGHT } from "@/constants";

// TODO fix how state resets in new room, can wait until proper rooms exist

export function GameWindow(
	props: ParentProps<{
		sprite: string;
		controls: PlayerControls;
		mapName: MapName;
	}>
) {
	const player = initPlayer({ startX: 0, startY: 0 })

	const frameHandler = new FrameHandler();
	frameHandler.onFrame((timeElapsed) => player.move(timeElapsed));

	let gameWindowElement: HTMLDivElement; // Assigned in JSX ref

	onMount(() => {
		player.initControls(props.controls);
		frameHandler.startGameLoop();
	});

	onCleanup(() => {
		frameHandler.stopGameLoop();
	});

	const map = createMemo(() => getMap(props.mapName))

	const mapPosition = () => {
		const mapWidth = map().width * TILE_SIZE;
		const mapHeight = map().height * TILE_SIZE;

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


	createEffect(() => {
		player.setBounds({
			xMax: map().width * TILE_SIZE - PLAYER_WIDTH,
			yMax: map().height * TILE_SIZE - PLAYER_HEIGHT,
		})
	});

	return (
		<div ref={gameWindowElement!} id="game-window" class={style.gameWindow}>
			<div
				class={style.mapWrapper}
				id={map().id}
				style={{
					transform: `translate(${mapPosition().x}px, ${mapPosition().y}px)`,
					width: `${map().width * TILE_SIZE}px`,
					height: `${map().height * TILE_SIZE}px`,
					"background-image": `url(${map().backgroundTile})`,
					"background-size": `${TILE_SIZE}px ${TILE_SIZE}px`,
				}}
			>
				<PlayerCharacter player={player} spritePath={props.sprite} />
				<NPC x={800} y={300} name="TonyOnion" />
				{props.children}
			</div>
		</div>
	);
}

export function PlayerCharacter(props: { spritePath: string; player: Player }) {
	return (
		<Character
			spritePath={props.spritePath}
			x={props.player.position.x}
			y={props.player.position.y}
			width={PLAYER_WIDTH}
			height={PLAYER_HEIGHT} />
	)
}

export function NPC(props: { x: number; y: number; name: NPC_Name }) {
	return (
		<Character
			x={props.x}
			y={props.y}
			spritePath={NPCs[props.name].sprite}
			width={NPCs[props.name].width * TILE_SIZE}
			height={NPCs[props.name].height * TILE_SIZE} />
	)
}

function Character(props: { spritePath: string; x: number; y: number; width: number; height: number }) {
	return (
		<img
			class="character"
			width={props.width}
			height={props.height}
			src={props.spritePath}
			alt=""
			style={{
				transform: `translate(${props.x}px, ${props.y}px)`,
			}}
		/>
	);
}

