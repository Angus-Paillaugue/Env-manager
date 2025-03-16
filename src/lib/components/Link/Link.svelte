<script lang="ts">
	import { cn } from '$lib/utils';
	import type { SvelteHTMLElements } from 'svelte/elements';

	const { class: className, children, ...restProps }: SvelteHTMLElements['a'] = $props();

	const baseClasses = 'text-primary font-medium underline hover:no-underline';

	const finalClasses = cn(baseClasses, className);
</script>

<a class={finalClasses} {...restProps}>
	{@render children?.()}
</a>
