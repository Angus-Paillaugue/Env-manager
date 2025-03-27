<script lang="ts">
	import DotEnv from './dotEnv.svelte';
	import Cli from './cli.svelte';
	import { SECTION_HEIGHT } from '../utils';
	import Button from '$lib/components/Button';
</script>

<section class="text-foreground relative overflow-hidden" style="height: {SECTION_HEIGHT};">
	<div
		class="absolute inset-0 -z-10 bg-[image:radial-gradient(var(--pattern)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed"
		style="--pattern: color-mix(in oklab,var(--color-foreground)15%,transparent);"
	></div>

	<!-- Dot env file example -->
	<DotEnv />

	<!-- CLI Integration card -->
	<Cli />

	<!-- Main text -->
	<div
		class="pointer-events-none absolute top-1/2 left-1/2 flex w-full max-w-screen-xl -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4"
	>
		<p class="text-center text-5xl font-medium text-balance italic">
			Seamless environment variable management, <span class="text-muted">anywhere</span>
		</p>
		<Button href="/auth/sign-up" class="pointer-events-auto px-4 py-2 text-lg">Get started</Button>
	</div>

	<!-- Fade gradient -->
	<div
		class="to-background pointer-events-none absolute right-0 bottom-0 left-0 h-1/2 bg-gradient-to-b from-transparent"
	></div>
</section>
