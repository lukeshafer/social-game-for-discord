import { createEffect, onCleanup, onMount, ParentProps } from 'solid-js';
import type { MapName } from '@/maps';
import { NPCs, NPC_Name } from '@/data/npcs';
import { initPlayer, Player, type PlayerControls } from '@/objects/player';
import { initMap } from '@/objects/map';
import { FrameHandler } from '@/objects/frameHandler';
import style from './styles/GameObjects.css';
import { TILE_SIZE, PLAYER_WIDTH, PLAYER_HEIGHT } from '@/constants';
import { createStore, type Store } from 'solid-js/store';

// TODO fix how state resets in new room, can wait until proper rooms exist
export type WindowState = Store<{
	width: number;
	height: number;
}>;

export function GameWindow(
	props: ParentProps<{
		sprite: string;
		controls: PlayerControls;
		mapName: MapName;
	}>
) {
	const [windowSize, setWindowSize] = createStore<WindowState>({
		width: 0,
		height: 0,
	});
	const player = initPlayer({ startX: 0, startY: 0 });
	const map = initMap({
		player: player,
		name: props.mapName,
		get window() {
			return windowSize;
		},
	});

	const frameHandler = new FrameHandler();
	frameHandler.onFrame((timeElapsed) => player.move(timeElapsed));

	let gameWindowElement: HTMLDivElement; // Assigned in JSX ref

	const refreshWindowSize = () => {
		setWindowSize({
			width: gameWindowElement.clientWidth,
			height: gameWindowElement.clientHeight,
		});
		console.log(windowSize);
	};

	onMount(() => {
		player.initControls(props.controls);
		frameHandler.startGameLoop();
		refreshWindowSize();

		window.addEventListener('resize', refreshWindowSize);
	});

	onCleanup(() => {
		frameHandler.stopGameLoop();
	});

	createEffect(() => {
		player.setBounds({
			xMax: map.width * TILE_SIZE - PLAYER_WIDTH,
			yMax: map.height * TILE_SIZE - PLAYER_HEIGHT,
		});
	});

	return (
		<div ref={gameWindowElement!} id="game-window" class={style.gameWindow}>
			<div
				class={style.mapWrapper}
				id={map.id}
				style={{
					transform: `translate(${map.x}px, ${map.y}px)`,
					width: `${map.width * TILE_SIZE}px`,
					height: `${map.height * TILE_SIZE}px`,
					'background-image': `url(${map.backgroundTile})`,
					'background-size': `${TILE_SIZE}px ${TILE_SIZE}px`,
				}}>
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
			height={PLAYER_HEIGHT}
		/>
	);
}

export function NPC(props: { x: number; y: number; name: NPC_Name }) {
	return (
		<Character
			x={props.x}
			y={props.y}
			spritePath={NPCs[props.name].sprite}
			width={NPCs[props.name].width * TILE_SIZE}
			height={NPCs[props.name].height * TILE_SIZE}
		/>
	);
}

function Character(props: {
	spritePath: string;
	x: number;
	y: number;
	width: number;
	height: number;
}) {
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
