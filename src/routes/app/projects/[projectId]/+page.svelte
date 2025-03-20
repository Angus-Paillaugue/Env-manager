<script lang="ts">
	import Members from './members.svelte';
	import { enhance } from '$app/forms';
	import { Alert, Button, Card, Input, Modal } from '$lib/components';
	import { pageHeading } from '$lib/stores';
	import { Code, Plus } from 'lucide-svelte';
	import Action from './action.svelte';
	import type { Environment, Project, ProjectMember } from '$lib/types';
	import { handleForm } from '$lib/utils/formHandler';

	let { data, form } = $props();
	let project = $derived<Project>(data.project);
	let createEnvironmentModalOpen = $state(false);
	let isCreatingEnvironment = $state(false);

	$effect(() => {
		pageHeading.set({
			title: 'Environments',
			description: `Manage environments in the <b>${project.name}</b> project`,
			breadcrumbs: [
				{ title: 'Projects', href: '/app' },
				{ title: project.name, href: '/app/projects/' + project.id }
			],
			seo: {
				title: project.name + ' - Environments'
			}
		});
	});

	$effect(() => {
		handleForm(form, {
			onSuccess: (body, action) => {
				switch (action) {
					case 'deleteEnvironment': {
						project.environments = project.environments.filter(
							(env: Environment) => env.id !== body
						);
						break;
					}
					case 'addMember': {
						const data = body as unknown as ProjectMember;
						if (!project.members.some((member) => member.userId === data.userId)) {
							project.members.push(data);
						} else {
							form = {
								ok: false,
								action: 'addMember',
								error: 'User is already a member'
							};
						}
						break;
					}
					case 'editEnvironment': {
						const data = body as unknown as Environment;
						project.environments = project.environments.map((env) => {
							if (env.id === data.id) {
								return data;
							}
							return env;
						});
						break;
					}
					case 'removeMember': {
						const data = body as unknown as ProjectMember['userId'];
						project.members = project.members.filter((member) => member.userId !== data);
						break;
					}
				}
			},
			onError: (error, action) => {
				console.error(`Error in action ${action}:`, error);
			}
		});
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
	{#each project.environments as environment}
		<Card
			href="/app/projects/{project.id}/environments/{environment.name}"
			class="group flex-row items-center gap-4 rounded font-mono text-base font-bold"
			hoverEffect={true}
		>
			<div
				class="border-border text-muted bg-background group-hover:bg-primary group-hover:text-primary-foreground rounded-full border p-1.5 transition-colors"
			>
				<Code class="size-4" />
			</div>
			{environment.name}

			<div class="ml-auto">
				<Action {form} {environment} />
			</div>
		</Card>
	{:else}
		<Alert.Info>No environments found. Create one to manage your variables.</Alert.Info>
	{/each}
</section>

<Members {project} {form} />
