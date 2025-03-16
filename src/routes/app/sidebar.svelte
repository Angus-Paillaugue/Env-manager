<script lang="ts">
	import { page } from '$app/state';
	import { Hr } from '$lib/components';
	import type { Project } from '$lib/types';

	interface MyProps {
		projects: Project[];
	}

	let { projects }: MyProps = $props();
</script>

<aside
	class="bg-background border-border flex h-full w-full max-w-sm shrink-0 flex-col border-r p-4"
>
	<div class="flex flex-col gap-1">
		<Hr text="Projects" />
		{#each projects as project}
			{#if page?.data?.project?.environments && page?.data?.project?.id === project.id}
				<div class="flex flex-col">
					<span>{project.name}</span>
					<div class="border-background ml-1 flex flex-col border-l-2 pl-2">
						{#each page?.data?.project?.environments as environment}
							<a href="/app/projects/{project.id}/environments/{environment.name}"
								>{environment.name}</a
							>
						{/each}
					</div>
				</div>
			{:else}
				<a href="/app/projects/{project.id}">{project.name}</a>
			{/if}
		{/each}
	</div>

	<div
		class="bg-card hover:border-border hover:bg-card-hover border-card mt-auto flex cursor-pointer flex-row items-center gap-4 rounded border p-3 transition-all"
	>
		<div class="border-border size-8 rounded-full border"></div>
		<span class="text-sm font-medium">{page.data.user.username}</span>
	</div>
</aside>
