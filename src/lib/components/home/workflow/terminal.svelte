<script lang="ts">
	import { onMount } from 'svelte';
	import Deploy from './deploy.svelte';

	let card = $state<HTMLElement | null>(null);
	let triggered = $state(false);

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!triggered && entry.isIntersecting) triggered = true;
				});
			},
			{
				threshold: 0.5
			}
		);

		if (card) observer.observe(card);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	});
</script>

<div
	class="bg-card border-border flex h-[470px] flex-col items-start gap-2 rounded-lg border p-4"
	bind:this={card}
>
	<span class="bg-card-hover text-foreground rounded px-2 py-1 font-mono text-base font-medium">
		03
	</span>
	<p class="text-lg font-medium">Sync & Deploy Anywhere</p>
	<p class="text-muted text-sm">
		Pull your environment variables with a single command and seamlessly integrate them into any
		project, CI/CD pipeline, or local development.
	</p>

	<div class="relative flex w-full grow flex-col overflow-hidden">
		<Deploy startAnimation={triggered} />
	</div>
</div>
