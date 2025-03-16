<script lang="ts">
	import { cn } from '$lib/utils';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { debounce as debounceFunc } from '$lib/utils';

	interface MyProps {
		label?: string;
		id: string;
		debounce?: number;
		onValueChange?: (val: string) => void;
		autoFit?: boolean;
	}

	let {
		class: className,
		debounce = 0,
		value = $bindable(''),
		onValueChange,
		label,
		rows = 1,
		autoFit = false,
		id,
		...restProps
	}: SvelteHTMLElements['textarea'] & MyProps = $props();
	const baseClasses =
		'rounded disabled:cursor-not-allowed disabled:bg-card/50 w-full bg-card focus:outline-hidden outline-hidden focus:ring-2 transition-all ring-primary text-foreground px-3 py-1 text-base font-sans font-normal resize-none border border-border';

	const finalClasses = cn(baseClasses, className);

	let innerValue = $state<string>(value?.toString() || '');

	function resize(node: HTMLTextAreaElement) {
		if (!node || !autoFit) return;
		const setSize = () => {
			node.style.height = 'auto';
			// Get the height of the border
			const heightOffset = 2;
			node.style.height = node.scrollHeight + heightOffset + 'px';
		};

		setSize();
		node.addEventListener('input', setSize);

		return {
			destroy() {
				node.removeEventListener('input', setSize);
			}
		};
	}

	const handleDebounce = (val: string) => {
		value = val;
		if (onValueChange) onValueChange(val);
	};

	$effect(() => {
		innerValue = value?.toString() || '';
	});
</script>

{#snippet Textarea()}
	<textarea
		class={finalClasses}
		use:debounceFunc={{ callback: handleDebounce, delay: debounce }}
		bind:value={innerValue}
		use:resize
		{id}
		{rows}
		name={id}
		{...restProps}
	></textarea>
{/snippet}

{#if label}
	<div class="flex flex-col gap-1">
		<label for={id} class="font-sans text-sm font-medium">{label}</label>
		{@render Textarea()}
	</div>
{:else}
	{@render Textarea()}
{/if}
