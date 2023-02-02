import { css } from "@acab/ecsstatic";
import { createEffect, children, createUniqueId, type JSX, type ParentProps } from "solid-js";
import type { ResolvedJSXElement } from "solid-js/types/reactive/signal";

function CharacterCreator() {
	const placeholder = "https://picsum.photos/100/100";
	return (
		<section>
			<h1>Character Creator</h1>
			<TabGroup>
				<Tab title="head">
					<Feature name="hair">
						<FeatureOption id="short" img={placeholder}>
							Short
						</FeatureOption>
						<FeatureOption id="long" img={placeholder}>
							Long
						</FeatureOption>
					</Feature>
					<Feature name="nose">
						<FeatureOption id="short" img={placeholder}>
							Short
						</FeatureOption>
						<FeatureOption id="long" img={placeholder}>
							Long
						</FeatureOption>
					</Feature>
				</Tab>
				<Tab title="body">
					<Feature name="height">
						<FeatureOption id="short" img={placeholder}>
							Short
						</FeatureOption>
						<FeatureOption id="tall" img={placeholder}>
							Tall
						</FeatureOption>
					</Feature>
				</Tab>
			</TabGroup>
		</section>
	);
}

function TabGroup(props: ParentProps) {
	const style = css`
        background-color: #333;
    `;

	return <section class={"tab-group" + style}>{props.children}</section>;
}

function Tab(props: { title: string; children: JSX.Element }) {
	return (
		<fieldset>
			<legend>{props.title}</legend>
			{props.children}
		</fieldset>
	);
}

function Feature(props: { name: string; children: JSX.Element }) {
	const id = createUniqueId();
	const childElements = children(() => props.children);
	const imageList = () => {
		return childElements
			.toArray()
			.map((child) => {
				if (child instanceof HTMLElement)
					return {
						id: child.id,
						img: child.dataset.img ?? "",
					};
				return null;
			})
			.filter((child) => child instanceof HTMLElement) as {
				id: string;
				img: string;
			}[];
	};
	// TODO: use the imageList to display the image of the currently selected option

	return (
		<>
			<label for={id}>{props.name}</label>
			<select id={id} name={props.name.toLowerCase().replace(" ", "-")}>
				{props.children}
			</select>
		</>
	);
}

function FeatureOption(props: { img: string; id: string; children: string }) {
	return (
		<option data-img={props.img} value={props.id}>
			{props.children}
		</option>
	);
}

export default CharacterCreator;
