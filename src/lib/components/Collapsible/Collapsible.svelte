<script lang="ts">
	import { cn } from '$lib/utils';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { accordion } from './collapsible';
	import { ChevronDown } from 'lucide-svelte';

	interface MyPros {
		summary: string;
		open?: boolean;
	}

	let {
		class: className,
		summary,
		children,
		open = $bindable(false),
		...restProps
	}: SvelteHTMLElements['div'] & MyPros = $props();
	let collapsible = $state<HTMLDivElement>();

	/**
	 * Sets the tab index for the collapsible component children.
	 */
	function setTabIndex() {
		if (!collapsible) return;
		const details = collapsible.querySelector('.collapsible-details');
		if (!details) return;
		const detailsElements = details.querySelectorAll(
			'a, button, input, select, textarea, pre.shiki'
		);

		detailsElements.forEach((el) => {
			if (open) {
				el.setAttribute('tabindex', el.getAttribute('data-tabindex') ?? '0');
			} else {
				el.setAttribute('data-tabindex', el.getAttribute('tabindex') ?? '0');
				el.setAttribute('tabindex', '-1');
			}
		});
	}

	$effect(setTabIndex);
</script>

<div
	class={cn(
		'collapsible border-border w-full overflow-hidden border-y transition-colors',
		className
	)}
	{...restProps}
	bind:this={collapsible}
>
	<button
		onclick={() => (open = !open)}
		aria-expanded={open}
		name="Toggle collapsible"
		aria-label="Toggle collapsible"
		class="flex w-full cursor-pointer flex-row items-center justify-between px-4 py-2 text-lg font-semibold -outline-offset-2 transition-colors"
	>
		{@html summary}
		<span class="arrow transition-all">
			<ChevronDown class={cn('size-6 transition-transform', open && 'rotate-180')} />
		</span>
	</button>
	<div use:accordion={open}>
		<div class="collapsible-details p-4">
			{@render children?.()}
		</div>
	</div>
</div>

<style>
	/* Removes the margin bottom to the last element of the details of the collapsible to have just a nice padding all around */
	:global(.collapsible-details *:last-child) {
		margin-bottom: 0px;
	}
</style>
