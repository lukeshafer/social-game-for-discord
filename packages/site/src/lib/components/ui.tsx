import { css } from '@acab/ecsstatic';
import { createSignal } from 'solid-js';

export function DialogBox(props: {
	text: string;
	close?: () => void;
	speaker?: string;
}) {
	const [dialog, setDialog] = createSignal<HTMLDivElement>();

	const styles = css`
		width: 100%;
		padding: 1%;
		height: 40%;
		max-height: 30rem;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 100;
		display: flex;
		justify-content: center;

		& p {
			width: 100%;
			max-width: 60rem;
			height: 100%;
			background-color: #000;
			color: #fff;
			font-size: 3rem;
			padding: 3rem;
			position: relative;
		}

		& p .speaker {
			position: absolute;
			top: 0;
			left: 2rem;
			color: #ccc;
		}
	`;

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			closeDialog();
		}
	};

	const closeDialog = () => {
		dialog()?.removeEventListener('keydown', handleKeyDown);
		props.close?.();
	};

	return (
		// TODO: change to modal dialog for semantics
		<div
			class={styles}
			ref={setDialog}
			onKeyDown={handleKeyDown}
			onClick={() => closeDialog()}>
			<p>
				<span class="speaker">{props.speaker}</span>
				{props.text}
			</p>
		</div>
	);
}
