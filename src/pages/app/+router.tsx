import { Route, Router, Routes } from "@solidjs/router";
import { For } from "solid-js";
import { GameWindow } from "@/components/GameObjects";
import { getMap, mapList } from "@/maps";
import CharacterCreator from "@/components/CharacterCreator";

export default function AppRouter(props: {
	ssrRoute: string;
	base: string;
	sprite: string;
}) {
	return (
		<Router base={props.base} url={props.ssrRoute}>
			<main>
				<Routes>
					<For each={mapList}>
						{(mapName) => (
							<Route
								path={getMap(mapName).id}
								element={
									<GameWindow
										controls={{
											up: "e",
											down: "d",
											left: "s",
											right: "f",
										}}
										sprite={props.sprite}
										mapName={mapName}
									/>
								}
							/>
						)}
					</For>
					<Route path="/character-creator" element={<CharacterCreator />} />
				</Routes>
			</main>
		</Router>
	);
}
