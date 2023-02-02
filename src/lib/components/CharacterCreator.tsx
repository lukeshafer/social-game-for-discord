import { css } from "@acab/ecsstatic";
import type { JSX, ParentProps } from "solid-js";

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
						<FeatureOption id="long" img={placeholder}>
							Long
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
		<section>
			<h2>{props.title}</h2>
			<main>{props.children}</main>
		</section>
	);
}

function Feature(props: { name: string; children: JSX.Element }) {
	return (
		<section>
			<h3>{props.name}</h3>
			<main>{props.children}</main>
		</section>
	);
}

function FeatureOption(props: { img: string; id: string; children: string }) {
	return (
		<div>
			<p>{props.children}</p>
			<img src={props.img} />
		</div>
	);
}

export default CharacterCreator;
