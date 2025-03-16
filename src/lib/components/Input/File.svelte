<script lang="ts">
	import { cn } from '$lib/utils';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { FileLock2 } from 'lucide-svelte';

	interface MyProps {
		label?: string;
		id: string;
		files?: FileList;
	}

	let {
		class: className,
		files = $bindable(undefined),
		label,
		id,
		placeholder,
		...restProps
	}: SvelteHTMLElements['input'] & MyProps = $props();
	const baseClasses =
		'rounded disabled:cursor-not-allowed disabled:bg-card/50 w-full bg-card hover:bg-card-hover cursor-pointer border border-border placeholder-muted focus:outline-hidden outline-hidden focus:ring-2 transition-all ring-primary text-muted px-3 py-1 text-base font-sans font-medium flex flex-row gap-2 items-center';

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const fileList = input.files;
		files = fileList || undefined;
	}
</script>

{#snippet input()}
	<label class={cn(baseClasses, className)} for={id}>
		<input class="hidden" onchange={handleFileChange} {id} name={id} {...restProps} type="file" />
		<FileLock2 class="size-4" />
		{placeholder}
	</label>
{/snippet}

{#if label}
	<div class="flex flex-col gap-1">
		<label for={id} class="font-sans text-sm font-medium">{label}</label>
		{@render input()}
	</div>
{:else}
	{@render input()}
{/if}
