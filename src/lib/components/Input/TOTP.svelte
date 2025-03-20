<script lang="ts">
	import { cn } from '$lib/utils';
	import type { SvelteHTMLElements } from 'svelte/elements';

	interface Classes {
		container?: string;
		input?: string;
	}

	interface MyProps {
		amount?: number;
		class?: Classes;
		name?: string;
	}

	let {
		class: className,
		name = 'totp',
		amount = 6,
		...restProps
	}: SvelteHTMLElements['div'] & MyProps = $props();
	let container = $state<HTMLDivElement | null>(null);
	const classes = {
		container: cn('flex flex-row gap-4 items-center justify-between w-full', className?.container),
		input: cn(
			'w-12 h-16 border border-border rounded bg-card focus:bg-card-hover transition-all focus:ring-2 ring-0 ring-primary focus:outline-none text-center text-2xl font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
			className?.input
		)
	};

	const formatInputValue = (value: string) => {
		return value.replace(/[^0-9]/g, '');
	};

	const submitParentForm = () => {
		if (!container) return;
		const form = container.closest('form');
		if (form) {
			form.requestSubmit(); // Submitting the form
		}
	};

	function handleInput(e: Event) {
		if (!container) return;
		const target = e.target as HTMLInputElement;
		// Validate value
		if (/[^0-9]/.test(target.value)) {
			target.value = formatInputValue(target.value);
		}

		// Set the value of the hidden input
		const hiddenInput = container.querySelector('input[type="hidden"]') as HTMLInputElement;
		if (hiddenInput) {
			hiddenInput.value = (
				Array.from(container.querySelectorAll('input[type="text"]')) as HTMLInputElement[]
			)
				.map((input) => input.value)
				.join('');
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (!container) return;
		const target = e.target as HTMLInputElement;

		const inputs = Array.from(
			container.querySelectorAll('input[type="text"]')
		) as HTMLInputElement[];
		const index = inputs.indexOf(target);
		const nextInput = inputs[index + 1];

		// Move focus to the next input if the current input is filled
		if (target.value.length === 1 && nextInput) {
			nextInput.focus();
		}

		// Move focus to the previous input if the current input is empty and Backspace is pressed
		if (target.value.length === 0 && index > 0 && e.key === 'Backspace') {
			const previousInput = inputs[index - 1];
			previousInput.focus();
		}

		// Submit the form if all inputs are filled
		if (index === inputs.length - 1 && target.value.length === 1) {
			target.blur();
			submitParentForm();
		}
	}

	function handlePaste(e: ClipboardEvent) {
		if (!container) return;
		const pastedData = e.clipboardData?.getData('text/plain') || '';
		const inputs = Array.from(
			container.querySelectorAll('input[type="text"]')
		) as HTMLInputElement[];

		// Prevent default paste behavior
		e.preventDefault();

		// Fill the inputs with the pasted data
		for (let i = 0; i < inputs.length; i++) {
			if (i < pastedData.length) {
				inputs[i].value = formatInputValue(pastedData[i]);
				inputs[i].focus();
			} else {
				inputs[i].value = '';
			}
		}

		// Set the value of the hidden input
		const hiddenInput = container.querySelector('input[type="hidden"]') as HTMLInputElement;
		if (hiddenInput) {
			hiddenInput.value = pastedData.slice(0, amount);
		}

		// Submit the form if all inputs are filled
		if (pastedData.length === amount) {
			submitParentForm();
		}
	}
</script>

<div
	class={classes.container}
	bind:this={container}
	style="grid-template-columns: repeat({amount}, minmax(3rem, 1fr));"
	{...restProps}
>
	<input type="hidden" {name} />
	{#each new Array(amount) as _}
		<input
			type="text"
			onpaste={handlePaste}
			maxlength={1}
			class={classes.input}
			min={0}
			max={9}
			required
			oninput={handleInput}
			onkeyup={handleKeyUp}
			onfocus={(e) => {
				(e.target as HTMLInputElement).select();
			}}
		/>
	{/each}
</div>
