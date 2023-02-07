import {
	createSignal,
	createUniqueId,
	createContext,
	useContext,
	onMount,
	Signal,
} from 'solid-js';
import { Portal } from 'solid-js/web';
import type { JSX } from 'solid-js';
import LukeSprite from '@/assets/sprites/LukeSprite.svg';
import { themeClass } from '@/styles/theme.css';

import styles from './styles/CharacterCreator.css';

function CharacterCreator() {
	const [activeTab, setActiveTab] = createSignal<string>('');

	onMount(() => {
		const firstTab = document.querySelector(`.${styles.tab}`) as HTMLDivElement;
		setActiveTab(firstTab.dataset.name ?? '');
	});

	const getPlaceholder = () =>
		`https://picsum.photos/seed/${Math.floor(Math.random() * 10000)}/100/100`;
	return (
		<>
			<h1 class="visibly-hidden">Character Creator</h1>
			<section class={[styles.root, themeClass].join(' ')}>
				<div class={styles.characterPreview}>
					<img width="100" src={LukeSprite} />
				</div>
				<div class={styles.characterForm}>
					<menu id="tab-button-list" class={styles.tabButtonList}>
						{/* PORTAL */}
					</menu>
					<FormContext.Provider value={[activeTab, setActiveTab]}>
						<div class={styles.tabWrapper}>
							<Tab title="Appearance">
								<Feature name="Skin Tone">
									<FeatureOption id="skin-tone-1" img={getPlaceholder()}>
										1
									</FeatureOption>
									<FeatureOption id="skin-tone-2" img={getPlaceholder()}>
										2
									</FeatureOption>
									<FeatureOption id="skin-tone-3" img={getPlaceholder()}>
										3
									</FeatureOption>
									<FeatureOption id="skin-tone-4" img={getPlaceholder()}>
										4
									</FeatureOption>
									<FeatureOption id="skin-tone-5" img={getPlaceholder()}>
										5
									</FeatureOption>
									<FeatureOption id="skin-tone-6" img={getPlaceholder()}>
										6
									</FeatureOption>
									<FeatureOption id="skin-tone-7" img={getPlaceholder()}>
										7
									</FeatureOption>
									<FeatureOption id="skin-tone-8" img={getPlaceholder()}>
										8
									</FeatureOption>
								</Feature>
								<Feature name="Body Type">
									<FeatureOption id="chubby" img={getPlaceholder()}>
										Chubby
									</FeatureOption>
									<FeatureOption id="chunky" img={getPlaceholder()}>
										Chunky
									</FeatureOption>
									<FeatureOption id="skinny" img={getPlaceholder()}>
										Skinny
									</FeatureOption>
									<FeatureOption id="buff" img={getPlaceholder()}>
										Buff
									</FeatureOption>
								</Feature>
								<Feature name="Mobility Aid">
									<FeatureOption id="none" img={getPlaceholder()}>
										None
									</FeatureOption>
									<FeatureOption id="cane" img={getPlaceholder()}>
										Cane
									</FeatureOption>
									<FeatureOption id="wheelchair" img={getPlaceholder()}>
										Wheelchair
									</FeatureOption>
								</Feature>
							</Tab>
							<Tab title="Head">
								<Feature name="Face Shape">
									<FeatureOption id="round" img={getPlaceholder()}>
										Round
									</FeatureOption>
									<FeatureOption id="tall" img={getPlaceholder()}>
										Tall
									</FeatureOption>
									<FeatureOption id="oval" img={getPlaceholder()}>
										Oval
									</FeatureOption>
									<FeatureOption id="square" img={getPlaceholder()}>
										Square
									</FeatureOption>
								</Feature>
								<Feature name="Hair Texture">
									<FeatureOption id="straight" img={getPlaceholder()}>
										Straight
									</FeatureOption>
									<FeatureOption id="wavy" img={getPlaceholder()}>
										Wavy
									</FeatureOption>
									<FeatureOption id="curly" img={getPlaceholder()}>
										Curly
									</FeatureOption>
									<FeatureOption id="coily" img={getPlaceholder()}>
										Coily
									</FeatureOption>
									<FeatureOption id="protective-styles" img={getPlaceholder()}>
										Protective Styles
									</FeatureOption>
								</Feature>
								<Feature name="Hair Length">
									<FeatureOption id="straight-short" img={getPlaceholder()}>
										Short
									</FeatureOption>
									<FeatureOption id="straight-medium" img={getPlaceholder()}>
										Medium
									</FeatureOption>
									<FeatureOption id="straight-long" img={getPlaceholder()}>
										Long
									</FeatureOption>
								</Feature>
								<Feature name="Hair Color">
									<FeatureOption id="black" img={getPlaceholder()}>
										Black
									</FeatureOption>
									<FeatureOption id="dark-brown" img={getPlaceholder()}>
										Dark Brown
									</FeatureOption>
									<FeatureOption id="light-brown" img={getPlaceholder()}>
										Light Brown
									</FeatureOption>
									<FeatureOption id="blonde" img={getPlaceholder()}>
										Blonde
									</FeatureOption>
									<FeatureOption id="red" img={getPlaceholder()}>
										Red
									</FeatureOption>
									<FeatureOption id="gray" img={getPlaceholder()}>
										Gray
									</FeatureOption>
									<FeatureOption id="pink" img={getPlaceholder()}>
										Pink
									</FeatureOption>
									<FeatureOption id="green" img={getPlaceholder()}>
										Green
									</FeatureOption>
									<FeatureOption id="blue" img={getPlaceholder()}>
										Blue
									</FeatureOption>
									<FeatureOption id="purple" img={getPlaceholder()}>
										Purple
									</FeatureOption>
									<FeatureOption id="white" img={getPlaceholder()}>
										White
									</FeatureOption>
									<FeatureOption id="red-dyed" img={getPlaceholder()}>
										Red (dyed)
									</FeatureOption>
								</Feature>
								<Feature name="Eye Color">
									<FeatureOption id="brown" img={getPlaceholder()}>
										Brown
									</FeatureOption>
									<FeatureOption id="amber" img={getPlaceholder()}>
										Amber
									</FeatureOption>
									<FeatureOption id="gray" img={getPlaceholder()}>
										Gray
									</FeatureOption>
									<FeatureOption id="blue" img={getPlaceholder()}>
										Blue
									</FeatureOption>
									<FeatureOption id="hazel" img={getPlaceholder()}>
										Hazel
									</FeatureOption>
									<FeatureOption id="green" img={getPlaceholder()}>
										Green
									</FeatureOption>
								</Feature>
								<Feature name="Facial Hair">
									<FeatureOption id="none" img={getPlaceholder()}>
										None
									</FeatureOption>
									<FeatureOption id="mustache" img={getPlaceholder()}>
										Mustache
									</FeatureOption>
									<FeatureOption id="short-beard" img={getPlaceholder()}>
										Short Beard
									</FeatureOption>
									<FeatureOption id="long-beard" img={getPlaceholder()}>
										Long Beard
									</FeatureOption>
								</Feature>
								<Feature name="Eye Color">
									<FeatureOption id="brown" img={getPlaceholder()}>
										Brown
									</FeatureOption>
									<FeatureOption id="amber" img={getPlaceholder()}>
										Amber
									</FeatureOption>
									<FeatureOption id="gray" img={getPlaceholder()}>
										Gray
									</FeatureOption>
									<FeatureOption id="blue" img={getPlaceholder()}>
										Blue
									</FeatureOption>
									<FeatureOption id="hazel" img={getPlaceholder()}>
										Hazel
									</FeatureOption>
									<FeatureOption id="green" img={getPlaceholder()}>
										Green
									</FeatureOption>
								</Feature>
							</Tab>
							<Tab title="Details">
								<Feature name="Height">
									<FeatureOption id="short" img={getPlaceholder()}>
										Short
									</FeatureOption>
									<FeatureOption id="tall" img={getPlaceholder()}>
										Tall
									</FeatureOption>
								</Feature>
							</Tab>
						</div>
					</FormContext.Provider>
				</div>
			</section>
		</>
	);
}

