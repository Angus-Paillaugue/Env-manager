<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let { children, class: className, ...props }: SvelteHTMLElements['div'] = $props();
</script>

<div class={cn('item-center mt-4 flex w-full flex-row justify-end gap-4', className)} {...props}>
	{@render children?.()}
</div>
