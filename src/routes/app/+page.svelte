<script lang="ts">
	import { Alert, Button, Card } from '$lib/components';
	import { FolderOpen, Plus } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { pageHeading } from '$lib/stores';

	let { data }: PageProps = $props();
	const { projects } = data;

	pageHeading.set({
		title: 'Projects',
		description: 'Manage your projects and tasks.'
	});
</script>

<section class="flex flex-col gap-4">
	<div class="flex flex-row items-center justify-between">
		<h2 class="text-2xl font-medium">Your projects</h2>
		<Button href="/app/projects/create"><Plus class="size-4" />Create a project</Button>
	</div>
	{#each projects as project}
		<Card
			href="/app/projects/{project.id}"
			class="group flex-row items-center gap-4 rounded"
			hoverEffect={true}
		>
			<div
				class="border-border text-muted bg-background group-hover:bg-primary group-hover:text-primary-foreground rounded-full border p-1.5 font-mono text-base font-bold transition-colors"
			>
				<FolderOpen class="size-4" />
			</div>
			{project.name}
		</Card>
	{:else}
		<Alert icon={FolderOpen}>
			No projects found
			<p class="text-muted text-sm font-normal">Create a project to get started</p>
		</Alert>
	{/each}
</section>
