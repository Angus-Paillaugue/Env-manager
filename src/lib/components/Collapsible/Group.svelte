<script lang="ts">
	import { cn } from '$lib/utils';
	import type { SvelteHTMLElements } from 'svelte/elements';

	let { class: className, children, ...restProps }: SvelteHTMLElements['div'] = $props();
</script>

<div class={cn('collapsible-group flex w-full flex-col', className)} {...restProps}>
	{@render children?.()}
</div>

<style>
	:global(.collapsible-group > .collapsible) {
		@apply border-0 border-t;
	}

	:global(.collapsible-group > .collapsible:last-child) {
		@apply border-0 border-y;
	}
</style>
