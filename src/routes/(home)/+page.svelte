<script lang="ts">
	import Hero from '$lib/components/home/hero/hero.svelte';
	import { pageHeading } from '$lib/stores';
	import { SECTION_HEIGHT } from '$lib/components/home/utils';
	import Workflow from '$lib/components/home/workflow/workflow.svelte';

	$pageHeading = {
		title: 'Home',
		description: "Env manager's home page"
	};
</script>

<Hero />

<section class="px-2 py-12 lg:px-10 lg:py-24" style="height: {SECTION_HEIGHT};">
	<div class="mx-auto grid h-full max-w-screen-2xl gap-4 lg:grid-cols-3 lg:grid-rows-2 lg:gap-10">
		<div
			class="bg-card border-border flex flex-col justify-between gap-2 rounded-lg border lg:col-span-1"
		>
			<p class="m-4 text-center text-2xl font-bold">CLI</p>
			<div
				class="border-border flex w-full flex-col items-center justify-center border-t p-4 text-center"
			>
				<p class="text-muted text-base">
					With the CLI you can manage your project environments and variables.
				</p>
			</div>
		</div>
		<div
			class="bg-card border-border flex flex-col justify-between gap-2 rounded-lg border lg:col-span-2"
		>
			<p class="m-4 text-center text-2xl font-bold">Sharing</p>
			<div
				class="border-border flex w-full flex-col items-center justify-center border-t p-4 text-center"
			>
				<p class="text-muted text-base">
					Manage access to your project within your company. Add and remove member's access
				</p>
			</div>
		</div>
		<div
			class="bg-card border-border flex flex-col items-center justify-between gap-2 rounded-lg border p-4 lg:col-span-2"
		>
			Item 3
		</div>
		<div class="border-border rounded-xl border-2 border-dashed p-4 lg:col-span-1">Item 4</div>
	</div>
</section>

<Workflow />
