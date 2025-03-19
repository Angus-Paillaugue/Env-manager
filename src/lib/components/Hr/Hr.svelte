<script lang="ts">
	import { cn } from '$lib/utils';
	import type { SvelteHTMLElements } from 'svelte/elements';

	interface MyProps {
		text?: string;
		href?: string;
	}

	type Props = (({ href: string } & SvelteHTMLElements['a']) | SvelteHTMLElements['div']) & MyProps;

	let { text, children, class: className, href, ...restProps }: Props = $props();

	const tagName = href ? 'a' : 'div';
</script>

<svelte:element
	this={tagName}
	{href}
	class={cn('border-border my-4 flex flex-row items-center gap-2', className)}
	{...restProps}
>
	<span class="w-full grow border-t border-inherit"></span>
	{#if text || children}
		<span class="shrink-0 text-base font-medium">
			{#if text}
				{text}
			{:else if children}
				{@render children()}
			{/if}
		</span>
	{/if}
	<span class="w-full grow border-t border-inherit"></span>
</svelte:element>
