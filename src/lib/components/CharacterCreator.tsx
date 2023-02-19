import {
	createSignal,
	createUniqueId,
	createContext,
	useContext,
	onMount,
	createMemo,
	Switch,
	Match,
	createEffect,
	For,
} from 'solid-js';
import { Portal } from 'solid-js/web';
import type { JSX, Signal } from 'solid-js';
import { createStore, SetStoreFunction } from 'solid-js/store';
import LukeSprite from '@/assets/sprites/LukeSprite.svg';
import { themeClass } from '@/styles/theme.css';

import styles from './styles/CharacterCreator.css';

// eslint-disable-next-line
const FormContext = createContext<Signal<string>>(createSignal(''));
function CharacterCreator() {
	const [activeTab, setActiveTab] = createSignal<string>('');
	const [selections, setSelections] = createStore({} as Record<string, string>);

	onMount(() => {
		const firstTab = document.querySelector(`.${styles.tab}`) as HTMLDivElement;
		setActiveTab(firstTab.dataset.name ?? '');
	});

	return (
		<>
			<h1 class="visibly-hidden">Character Creator</h1>
			<section class={[styles.root, themeClass].join(' ')}>
				<div class={styles.characterPreview}>
					<img
						class={styles.characterPreviewImage}
						width="200"
						src={LukeSprite}
					/>
					{
						// TODO: update this block to import the proper image
						//<For each={Object.entries(selections)}>
						//{([name, value]) => (
						//<div style="white-space: nowrap">
						//<p style="color: blue">{name}</p>
						//<p>{value}</p>
						//</div>
						//)}
						//</For>
					}
				</div>
				<div class={styles.characterForm}>
					<menu id="tab-button-list" class={styles.tabButtonList}>
						{/* PORTAL */}
					</menu>
					<FormContext.Provider value={[activeTab, setActiveTab]}>
						<div class={styles.tabWrapper}>
							<FormLayout setSelections={setSelections} />
						</div>
					</FormContext.Provider>
				</div>
			</section>
		</>
	);
}

