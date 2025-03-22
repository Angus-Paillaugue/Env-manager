<script lang="ts">
	import { SECTION_HEIGHT } from './layout';

	const egEnvFile = [
		{
			key: 'JWT_SECRET',
			value: '8ycCoXZzJ9R6YoMqv3xGkgOjkRl'
		},
		{
			key: 'API_KEY',
			value: '0;*4"!llsMFX@z~4.__x%oj>F'
		},
		{
			key: 'POSTGRES_PASSWORD',
			value: '7Dmap6ZRn+bhWPwjvLzw'
		}
	];
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section class="text-foreground relative overflow-hidden" style="height: {SECTION_HEIGHT};">
	<div
		class="absolute inset-0 -z-10 bg-[image:radial-gradient(var(--pattern)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed"
		style="--pattern: color-mix(in oklab,var(--color-foreground)15%,transparent);"
	></div>

	<!-- Dot env file example -->
	<div
		class="border-border bg-card hover:bg-card-hover group absolute top-1/6 -right-10 z-0 w-[450px] -rotate-12 cursor-pointer rounded-lg rounded-tl-none border transition-all duration-300 hover:-right-2 hover:scale-105 hover:rotate-[-17deg]"
	>
		<div class="relative flex flex-col p-6">
			<!-- File name -->
			<div
				class="bg-card group-hover:bg-card-hover border-border absolute bottom-full left-0 -mt-px -ml-px rounded-t border border-b-0 px-4 py-1.5 transition-all duration-300"
			>
				<span class="text-muted text-lg font-medium">.env.dev</span>
			</div>
			<!-- File contents -->
			<div class="file-contents flex flex-col font-mono text-lg font-medium select-none">
				{#each egEnvFile as env}
					<div class="flex h-8 flex-row flex-nowrap items-center">
						<span class="token key">{env.key}</span>
						<span class="token operator">=</span>
						<div class="relative h-full w-full">
							<div
								class="absolute top-1/2 left-0 ml-1 flex -translate-y-1/2 flex-row gap-1 transition-all duration-300 group-hover:opacity-0"
							>
								{#each new Array(env.value.length) as _}
									<span class="bg-muted size-[6.5px] rounded-full"></span>
								{/each}
							</div>
							<span
								class="token string absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap opacity-0 transition-all duration-300 group-hover:opacity-100"
							>
								{env.value}
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- CLI Integration card -->
	<div
		class="border-border bg-card hover:bg-card-hover group absolute bottom-1/3 left-1 z-0 flex h-[300px] w-[400px] rotate-5 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border transition-all duration-300 hover:left-10 hover:scale-110 hover:rotate-10"
	>
		<h2 class="text-2xl font-medium">CLI Integration</h2>
		<!-- svelte-ignore a11y_missing_attribute -->
		<img src="/terminal.webp" class="mx-auto w-1/2" />
	</div>

	<!-- Main text -->
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
		<div class="flex h-full w-full max-w-screen-xl flex-col items-center justify-center">
			<p class="text-xl font-medium italic">Seamless environment variable management, anywhere.</p>
		</div>
	</div>

	<!-- Fade gradient -->
	<div
		class="to-background pointer-events-none absolute right-0 bottom-0 left-0 h-1/2 bg-gradient-to-b from-transparent"
	></div>
</section>

<style>
	.file-contents .token.key {
		color: #f69d50;
	}
	.file-contents .token.string {
		color: #6cb6ff;
	}
	.file-contents .token.operator {
		color: #adbac7;
	}
</style>
