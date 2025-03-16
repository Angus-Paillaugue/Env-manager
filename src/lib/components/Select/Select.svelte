<script lang="ts">
	import { cn } from '$lib/utils';
	import type { SvelteHTMLElements } from 'svelte/elements';

	const { class: className, children, ...restProps }: SvelteHTMLElements['select'] = $props();

	const baseClasses =
		'block bg-card text-foreground text-sm font-medium px-2 py-1 rounded font-sans focus:outline-hidden outline-hidden focus:ring-2 transition-all ring-primary';

	const finalClasses = cn(baseClasses, className);
</script>

<select class={finalClasses} {...restProps}>
	{@render children?.()}
</select>
