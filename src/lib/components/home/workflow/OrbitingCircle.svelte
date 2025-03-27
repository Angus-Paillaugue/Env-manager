<script lang="ts">
	import { cn } from '$lib/utils';
	import type { SvelteHTMLElements } from 'svelte/elements';

	interface MyProps {
		reverse?: boolean;
		duration?: number;
		delay?: number;
		radius?: number;
	}

	let {
		reverse = false,
		duration = 20,
		delay = 0,
		radius = 50,
		children,
		class: className,
		...restProps
	}: MyProps & SvelteHTMLElements['svg'] = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	version="1.1"
	class="pointer-events-none absolute inset-0 h-full w-full"
	{...restProps}
>
	<circle
		class="stroke-black/10 stroke-1 dark:stroke-white/10"
		cx="50%"
		cy="50%"
		r={radius}
		fill="none"
		stroke-dasharray="4 4"
	/>
</svg>
<div
	style:--delay={delay}
	style:--duration={duration}
	style:--radius={radius}
	class={cn(
		'border-border bg-card absolute z-[1] flex h-full w-full transform-gpu animate-[orbit_20s_linear_infinite] items-center justify-center rounded-full border p-1.5 [animation-delay:calc(var(--delay)*1000ms)]',
		{ '[animation-direction:reverse]': reverse },
		className
	)}
>
	{@render children?.()}
</div>

<style>
	@keyframes -global-orbit {
		0% {
			transform: rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg);
		}

		100% {
			transform: rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg);
		}
	}
</style>