const SelectionContext = createContext<(name: string, value: string) => void>(
	() => ''
);
function FormLayout(props: {
	setSelections: SetStoreFunction<Record<string, string>>;
}) {
	const setTab = (name: string, value: string) =>
		props.setSelections(name, value);

	return (
		<SelectionContext.Provider value={setTab}>
			<Tab title="Appearance" id="appearance">
				<Feature name="Skin Tone" id="skin-tone" type="select">
					<FeatureOption id="skin-tone-1">1</FeatureOption>
					<FeatureOption id="skin-tone-2">2</FeatureOption>
					<FeatureOption id="skin-tone-3">3</FeatureOption>
					<FeatureOption id="skin-tone-4">4</FeatureOption>
					<FeatureOption id="skin-tone-5">5</FeatureOption>
					<FeatureOption id="skin-tone-6">6</FeatureOption>
					<FeatureOption id="skin-tone-7">7</FeatureOption>
					<FeatureOption id="skin-tone-8">8</FeatureOption>
				</Feature>
				<Feature name="Body Type" id="body-type" type="select">
					<FeatureOption id="chubby">Chubby</FeatureOption>
					<FeatureOption id="chunky">Chunky</FeatureOption>
					<FeatureOption id="skinny">Skinny</FeatureOption>
					<FeatureOption id="buff">Buff</FeatureOption>
				</Feature>
				<Feature name="Mobility Aid" id="mobility-aid" type="select">
					<FeatureOption id="none">None</FeatureOption>
					<FeatureOption id="cane">Cane</FeatureOption>
					<FeatureOption id="wheelchair">Wheelchair</FeatureOption>
				</Feature>
			</Tab>
			<Tab title="Head" id="head">
				<Feature name="Face Shape" id="face-shape" type="select">
					<FeatureOption id="round">Round</FeatureOption>
					<FeatureOption id="tall">Tall</FeatureOption>
					<FeatureOption id="oval">Oval</FeatureOption>
					<FeatureOption id="square">Square</FeatureOption>
				</Feature>
				<Feature name="Hair Texture" id="hair-texture" type="select">
					<FeatureOption id="straight">Straight</FeatureOption>
					<FeatureOption id="wavy">Wavy</FeatureOption>
					<FeatureOption id="curly">Curly</FeatureOption>
					<FeatureOption id="coily">Coily</FeatureOption>
					<FeatureOption id="protective-styles">
						Protective Styles
					</FeatureOption>
				</Feature>
				<Feature name="Hair Length" id="hair-length" type="select">
					<FeatureOption id="short">Short</FeatureOption>
					<FeatureOption id="medium">Medium</FeatureOption>
					<FeatureOption id="long">Long</FeatureOption>
				</Feature>
				<Feature name="Hair Color" id="hair-color" type="select">
					<FeatureOption id="black">Black</FeatureOption>
					<FeatureOption id="dark-brown">Dark Brown</FeatureOption>
					<FeatureOption id="light-brown">Light Brown</FeatureOption>
					<FeatureOption id="blonde">Blonde</FeatureOption>
					<FeatureOption id="red">Red</FeatureOption>
					<FeatureOption id="gray">Gray</FeatureOption>
					<FeatureOption id="pink">Pink</FeatureOption>
					<FeatureOption id="green">Green</FeatureOption>
					<FeatureOption id="blue">Blue</FeatureOption>
					<FeatureOption id="purple">Purple</FeatureOption>
					<FeatureOption id="white">White</FeatureOption>
					<FeatureOption id="red-dyed">Red (dyed)</FeatureOption>
				</Feature>
				<Feature name="Eye Color" id="eye-color" type="select">
					<FeatureOption id="brown">Brown</FeatureOption>
					<FeatureOption id="amber">Amber</FeatureOption>
					<FeatureOption id="gray">Gray</FeatureOption>
					<FeatureOption id="blue">Blue</FeatureOption>
					<FeatureOption id="hazel">Hazel</FeatureOption>
					<FeatureOption id="green">Green</FeatureOption>
				</Feature>
				<Feature name="Facial Hair" id="facial-hair" type="select">
					<FeatureOption id="none">None</FeatureOption>
					<FeatureOption id="mustache">Mustache</FeatureOption>
					<FeatureOption id="short-beard">Short Beard</FeatureOption>
					<FeatureOption id="long-beard">Long Beard</FeatureOption>
				</Feature>
				<Feature name="Eye Color" id="eye-color" type="select">
					<FeatureOption id="brown">Brown</FeatureOption>
					<FeatureOption id="amber">Amber</FeatureOption>
					<FeatureOption id="gray">Gray</FeatureOption>
					<FeatureOption id="blue">Blue</FeatureOption>
					<FeatureOption id="hazel">Hazel</FeatureOption>
					<FeatureOption id="green">Green</FeatureOption>
				</Feature>
			</Tab>
			<Tab title="Details" id="details">
				<Feature name="Name" id="name" type="input" />
			</Tab>
		</SelectionContext.Provider>
	);
}

const TabContext = createContext<{ tabName: () => string }>({
	tabName: () => '',
});
function Tab(props: {
	title: string;
	id: string;
	children: JSX.Element;
}): JSX.Element {
	const [activeTab, setActiveTab] = useContext(FormContext);
	const tabName = () => props.title.toLowerCase().replace(' ', '-');
	const isActive = () => activeTab() === tabName();
	return (
		<div
			class={styles.tab}
			data-name={tabName()}
			classList={{ active: isActive() }}>
			<Portal mount={document.getElementById('tab-button-list')!}>
				<button
					class={styles.tabButton}
					classList={{ [styles.tabButtonActive]: isActive() }}
					onClick={() => {
						return setActiveTab(tabName());
					}}>
					{props.title}
				</button>
			</Portal>
			<fieldset class={styles.tabFieldset} classList={{ active: isActive() }}>
				<legend class="visibly-hidden" onClick={() => setActiveTab(tabName())}>
					{props.title}
				</legend>
				<TabContext.Provider
					value={{
						tabName,
					}}>
					{props.children}
				</TabContext.Provider>
			</fieldset>
		</div>
	);
}