// eslint-disable-next-line
const FormContext = createContext<Signal<string>>(createSignal(''));

const TabContext = createContext<{
	tabName: () => string;
}>({ tabName: () => '' });
function Tab(props: { title: string; children: JSX.Element }): JSX.Element {
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
				<TabContext.Provider value={{ tabName }}>
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
function Feature(props: { name: string; children: JSX.Element }): JSX.Element {
	let featureEl: HTMLFieldSetElement;
	const { tabName } = useContext(TabContext);
	const featureName = () =>
		`${tabName()}-${props.name.toLowerCase().replace(' ', '-')}`;

	const [currentValue, setValue] = createSignal('');

	const neighbors = () => {
		const options = featureEl.querySelectorAll<HTMLInputElement>(
			styles.featureOption
		);
		const currentIndex = [...options.values()].findIndex(
			(el) => el.value === currentValue()
		);

		const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
		const next = options[nextIndex]!.value;

		const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
		const prev = options[prevIndex]!.value;

		return {
			next,
			prev,
		};
	};

	onMount(() => {
		const currentSelectedEl = (featureEl?.querySelector(
			`${styles.featureOption}:checked`
		) ?? featureEl.querySelector('input[type="radio"]')) as HTMLInputElement;
		setValue(currentSelectedEl?.value);
	});

	return (
		<fieldset class={styles.feature} name={featureName()} ref={featureEl!}>
			<legend>{props.name}</legend>
			<FeatureContext.Provider value={{ featureName, setValue, currentValue }}>
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
	);
}

function FeatureOption(props: {
	img: string;
	id: string;
	children: string;
}): JSX.Element {
	const { featureName, setValue, currentValue } =
		useContext(FeatureContext) ?? {};
	const id = createUniqueId();
	const isActive = () => currentValue?.() === props.id;

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
				data-img={props.img}
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

export default CharacterCreator;
