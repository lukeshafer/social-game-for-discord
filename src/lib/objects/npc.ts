import TonyOnionSprite from '@/assets/sprites/tony-onion.gif';
import { createStore } from 'solid-js/store';

export const [npcList, setNpcs] = createStore<NPCState[]>([]);

export function addNpc(npc: NPCState) {
	setNpcs((npcs) => [...npcs, npc]);
}

interface NPCState {
	npc: NPC;
	x: number;
	y: number;
}

interface NPC {
	name: string;
	width: number;
	height: number;
	sprite: string;
	message: string;
}

const TonyOnion: NPC = {
	name: 'Tony Onion',
	width: 1.5,
	height: 1.5,
	sprite: TonyOnionSprite,
	message: "Get outta here. I'm busy.",
};

export const NPCs = {
	TonyOnion,
} as const satisfies Record<string, NPC>;

export type NPC_Name = keyof typeof NPCs;
