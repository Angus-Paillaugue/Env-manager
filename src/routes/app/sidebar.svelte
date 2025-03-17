<script lang="ts">
	import { page } from '$app/state';
	import { Hr } from '$lib/components';
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';

	let projects = $derived(page.data.projects);
	let currentProject = $derived(page.data?.project);
	let currentEnvironment = $derived(page.data?.environment);
	let user = $derived(page.data.user);
</script>

<aside
	class="bg-background border-border flex h-full w-full max-w-sm shrink-0 flex-col border-r p-4"
>
	<div class="flex flex-col gap-1">
		<Hr text="Projects" />
		<!-- <Collapsible.Group> -->
		{#each projects as project}
			<!-- <Collapsible summary={project.name} open={currentProject?.id === project.id}>
          {#each project.environments as environment}
            <a href="/app/projects/{project.id}/environments/{environment.name}" class={cn("p-2 rounded border text-base font-normal border-background", currentEnvironment?.id === environment.id && "bg-card border-border")}>{environment.name}</a>
          {/each}
        </Collapsible> -->

			<details open={currentProject?.id === project.id} class="group">
				<summary
					class={cn(
						'border-background flex cursor-pointer flex-row items-center justify-between rounded border p-2 text-lg font-medium',
						currentProject?.id === project.id && !currentEnvironment && 'bg-card border-border'
					)}
				>
					{project.name}
					<div
						class="hover:bg-card-hover text-muted size-6 rounded-sm p-1 transition-all group-open:rotate-180"
					>
						<ChevronDown class="size-full" />
					</div>
				</summary>

				<div class="ml-4 flex flex-col">
					{#each project.environments as environment}
						<a
							href="/app/projects/{project.id}/environments/{environment.name}"
							class={cn(
								'border-background rounded border p-2 text-base font-normal',
								currentEnvironment?.id === environment.id && 'bg-card border-border'
							)}>{environment.name}</a
						>
					{/each}
				</div>
			</details>
		{/each}
		<!-- </Collapsible.Group> -->
	</div>

	<a
		href="/app/account"
		class="bg-card hover:border-border hover:bg-card-hover border-card mt-auto flex cursor-pointer flex-row items-center gap-4 rounded border p-3 transition-all"
	>
		<div class="border-border size-8 overflow-hidden rounded-full border">
			<!-- svelte-ignore a11y_img_redundant_alt -->
			<img src={user.profilePicture} alt="Profile picture" class="object-cover object-center" />
		</div>
		<span class="text-sm font-medium">{user.username}</span>
	</a>
</aside>

<style>
	details > summary {
		list-style: none;
	}
	details > summary::-webkit-details-marker {
		display: none;
	}
</style>
