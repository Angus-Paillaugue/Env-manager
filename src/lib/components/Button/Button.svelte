<script lang="ts">
	import { cn } from '$lib/utils';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { fade } from 'svelte/transition';
	import Spinner from '../Spinner';
	import { localizeHref } from '$lib/translations';

	export type Variant = 'primary' | 'secondary' | 'danger';

	interface MyProps {
		loading?: boolean;
		variant?: Variant | Variant[];
		href?: string;
	}

	export type ButtonProps = MyProps &
		(({ href: string } & SvelteHTMLElements['a']) | SvelteHTMLElements['button']);

	const {
		class: className,
		loading = false,
		variant = 'primary',
		children,
		...restProps
	}: ButtonProps = $props();

	const baseClasses =
		'rounded transition-colors flex flex-row gap-2 w-fit items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 cursor-pointer text-medium font-sans font-medium h-fit';

	const variantClasses = new Map<Variant, string>([
		['primary', 'bg-primary text-primary-foreground hover:bg-primary-hover'],
		[
			'secondary',
			'bg-secondary hover:bg-secondary-hover text-secondary-foreground border border-border'
		],
		['danger', 'bg-danger hover:bg-danger-hover text-foreground']
	]);

	const finalClasses = cn(
		baseClasses,
		Array.isArray(variant)
			? variant.map((v) => variantClasses.get(v)).join(' ')
			: variantClasses.get(variant),
		className
	);

	let tagName = 'href' in restProps ? 'a' : 'button';

	let href = $state('href' in restProps ? restProps.href : undefined);
	if ('href' in restProps) {
		if (restProps.href) {
			href = localizeHref(restProps.href);
		}
	}
</script>

<svelte:element
	this={tagName}
	class={finalClasses}
	{...restProps}
	{...tagName === 'a' ? { href } : {}}
>
	{#if loading}
		<span in:fade={{ duration: 200 }}>
			<Spinner class="size-5" />
		</span>
	{/if}

	{@render children?.()}
</svelte:element>
