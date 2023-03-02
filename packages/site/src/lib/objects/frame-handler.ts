type FrameCallback = (elapsed: number) => void;
/**
 * Controls the game loop and frame callbacks
 */
export class FrameHandler {
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
			throw new Error('Game loop already started');
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
