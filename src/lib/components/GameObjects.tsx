import { createEffect, For, onCleanup, onMount, ParentProps } from 'solid-js';
import type { MapName } from '@/data';
import { NPCs, NPC_Name } from '@/data';
import { player, map, npcs, gameView } from '@/state';
import type { PlayerControls } from '@/state';
import { FrameHandler } from '@/objects/frame-handler';
import style from './styles/GameObjects.css';
import { TILE_SIZE, PLAYER_WIDTH, PLAYER_HEIGHT } from '@/constants';

// eslint-disable-next-line prefer-const
let debug = false;

// TODO fix how state resets in new room, can wait until proper rooms exist

export function GameWindow(
	props: ParentProps<{
		sprite: string;
		controls: PlayerControls;
		mapName: MapName;
	}>
) {
	player.placeAt(0, 0);
	createEffect(() => {
		map.setTo(props.mapName);
	});

	const frameHandler = new FrameHandler();
	frameHandler.onFrame((time) => player.moveFor(time));

	let gameWindowElement: HTMLDivElement; // Assigned in JSX ref

	const refreshWindowSize = () => {
		gameView.setSize(
			gameWindowElement.clientWidth,
			gameWindowElement.clientHeight
		);
	};

	npcs.resetTo([{ key: 'TonyOnion', x: 300, y: 300 }]);

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
		player.setBoundsTo({
			xMax: map.info.width * TILE_SIZE - PLAYER_WIDTH,
			yMax: map.info.height * TILE_SIZE - PLAYER_HEIGHT,
		});
	});

	return (
		<div ref={gameWindowElement!} id="game-window" class={style.gameWindow}>
			<div
				class={style.mapWrapper}
				id={map.info.id}
				style={{
					transform: `translate(${map.position.x}px, ${map.position.y}px)`,
					width: `${map.info.width * TILE_SIZE}px`,
					height: `${map.info.height * TILE_SIZE}px`,
					'background-image': `url(${map.info.backgroundTile})`,
					'background-size': `${TILE_SIZE}px ${TILE_SIZE}px`,
				}}>
				<PlayerCharacter spritePath={props.sprite} />
				<For each={npcs.list}>
					{(npc) => <NPC x={npc.x} y={npc.y} name={npc.key} />}
				</For>
				{props.children}
			</div>
		</div>
	);
}

export function PlayerCharacter(props: { spritePath: string }) {
	return (
		<Character
			spritePath={props.spritePath}
			x={player.position.x}
			y={player.position.y}
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
			class={style.character}
			width={props.width}
			height={props.height}
			src={props.spritePath}
			alt=""
			style={{
				transform: `translate(${props.x}px, ${props.y}px)`,
				border: debug ? '1px solid red' : undefined,
			}}
		/>
	);
}
