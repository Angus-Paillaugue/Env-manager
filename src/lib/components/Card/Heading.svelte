<script lang="ts">
	import { cn } from '$lib/utils';
	import type { SvelteHTMLElements } from 'svelte/elements';

	const { children, class: className }: SvelteHTMLElements['h1'] = $props();
</script>

<h1 class={cn('text-2xl font-bold', className)}>
	{@render children?.()}
</h1>
