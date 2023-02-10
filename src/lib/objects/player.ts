import { createStore } from "solid-js/store";
import { clamp } from "@/utils";

type Delta = 0 | 1 | -1;

export interface PlayerControls {
	up: string;
	down: string;
	left: string;
	right: string;
}

export function initPlayer(options: { startX: number, startY: number }) {
	const [state, setState] = createStore({
		x: options.startX,
		y: options.startY,
		dx: 0 as Delta,
		dy: 0 as Delta,
		xMax: 0,
		yMax: 0,
		get position() {
			return { x: state.x, y: state.y };
		},
		get movementData() {
			return {
				dx: state.dx,
				dy: state.dy,
				xMax: state.xMax,
				yMax: state.yMax,
			} as const
		},
		setBounds: (bounds: { xMax: number, yMax: number }) => {
			setState("xMax", bounds.xMax);
			setState("yMax", bounds.yMax);
		},
		move: (timeElapsed: number) => {
			const SPEED = 200; // px per second
			timeElapsed = timeElapsed / 1000; // convert to seconds from milliseconds
			const distance = SPEED * timeElapsed;
			if (state.dx !== 0) {
				setState("x", (x) => clamp(x + distance * state.dx, 0, state.xMax));
			}
			if (state.dy !== 0) {
				setState("y", (y) => clamp(y + distance * state.dy, 0, state.yMax));
			}
		},
		initControls: (controls: PlayerControls) => {
			if (window === undefined || isControlsSet) return
			const currentKeysPressed = new Set<string>();
			window.onblur = () => currentKeysPressed.forEach((key) => handleKeyUp({ key }));
			const handleKeyDown = (e: KeyboardEvent) => {
				currentKeysPressed.add(e.key);
				// Vertical movement
				if (e.key === controls.up && state.dy !== 1) {
					setState("dy", -1)
				} else if (e.key === controls.down && state.dy !== -1) {
					setState("dy", 1)
				}

				// Horizontal movement
				if (e.key === controls.left && state.dx !== 1) {
					setState("dx", -1)
				} else if (e.key === controls.right && state.dx !== -1) {
					setState("dx", 1)
				}
			};
			const handleKeyUp = (e: Pick<KeyboardEvent, "key">) => {
				currentKeysPressed.delete(e.key);
				if (e.key === controls.up && state.dy === -1) {
					setState("dy", 0)
				}
				if (e.key === controls.down && state.dy === 1) {
					setState("dy", 0)
				}
				if (e.key === controls.left && state.dx === -1) {
					setState("dx", 0)
				}
				if (e.key === controls.right && state.dx === 1) {
					setState("dx", 0)
				}
			};
			window.addEventListener("keydown", handleKeyDown);
			window.addEventListener("keyup", handleKeyUp);
			isControlsSet = true;
		}
	});

	let isControlsSet = false;
	return state;
}

export type Player = ReturnType<typeof initPlayer>;
