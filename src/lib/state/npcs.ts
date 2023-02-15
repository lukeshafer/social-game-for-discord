import { TILE_SIZE } from '@/constants';
import { NPC, NPCs, NPC_Name } from '@/data';
import { dialog } from './ui';
import { createStore } from 'solid-js/store';
import { playerInteractionHandler } from './player';

export const [npcs, updateNpcs] = createStore({
	list: [] as NPCState[],
	add: (npc: NPCInitState) => {
		const info = NPCs[npc.key];
		const npcState = { ...npc, info };
		updateNpcs('list', (npcs) => [...npcs, npcState]);

		if (info.messages.length > 0) npcs.registerInteraction(npcState);
	},
	resetTo: (input: NPCInitState[]) => {
		const npcStateArray = input.map((npc) => ({ ...npc, info: NPCs[npc.key] }));
		updateNpcs('list', npcStateArray);
		playerInteractionHandler.reset();
		npcStateArray.forEach((npc) => {
			if (npc.info.messages.length > 0) npcs.registerInteraction(npc);
		});
	},
	registerInteraction(npc: NPCState) {
		let currentIndex = 0;
		playerInteractionHandler.registerInteraction({
			x: npc.x,
			y: npc.y,
			width: npc.info.width * TILE_SIZE,
			height: npc.info.height * TILE_SIZE,
			callback: () => {
				const msg = npc.info.messages[currentIndex];
				if (msg) dialog.open(msg, npc.info.name);
				currentIndex = (currentIndex + 1) % npc.info.messages.length;
			},
		});
	},

	get collisionData() {
		return;
	},
});

type NPCInitState = Omit<NPCState, 'info'>;
interface NPCState {
	info: NPC;
	key: NPC_Name;
	x: number;
	y: number;
}