const FeatureContext = createContext<{
	featureName: () => string;
	setValue: (value: string) => void;
	currentValue: () => string;
}>();
function Feature(props: {
	name: string;
	id: string;
	type: 'input';
}): JSX.Element;
function Feature(props: {
	name: string;
	id: string;
	type: 'select';
	children: JSX.Element;
}): JSX.Element;
function Feature(props: {
	name: string;
	id: string;
	type: 'input' | 'select';
	children?: JSX.Element;
}): JSX.Element {
	let featureEl: HTMLFieldSetElement;
	const setSelection = useContext(SelectionContext);
	const { tabName } = useContext(TabContext);
	const featureName = () =>
		`${tabName()}-${props.name.toLowerCase().replace(' ', '-')}`;

	const [currentValue, setValue] = createSignal('');
	const id = createUniqueId();

	const neighbors = () => {
		const options = featureEl.querySelectorAll<HTMLInputElement>(
			`input.${styles.featureOption}`
		);
		const currentIndex = [...options.values()].findIndex(
			(el) => el.value === currentValue()
		);

		const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
		const next = options[nextIndex]?.value ?? currentValue();

		const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
		const prev = options[prevIndex]?.value ?? currentValue();

		return {
			next,
			prev,
		};
	};

	createEffect(() => {
		setSelection(featureName(), currentValue());
	});

	onMount(() => {
		if (props.type === 'select') {
			const currentSelectedEl = (featureEl?.querySelector(
				`${styles.featureOption}:checked`
			) ?? featureEl.querySelector('input[type="radio"]')) as HTMLInputElement;
			setValue(currentSelectedEl?.value);
		}
	});

	return (
		<Switch>
			<Match when={props.type === 'select'}>
				<fieldset class={styles.feature} name={featureName()} ref={featureEl!}>
					<legend>{props.name}</legend>
					<FeatureContext.Provider
						value={{ featureName, setValue, currentValue }}>
						<div class={styles.featureInputWrapper}>
							<button
								class={styles.featureChangeButton}
								onClick={() => setValue(neighbors().prev)}>
								{'<'}
							</button>
							{props.children}
							<button
								class={styles.featureChangeButton}
								onClick={() => setValue(neighbors().next)}>
								{'>'}
							</button>
						</div>
					</FeatureContext.Provider>
				</fieldset>
			</Match>
			<Match when={props.type === 'input'}>
				<fieldset class={styles.feature} name={featureName()}>
					<legend>{props.name}</legend>
					<label class="visibly-hidden" for={id}>
						{props.name}
					</label>
					<input
						id={id}
						class={styles.textInput}
						name={featureName()}
						type="text"
					/>
				</fieldset>
			</Match>
		</Switch>
	);
}

function FeatureOption(props: { id: string; children: string }): JSX.Element {
	const { featureName, setValue, currentValue } =
		useContext(FeatureContext) ?? {};
	const id = createUniqueId();
	const isActive = createMemo(() => currentValue?.() === props.id);

	return (
		<>
			<input
				ref={(el) => (el.checked ? setValue?.(props.id) : null)}
				id={id}
				class={styles.featureOption + ' visibly-hidden'}
				classList={{ active: isActive() }}
				type="radio"
				onInput={(e) =>
					setValue ? setValue((e.target as HTMLInputElement).value) : null
				}
				name={featureName?.() ?? ''}
				value={props.id}
				checked={isActive()}
			/>
			<label
				class={styles.featureOption}
				classList={{ active: isActive() }}
				for={id}>
				{props.children}
			</label>
		</>
	);
}

//function TextInput(props: { name: string }): JSX.Element {
//const { tabName } = useContext(TabContext);
//const featureName = () =>
//`${tabName()}-${props.name.toLowerCase().replace(' ', '-')}`;
//const id = createUniqueId();

//return (
//<fieldset class={styles.feature} name={featureName()}>
//<legend>{props.name}</legend>
//<label class="visibly-hidden" for={id}>
//{props.name}
//</label>
//<input
//id={id}
//class={styles.textInput}
//name={featureName()}
//type="text"
///>
//</fieldset>
//);
//}

export default CharacterCreator;
