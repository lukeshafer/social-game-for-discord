import { SSTConfig } from "sst";
import { GameStack } from "./stacks/GameStack";

export default {
	config(_input) {
		return {
			name: "discord-game",
			region: "us-east-2",
		};
	},
	stacks(app) {
		app.stack(GameStack);
	},
} satisfies SSTConfig;
