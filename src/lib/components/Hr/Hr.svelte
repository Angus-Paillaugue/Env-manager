<script lang="ts">
	import { localizeHref } from '$lib/translations';
	import { cn } from '$lib/utils';
	import type { SvelteHTMLElements } from 'svelte/elements';

	interface MyProps {
		text?: string;
		href?: string;
	}

	type Props = (({ href: string } & SvelteHTMLElements['a']) | SvelteHTMLElements['div']) & MyProps;

	let { text, children, class: className, ...restProps }: Props = $props();

	const tagName = 'href' in restProps ? 'a' : 'div';
	let href = $state(restProps.href);
	if ('href' in restProps) {
		if (restProps.href) {
			href = localizeHref(restProps.href);
		}
	}
</script>

<svelte:element
	this={tagName}
	class={cn('border-border my-4 flex flex-row items-center', className)}
	{...restProps}
	{...tagName === 'a' ? { href } : {}}
>
	<span class="w-full grow border-t border-inherit"></span>
	{#if text || children}
		<span class="mx-2 shrink-0 text-base font-medium">
			{#if text}
				{text}
			{:else if children}
				{@render children()}
			{/if}
		</span>
	{/if}
	<span class="w-full grow border-t border-inherit"></span>
</svelte:element>
