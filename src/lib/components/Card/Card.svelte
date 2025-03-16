<script lang="ts">
	import { cn } from '$lib/utils';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = ({ href: string } & SvelteHTMLElements['a']) | SvelteHTMLElements['div'];

	const { children, class: className, ...restProps }: Props = $props();

	let tagName = 'href' in restProps ? 'a' : 'div';
</script>

<svelte:element
	this={tagName}
	class={cn(
		'bg-card border-card text-foreground flex flex-col rounded-lg border p-4',
		tagName === 'a' && 'hover:bg-card-hover cursor-pointer transition-colors',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
