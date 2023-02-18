import { Route, Router, Routes } from '@solidjs/router';
import { For } from 'solid-js';
import { GameWindow } from '@/components/GameObjects';
import { maps, mapList } from '@/data';
import CharacterCreator from '@/components/CharacterCreator';

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
								path={maps[mapName].id}
								element={
									<GameWindow
										controls={{
											up: ['e'],
											down: ['d'],
											left: ['s'],
											right: ['f'],
											confirm: ['r', 'Enter'],
											cancel: ['w', 'Escape'],
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
