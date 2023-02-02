import LukeSprite from "@/assets/sprites/LukeSprite.svg";
import { A, Route, Router, Routes } from "@solidjs/router";
import { For } from "solid-js";
import { GameWindow } from "@/components/GameObjects";
import maps, { type MapName } from "@/maps";
import CharacterCreator from "@/components/CharacterCreator";

interface Props {
	ssrRoute: string;
	base: string;
}

export default function AppRouter(props: Props) {
	return (
		<Router base={props.base} url={props.ssrRoute}>
			<main>
				<Routes>
					<For each={Object.entries(maps)}>
						{([mapName, { id: mapId }]) => (
							<Route
								path={mapId}
								element={
									<GameWindow
										controls={{
											up: "e",
											down: "d",
											left: "s",
											right: "f",
										}}
										spritePath={LukeSprite}
										mapName={mapName as MapName}
									/>
								}
							/>
						)}
					</For>
					<Route path="/character-creator" element={<CharacterCreator />} />
				</Routes>
				{
					//<nav
					//style={{
					//position: "absolute",
					//top: 0,
					//left: 0,
					//}}
					//>
					//<For each={Object.entries(maps)}>
					//{([, { displayName, id: mapId }]) => (
					//<A href={`/${mapId}`}>{displayName}</A>
					//)}
					//</For>
					//</nav>
				}
			</main>
		</Router>
	);
}
