// TODO: maybe link this and the collision detector? they use a lot of similar logic
// caveats:
// 	- some items will be interactive but won't have collision
// 	- vice versa, some items will have collision but not be interactive

export class InteractionHandler {
	#interactions: Interaction[];
	constructor() {
		this.#interactions = [];
	}

	checkForInteraction(target: InteractionHitBox) {
		const interaction = this.#check(target);
		if (!interaction) return;

		interaction.callback();
	}

	#check(target: InteractionHitBox) {
		return this.#interactions.find((obj) => {
			if (target.x + target.width <= obj.x) return false;
			if (target.x >= obj.x + obj.width) return false;
			if (target.y + target.height <= obj.y) return false;
			if (target.y >= obj.y + obj.height) return false;
			return true;
		});
	}

	registerInteraction(interaction: Interaction) {
		this.#interactions.push(interaction);
	}

	reset() {
		this.#interactions = [];
	}
}

export interface InteractionHitBox {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface Interaction {
	x: number;
	y: number;
	width: number;
	height: number;
	callback: () => void;
}
