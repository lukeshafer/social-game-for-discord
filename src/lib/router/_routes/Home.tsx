import LukeSprite from "@/assets/sprites/LukeSprite.svg";
import { GameWindow } from "@/components/GameObjects";

export default function Home() {
	return (
		<GameWindow
			controls={{
				up: "e",
				down: "d",
				left: "s",
				right: "f",
			}}
			spritePath={LukeSprite}
			mapName="testMap"
		/>
	);
}
