import { createStore } from "solid-js/store";
import { css } from "@acab/ecsstatic";
import { onMount, ParentProps } from "solid-js";
import { clamp } from "@/utils";

const PLAYER_WIDTH = 64;
const PLAYER_HEIGHT = 128;

const MAP_WIDTH = 1555;
const MAP_HEIGHT = 1000;

function PlayerCharacter(props: { spritePath: string; x: number; y: number }) {
	return <Character spritePath={props.spritePath} x={props.x} y={props.y} />;
}

function Character(props: { spritePath: string; x: number; y: number }) {
	return (
		<img
			class="character"
			width={PLAYER_WIDTH}
			height={PLAYER_HEIGHT}
			src={props.spritePath}
			alt=""
			style={{
				transform: `translate(${props.x}px, ${props.y}px)`,
			}}
		/>
	);
}

function Map(
	props: ParentProps<{
		width: number;
		height: number;
		playerState: PlayerPosition;
		window: HTMLDivElement;
	}>
) {
	const xOffset = () =>
		props.width > props.window?.offsetWidth
			? -clamp(
				props.playerState.x + PLAYER_WIDTH / 2, // Center the player
				props.window?.offsetWidth / 2 ?? 0,
				props.width - props.window?.offsetWidth / 2 ?? 0
			)
			: -props.width / 2;
	const yOffset = () =>
		props.height > props.window?.offsetHeight
			? -clamp(
				props.playerState.y + PLAYER_HEIGHT / 2, // Center the player
				props.window?.offsetHeight / 2 ?? 0,
				props.height - props.window?.offsetHeight / 2 ?? 0
			)
			: -props.height / 2;

	return (
		<div
			id="game-map"
			class={css`
                position: absolute;
                top: 50%;
                left: 50%;
                background-image: url("https://picsum.photos/2000/2000");
                background-size: cover;
            `}
			style={{
				width: `${props.width}px`,
				height: `${props.height}px`,
				transform: `translate(${xOffset()}px, ${yOffset()}px)`,
			}}
		>
			{props.children}
		</div>
	);
}

interface PlayerPosition {
	x: number;
	y: number;
}

interface PlayerMovementState {
	dx: -1 | 0 | 1;
	dy: -1 | 0 | 1;
}

export function GameWindow(
	props: ParentProps<{
		spritePath: string;
		controls: PlayerControls;
	}>
) {
	const [playerState, setPlayerState] = createStore<PlayerPosition>({
		x: 0,
		y: 0,
	});

	const movementState: PlayerMovementState = {
		dx: 0,
		dy: 0,
	};

	const gameState = new GameState();
	gameState.register((elapsed) => {
		const SPEED = 200; // px per second
		elapsed = elapsed / 1000; // convert to seconds from milliseconds
		const distance = SPEED * elapsed;
		if (movementState.dx !== 0) {
			setPlayerState("x", (x) =>
				clamp(x + distance * movementState.dx, 0, MAP_WIDTH - PLAYER_WIDTH)
			);
		}
		if (movementState.dy !== 0) {
			setPlayerState("y", (y) =>
				clamp(y + distance * movementState.dy, 0, MAP_HEIGHT - PLAYER_HEIGHT)
			);
		}
	});

	let gameWindowElement: HTMLDivElement;

	onMount(() => {
		initControls({ controls: props.controls, movementState });
		gameState.startGameLoop();
	});

	return (
		<div
			ref={gameWindowElement}
			id="game-window"
			class={css`
                width: 100vw;
                height: 100vh;
                position: relative;
                background-color: white;
                overflow: hidden;
            `}
		>
			<Map
				width={MAP_WIDTH}
				height={MAP_HEIGHT}
				playerState={playerState}
				window={gameWindowElement}
			>
				<PlayerCharacter {...playerState} spritePath={props.spritePath} />
				{props.children}
			</Map>
		</div>
	);
}

interface PlayerControls {
	up: string;
	down: string;
	left: string;
	right: string;
}

type GameStateCallback = (elapsed: number) => void;
class GameState {
	#callbacks = new Set<GameStateCallback>();

	/**
	 * Register a callback to be called every frame
	 * @param callback - A function to be called every frame, with the elapsed time since the last frame
	 */
	register(callback: GameStateCallback) {
		this.#callbacks.add(callback);
	}

	/**
	 * Unregister a callback that was previously registered
	 * @param callback - The function to unregister
	 */
	unregister(callback: GameStateCallback) {
		this.#callbacks.delete(callback);
	}

	#update(elapsed: number) {
		this.#callbacks.forEach((callback) => callback(elapsed));
	}

	#startTime: number | undefined = undefined;
	#prevTime: number | undefined = undefined;
	#gameStarted = false;
	/**
	 * Start the game loop - only call this once, after all components have been mounted
	 */
	startGameLoop() {
		if (this.#gameStarted) {
			throw new Error("Game loop already started");
		}
		this.#gameStarted = true;
		const frame = (time: number) => {
			if (this.#startTime === undefined) this.#startTime = time;
			if (this.#prevTime === undefined) this.#prevTime = time;

			const elapsedSinceLastFrame = time - this.#prevTime;
			if (elapsedSinceLastFrame > 10) {
				this.#update(elapsedSinceLastFrame);
			}
			this.#prevTime = time;
			requestAnimationFrame(frame);
		};
		requestAnimationFrame(frame);
	}
}

function initControls(args: { controls: PlayerControls; movementState: PlayerMovementState }) {
	const handleKeyDown = (e: KeyboardEvent) => {
		// Vertical movement
		if (e.key === args.controls.up && args.movementState.dy !== 1) {
			args.movementState.dy = -1;
		} else if (e.key === args.controls.down && args.movementState.dy !== -1) {
			args.movementState.dy = 1;
		}

		// Horizontal movement
		if (e.key === args.controls.left && args.movementState.dx !== 1) {
			args.movementState.dx = -1;
		} else if (e.key === args.controls.right && args.movementState.dx !== -1) {
			args.movementState.dx = 1;
		}
	};
	const handleKeyUp = (e: KeyboardEvent) => {
		if (e.key === args.controls.up && args.movementState.dy === -1) {
			args.movementState.dy = 0;
		}
		if (e.key === args.controls.down && args.movementState.dy === 1) {
			args.movementState.dy = 0;
		}
		if (e.key === args.controls.left && args.movementState.dx === -1) {
			args.movementState.dx = 0;
		}
		if (e.key === args.controls.right && args.movementState.dx === 1) {
			args.movementState.dx = 0;
		}
	};
	window.addEventListener("keydown", handleKeyDown);
	window.addEventListener("keyup", handleKeyUp);
}
