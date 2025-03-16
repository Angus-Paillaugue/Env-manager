<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, Button, Input, Modal } from '$lib/components';
	import { pageHeading } from '$lib/stores';
	import { Code, Plus } from 'lucide-svelte';

	let { data, form } = $props();
	let project = $state(data.project);
	let createEnvironmentModalOpen = $state(false);
	let isCreatingEnvironment = $state(false);

	pageHeading.set({
		title: 'Environments',
		description: `Manage environments in the <b>${project.name}</b> project`,
		breadcrumbs: [
			{ title: 'Projects', href: '/app' },
			{ title: project.name, href: '/app/projects/' + project.id }
		]
	});
</script>

<!-- Create environment modal -->
<Modal bind:open={createEnvironmentModalOpen}>
	<Modal.Heading>
		<Modal.Title>Create an environment</Modal.Title>
		<Modal.Description>Create a new environment to manage your variables</Modal.Description>
	</Modal.Heading>
	<form
		method="POST"
		action="?/createEnvironment"
		class="flex w-full flex-col gap-2"
		use:enhance={() => {
			isCreatingEnvironment = true;
			return async ({ update }) => {
				isCreatingEnvironment = false;
				update({ reset: false });
			};
		}}
	>
		<Input.Floating type="text" id="environmentName" label="Environment name" />
		{#if form && form.ok === false && form?.action === 'createEnvironment' && form.error}
			<Alert.Danger>{form.error}</Alert.Danger>
		{/if}
		<Modal.Actions>
			<Button type="button" variant="secondary" onclick={() => (createEnvironmentModalOpen = false)}
				>Cancel</Button
			>
			<Button loading={isCreatingEnvironment}>Create</Button>
		</Modal.Actions>
	</form>
</Modal>

<section class="mt-12 flex flex-col gap-4">
	<div class="flex flex-row items-center justify-between">
		<h2 class="text-2xl font-medium">Environments</h2>
		<Button onclick={() => (createEnvironmentModalOpen = true)}
			><Plus class="size-4" />Create environment</Button
		>
	</div>
	{#each project?.environments as environment}
		<a
			href="/app/projects/{project.id}/environments/{environment.name}"
			class="border-border bg-card group hover:bg-card-hover flex flex-row items-center gap-4 rounded border p-4 font-mono text-base font-bold transition-colors"
		>
			<div
				class="border-border text-muted bg-background group-hover:bg-primary group-hover:text-primary-foreground rounded-full border p-1.5 transition-colors"
			>
				<Code class="size-4" />
			</div>
			{environment.name}
		</a>
	{/each}
</section>
