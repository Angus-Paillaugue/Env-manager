<script lang="ts">
	import { cn } from '$lib/utils';
	import { Eye, EyeClosed } from 'lucide-svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { scale } from 'svelte/transition';

	interface MyProps {
		label: string;
		id: string;
	}

	let {
		class: className,
		label,
		type = 'text',
		id,
		placeholder = ' ',
		value = $bindable(''),
		...restProps
	}: SvelteHTMLElements['input'] & MyProps = $props();

	let innerType = $state(type); // Used to toggle password visibility
	const classes = {
		label:
			'absolute text-sm text-muted duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:text-primary peer-focus:scale-75 peer-focus:-translate-y-3 ltr:peer-focus:translate-x-1 ltr:translate-x-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto',
		input: cn(
			'block rounded px-3 pb-2 pt-5 w-full bg-card border border-border appearance-none text-foreground peer transition-colors text-base font-sans font-normal focus:outline-hidden focus:ring-0 focus:ring-2 ring-primary transition-all',
			className
		),
		container: 'relative',
		toggleVisibility: {
			button:
				'absolute top-1/2 -translate-y-1/2 right-2.5 rtl:left-2.5 rtl:right-auto size-9 text-muted p-2 rounded hover:bg-card-hover transition-colors cursor-pointer'
		}
	};

	function concatenateClasses(obj: Record<string, any> | string, prefix = ''): string {
		let result = '';

		if (typeof obj === 'string') return obj;

		for (const key in obj) {
			if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
				result += ' ' + concatenateClasses(obj[key], prefix + key);
			} else {
				result +=
					' ' +
					obj[key]
						.split(' ')
						.map((c: string) => prefix + key + c)
						.join(' ');
			}
		}

		return cn(result);
	}

	// Function to toggle password visibility
	function toggleType() {
		innerType = innerType === 'password' ? 'text' : 'password';
	}
</script>

<div class={concatenateClasses(classes.container)}>
	<input
		class={cn(concatenateClasses(classes.input), type === 'password' && 'pr-14 pl-2.5')}
		{id}
		{placeholder}
		type={innerType}
		name={id}
		bind:value
		{...restProps}
	/>
	<label for={id} class={concatenateClasses(classes.label)}>{label}</label>
	{#if type === 'password'}
		<button
			type="button"
			onclick={toggleType}
			class={concatenateClasses(classes.toggleVisibility.button)}
			aria-label="Toggle password field visibility"
		>
			{#if innerType === 'password'}
				<span in:scale>
					<Eye class="size-full" />
				</span>
			{:else}
				<span in:scale>
					<EyeClosed class="size-full" />
				</span>
			{/if}
		</button>
	{/if}
</div>
