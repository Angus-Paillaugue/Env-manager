<script lang="ts">
	import Hero from './hero.svelte';
	import { pageHeading } from '$lib/stores';
	import { SECTION_HEIGHT } from './layout';

	$pageHeading = {
		title: 'Home',
		description: "Env manager's home page"
	};
</script>

<Hero />

<section class="px-2 py-12 lg:px-10 lg:py-24" style="height: {SECTION_HEIGHT};">
	<div class="mx-auto grid h-full max-w-screen-2xl gap-4 lg:grid-cols-3 lg:grid-rows-2 lg:gap-10">
		<div class="bg-card border-border rounded-lg border lg:col-span-1">Item 1</div>
		<div class="bg-card border-border rounded-lg border lg:col-span-2">Item 2</div>
		<div class="bg-card border-border rounded-lg border lg:col-span-2">Item 3</div>
		<div class="border-border rounded-xl border-2 border-dashed p-4 lg:col-span-1">Item 4</div>
	</div>
</section>

<section class="bg-background" style="height: {SECTION_HEIGHT};"></section>
