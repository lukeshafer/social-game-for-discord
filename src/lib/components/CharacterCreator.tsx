import { css } from "@acab/ecsstatic";
import {
    createSignal,
    createUniqueId,
    createContext,
    useContext,
    onMount,
    createEffect,
    children,
    Show,
    createMemo,
    Accessor,
} from "solid-js";
import { Portal } from "solid-js/web";
import type { JSX, ParentProps } from "solid-js";

function CharacterCreator() {
    const getPlaceholder = () =>
        `https://picsum.photos/seed/${Math.floor(Math.random() * 10000)}/100/100`;
    return (
        <section>
            <h1>Character Creator</h1>
            <CharacterForm>
                <Tab title="Head">
                    <Feature name="Hair">
                        <FeatureOption id="short" img={getPlaceholder()}>
                            Short
                        </FeatureOption>
                        <FeatureOption id="long" img={getPlaceholder()}>
                            Long
                        </FeatureOption>
                    </Feature>
                    <Feature name="Nose">
                        <FeatureOption id="short" img={getPlaceholder()}>
                            Short
                        </FeatureOption>
                        <FeatureOption id="long" img={getPlaceholder()}>
                            Long
                        </FeatureOption>
                    </Feature>
                </Tab>
                <Tab title="Body">
                    <Feature name="Height">
                        <FeatureOption id="short" img={getPlaceholder()}>
                            Short
                        </FeatureOption>
                        <FeatureOption id="tall" img={getPlaceholder()}>
                            Tall
                        </FeatureOption>
                    </Feature>
                </Tab>
            </CharacterForm>
        </section>
    );
}

interface FormContext {
    activeTab: () => string;
    setActiveTab: (value: string) => void;
}
const FormContext = createContext<FormContext>({
    activeTab: () => "",
    setActiveTab: () => {
        ("");
    },
});
function CharacterForm(props: ParentProps) {
    const [activeTab, setActiveTab] = createSignal<string>("");

    onMount(() => {
        const firstTab = document.querySelector("div.tab[data-name]") as HTMLDivElement;
        setActiveTab(firstTab.dataset.name ?? "");
    });

    return (
        <div class={"character-form" + formStyle}>
            <menu id="tab-button-list">{/* PORTAL */}</menu>
            <FormContext.Provider
                value={{
                    activeTab,
                    setActiveTab,
                }}
            >
                {props.children}
            </FormContext.Provider>
        </div>
    );
}
const formStyle = css`
    --active-bg: var(--green-11);

    /* base styles*/
    background-color: #333;
    padding: 1rem;

    & menu {
        padding-inline: 1rem;
        display: flex;
        gap: 1rem;
    }

    & menu button {
        padding: 0.2rem 0.8rem 0.3rem;
        border-radius: 0.6rem 0.6rem 0 0;

        &.active {
            color: white;
            background-color: var(--active-bg);
        }

        @nest body:not(.js) & {
            display: none;
        }
    }

    /* if JS is enabled */
    @nest body.js & {
    }
`;

interface TabContext {
    tabName: () => string;
}
const TabContext = createContext<TabContext>({ tabName: () => "" });
function Tab(props: { title: string; children: JSX.Element }) {
    const form = useContext(FormContext);
    const tabName = () => props.title.toLowerCase().replace(" ", "-");
    const isActive = () => form.activeTab() === tabName();
    return (
        <div class="tab" data-name={tabName()}>
            <Portal mount={document.getElementById("tab-button-list")!}>
                <button
                    classList={{ active: isActive() }}
                    onClick={() => {
                        //console.log("onclick" + tabName() + form.activeTab());
                        return form.setActiveTab(tabName());
                    }}
                >
                    {props.title}
                </button>
            </Portal>
            <fieldset class={tabStyle} classList={{ active: isActive() }}>
                <legend class="visibly-hidden" onClick={() => form.setActiveTab(tabName())}>
                    {props.title}
                </legend>
                <TabContext.Provider value={{ tabName }}>{props.children}</TabContext.Provider>
            </fieldset>
        </div>
    );
}
const tabStyle = css`
    display: none;
    background-color: var(--active-bg);
    border: none;
    &.active {
        display: block;
    }

    @nest body:not(.js) & {
        display: block;
    }
`;

interface FeatureContext {
    featureName: () => string;
    setValue: (value: string) => void;
    currentValue: () => string;
}
const FeatureContext = createContext<FeatureContext>();
function Feature(props: { name: string; children: JSX.Element }) {
    let featureEl: HTMLFieldSetElement;
    const { tabName } = useContext(TabContext);
    const featureName = () => `${tabName()}-${props.name.toLowerCase().replace(" ", "-")}`;

    const [currentValue, setValue] = createSignal("");

    const neighbors = () => {
        const options = featureEl.querySelectorAll<HTMLInputElement>("input[type='radio']");
        const currentIndex = [...options.values()].findIndex((el) => el.value === currentValue());

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
        setValue(
            (featureEl?.querySelector('input[type="radio"]:checked') as HTMLInputElement)?.value
        );
    });

    return (
        <fieldset name={featureName()} ref={featureEl!}>
            <legend>{props.name}</legend>
            <FeatureContext.Provider value={{ featureName, setValue, currentValue }}>
                <div class={featureStyle}>
                    <button onClick={() => setValue(neighbors().prev)}>{"<"}</button>
                    {props.children}
                    <button onClick={() => setValue(neighbors().next)}>{">"}</button>
                </div>
            </FeatureContext.Provider>
        </fieldset>
    );
}
const featureStyle = css`
    display: flex;
`;

function FeatureOption(props: { img: string; id: string; children: string }) {
    const { featureName, setValue, currentValue } = useContext(FeatureContext) ?? {};
    const id = createUniqueId();
    const isActive = () => currentValue?.() === props.id;

    return (
        <>
            <input
                ref={(el) => (el.checked ? setValue?.(props.id) : null)}
                id={id}
                class={featureOptionsStyle + " visibly-hidden"}
                type="radio"
                classList={{ active: isActive() }}
                onInput={(e) => (setValue ? setValue((e.target as HTMLInputElement).value) : null)}
                data-img={props.img}
                name={featureName?.() ?? ""}
                value={props.id}
                checked={isActive()}
            />
            <label for={id}>
                {props.children}
                <img src={props.img} />
            </label>
        </>
    );
}

const featureOptionsStyle = css`
    &,
    & + * {
        display: none;
    }

    &.active,
    &.active + * {
        display: block;
    }
`;

export default CharacterCreator;
