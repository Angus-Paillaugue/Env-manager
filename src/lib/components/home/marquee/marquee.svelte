<script lang="ts">
	import Icon from './icon.svelte';

	const NB_ROWS = 5;
	const NB_BLOCKS = 12;
	const BLOCK_SIZE = 6;
	const durations = [10, 25, 20, 30, 18];
</script>

<section class="flex flex-col py-12 lg:py-24">
	<div class="relative h-[500px] overflow-hidden">
		<div
			class="pointer-events-none absolute inset-0 flex h-fit flex-col items-center justify-center gap-6 overflow-hidden"
		>
			{#each Array.from({ length: NB_ROWS }) as _, i}
				<!-- Row -->
				<div class="flex w-full gap-6 overflow-hidden">
					<div
						class="marquee-track flex animate-[marquee_linear_infinite_reverse] gap-6"
						style="animation-duration: {durations[i % durations.length] * 2}s"
					>
						{#each Array.from({ length: NB_BLOCKS }) as _}
							<div
								class="grid shrink-0 gap-6"
								style="grid-template-columns: repeat({BLOCK_SIZE}, 1fr);"
							>
								{#each Array.from({ length: BLOCK_SIZE }) as _}
									<Icon />
								{/each}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
		<div
			class="from-background via-background/20 to-background absolute inset-0 bg-gradient-to-b"
		></div>
		<div
			class="bg-foreground/10 border-border absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-6 rounded-lg border p-6 backdrop-blur-xl"
		>
			<h1 class="text-2xl font-bold">Stop wasing time worrying about security</h1>
			<p>Start</p>
		</div>
	</div>
</section>

<style>
	@keyframes -global-marquee {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
</style>
