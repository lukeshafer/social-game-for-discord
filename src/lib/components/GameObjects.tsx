import { createStore } from "solid-js/store";
import { css } from "@acab/ecsstatic";
import { createEffect, onCleanup, onMount, ParentProps } from "solid-js";
import { clamp } from "@/utils";
import maps, { type MapName } from "@/maps";

const TILE_SIZE = 64;
const PLAYER_WIDTH = TILE_SIZE;
const PLAYER_HEIGHT = TILE_SIZE * 2;

// TODO: fix how state resets in new room, can wait until proper rooms exist

/** Reactive player state */
const [playerPosition, setPlayerState] = createStore({
	x: 0,
	y: 0,
});

/** The current player movement state.
 * @remarks Not a store because it doesn't need to be reactive */
const playerMovementState = {
	dx: 0,
	dy: 0,
	xMax: 0,
	yMax: 0,
};

export function GameWindow(
	props: ParentProps<{
		spritePath: string;
		controls: PlayerControls;
		mapName: MapName;
	}>
) {
	const frameHandler = new FrameHandler();
	frameHandler.onFrame(movePlayer);

	let gameWindowElement: HTMLDivElement; // Assigned in JSX ref

	onMount(() => {
		initControls({ controls: props.controls });
		frameHandler.startGameLoop();
	});

	onCleanup(() => {
		frameHandler.stopGameLoop();
	});

	const state = {
		get map() {
			return maps[props.mapName];
		},
		get mapPosition() {
			return getMapPosition({
				windowWidth: gameWindowElement?.clientWidth,
				windowHeight: gameWindowElement?.clientHeight,
				mapWidth: state.map.width * TILE_SIZE,
				mapHeight: state.map.height * TILE_SIZE,
			});
		},
	};

	createEffect(() => {
		playerMovementState.xMax = state.map.width * TILE_SIZE - PLAYER_WIDTH;
		playerMovementState.yMax = state.map.height * TILE_SIZE - PLAYER_HEIGHT;
	});

	const gameWindowStyles = css`
        width: 100vw;
        height: 100vh;
        position: relative;
        background-color: white;
        overflow: hidden;
    `;

	return (
		<div ref={gameWindowElement!} id="game-window" class={gameWindowStyles}>
			<div
				class={`map-wrapper ${css`
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    background: repeat;
                `}`}
				id={state.map.id}
				style={{
					transform: `translate(${state.mapPosition.x}px, ${state.mapPosition.y}px)`,
					width: `${state.map.width * TILE_SIZE}px`,
					height: `${state.map.height * TILE_SIZE}px`,
					"background-image": `url(${state.map.backgroundTile})`,
					"background-size": `${TILE_SIZE}px ${TILE_SIZE}px`,
				}}
			>
				<PlayerCharacter {...playerPosition} spritePath={props.spritePath} />
				{props.children}
			</div>
		</div>
	);
}

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

type FrameCallback = (elapsed: number) => void;
/**
 * Controls the game loop and frame callbacks
 */
class FrameHandler {
	#callbacks = new Set<FrameCallback>();
	/**
	 * Register a callback to be called every frame
	 * @param callback - A function to be called every frame, with the elapsed time since the last frame
	 */
	onFrame(callback: FrameCallback) {
		this.#callbacks.add(callback);
	}

	/**
	 * Unregister a callback that was previously registered
	 * @param callback - The function to unregister
	 */
	unregister(callback: FrameCallback) {
		this.#callbacks.delete(callback);
	}

	#update(elapsed: number) {
		this.#callbacks.forEach((callback) => callback(elapsed));
	}

	#startTime: number | undefined = undefined;
	#prevTime: number | undefined = undefined;
	#gameStarted = false;
	#gameStopped = false;
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
			if (elapsedSinceLastFrame > 0) {
				this.#update(elapsedSinceLastFrame);
			}
			this.#prevTime = time;

			if (!this.#gameStopped) requestAnimationFrame(frame);
		};
		requestAnimationFrame(frame);
	}

	stopGameLoop() {
		this.#gameStopped = true;
	}
}

function movePlayer(timeElapsed: number) {
	const SPEED = 200; // px per second
	timeElapsed = timeElapsed / 1000; // convert to seconds from milliseconds
	const distance = SPEED * timeElapsed;
	if (playerMovementState.dx !== 0) {
		setPlayerState("x", (x) =>
			clamp(x + distance * playerMovementState.dx, 0, playerMovementState.xMax)
		);
	}
	if (playerMovementState.dy !== 0) {
		setPlayerState("y", (y) =>
			clamp(y + distance * playerMovementState.dy, 0, playerMovementState.yMax)
		);
	}
}

interface PlayerControls {
	up: string;
	down: string;
	left: string;
	right: string;
}

function initControls(args: { controls: PlayerControls }) {
	const currentKeysPressed = new Set<string>();
	window.onblur = () => currentKeysPressed.forEach((key) => handleKeyUp({ key }));
	const handleKeyDown = (e: KeyboardEvent) => {
		currentKeysPressed.add(e.key);
		// Vertical movement
		if (e.key === args.controls.up && playerMovementState.dy !== 1) {
			playerMovementState.dy = -1;
		} else if (e.key === args.controls.down && playerMovementState.dy !== -1) {
			playerMovementState.dy = 1;
		}

		// Horizontal movement
		if (e.key === args.controls.left && playerMovementState.dx !== 1) {
			playerMovementState.dx = -1;
		} else if (e.key === args.controls.right && playerMovementState.dx !== -1) {
			playerMovementState.dx = 1;
		}
	};
	const handleKeyUp = (e: Pick<KeyboardEvent, "key">) => {
		currentKeysPressed.delete(e.key);
		if (e.key === args.controls.up && playerMovementState.dy === -1) {
			playerMovementState.dy = 0;
		}
		if (e.key === args.controls.down && playerMovementState.dy === 1) {
			playerMovementState.dy = 0;
		}
		if (e.key === args.controls.left && playerMovementState.dx === -1) {
			playerMovementState.dx = 0;
		}
		if (e.key === args.controls.right && playerMovementState.dx === 1) {
			playerMovementState.dx = 0;
		}
	};
	window.addEventListener("keydown", handleKeyDown);
	window.addEventListener("keyup", handleKeyUp);
}

function getMapPosition(options: {
	mapWidth: number;
	mapHeight: number;
	windowWidth: number;
	windowHeight: number;
}) {
	const calcOffset = (mapSize: number, windowSize: number, axis: "x" | "y") => {
		if (mapSize > windowSize) {
			const halfWindow = Math.ceil(windowSize / 2 ?? 0);
			return -clamp(
				playerPosition[axis] + (axis === "x" ? PLAYER_WIDTH / 2 : PLAYER_HEIGHT / 2), // center the player
				halfWindow,
				mapSize - halfWindow
			);
		} else return -mapSize / 2;
	};

	return {
		x: calcOffset(options.mapWidth, options.windowWidth, "x"),
		y: calcOffset(options.mapHeight, options.windowHeight, "y"),
	};
}
