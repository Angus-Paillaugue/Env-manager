<script lang="ts">
	import { Button } from '$lib/components';
	import { FolderOpen, Plus } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { pageHeading } from '$lib/stores';

	let { data }: PageProps = $props();
	const { projects } = data;

	pageHeading.set({
		title: ''
	});
</script>

<section class="flex flex-col gap-4">
	<div class="flex flex-row items-center justify-between">
		<h2 class="text-2xl font-medium">Your projects</h2>
		<Button href="/app/projects/create"><Plus class="size-5" />Create a project</Button>
	</div>
	{#each projects as project}
		<a
			href="/app/projects/{project.id}"
			class="border-border bg-card group hover:bg-card-hover flex flex-row items-center gap-4 rounded border p-4 font-mono text-base font-bold transition-colors"
		>
			<div
				class="border-border text-muted bg-background group-hover:bg-primary group-hover:text-primary-foreground rounded-full border p-1.5 transition-colors"
			>
				<FolderOpen class="size-4" />
			</div>
			{project.name}
		</a>
	{/each}
</section>
