<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, Button, Input, Modal, Dropdown } from '$lib/components';
	import type { Environment } from '$lib/types';
	import { cloneObject, isDeepEqual } from '$lib/utils';
	import { handleForm } from '$lib/utils/formHandler';
	import { EllipsisVertical, Pen, Trash2 } from 'lucide-svelte';

	interface MyPros {
		environment: Environment;
		form: any;
	}

	let { environment, form }: MyPros = $props();
	let deleteEnvironmentModalOpen = $state<boolean>(false);
	let isDeletingEnvironment = $state<boolean>(false);
	let editEnvironmentModalOpen = $state<boolean>(false);
	let isEditingEnvironment = $state<boolean>(false);
	let editedEnvironment = $state<Environment>(cloneObject(environment) as Environment);

	function onPageClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		const closest = target.closest('.dropdown');
		if (
			(closest && closest.getAttribute('data-environment-id') === environment.id) ||
			target.closest('.portal')
		)
			return;
	}

	// Reset edited environment when modal is closed
	$effect(() => {
		if (!editEnvironmentModalOpen) {
			editedEnvironment = cloneObject(environment) as Environment;
		}
	});

	$effect(() => {
		handleForm(form, {
			onSuccess: (body, action) => {
				switch (action) {
					case 'editEnvironment': {
						editEnvironmentModalOpen = false;
						deleteEnvironmentModalOpen = false;
						break;
					}
					case 'deleteEnvironment': {
						deleteEnvironmentModalOpen = false;
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

<svelte:window onclick={onPageClick} />

<!-- Delete environment modal -->
<Modal bind:open={deleteEnvironmentModalOpen}>
	<Modal.Heading>
		<Modal.Title>Delete an environment</Modal.Title>
		<Modal.Description>Delete <b>{environment.name}</b>?</Modal.Description>
	</Modal.Heading>
	<form
		method="POST"
		action="?/deleteEnvironment"
		class="flex w-full flex-col gap-2"
		use:enhance={() => {
			isDeletingEnvironment = true;
			return async ({ update }) => {
				isDeletingEnvironment = false;
				update({ reset: false });
			};
		}}
	>
		<input type="hidden" name="environmentId" value={environment.id} />
		<p>Are you sure you want to delete this environment ?</p>
		<p>
			This action cannot be undone. This will permanently delete the environment named <b
				>{environment.name}</b
			>.
		</p>
		{#if form && form.ok === false && form?.action === 'deleteEnvironment' && form.error}
			<Alert.Danger>{form.error}</Alert.Danger>
		{/if}
		<Modal.Actions>
			<Button type="button" variant="secondary" onclick={() => (deleteEnvironmentModalOpen = false)}
				>Cancel</Button
			>
			<Button variant="danger" loading={isDeletingEnvironment}>Delete</Button>
		</Modal.Actions>
	</form>
</Modal>

<!-- Edit environment modal -->
<Modal bind:open={editEnvironmentModalOpen}>
	<Modal.Heading>
		<Modal.Title>Edit an environment</Modal.Title>
		<Modal.Description>Edit <b>{environment.name}</b></Modal.Description>
	</Modal.Heading>
	<form
		method="POST"
		action="?/editEnvironment"
		class="flex w-full flex-col gap-2"
		use:enhance={() => {
			isEditingEnvironment = true;
			return async ({ update }) => {
				isEditingEnvironment = false;
				update({ reset: false });
			};
		}}
	>
		<input type="hidden" name="environmentId" value={environment.id} />

		<Input.Floating
			type="text"
			id="environmentName"
			label="Name"
			placeholder="e.g. Dev"
			bind:value={editedEnvironment.name}
		/>

		{#if form && form.ok === false && form?.action === 'editEnvironment' && form.error}
			<Alert.Danger>{form.error}</Alert.Danger>
		{/if}
		<Modal.Actions>
			<Button type="button" variant="secondary" onclick={() => (editEnvironmentModalOpen = false)}
				>Cancel</Button
			>
			<Button
				variant="primary"
				loading={isEditingEnvironment}
				disabled={!isDeepEqual(environment, editedEnvironment)}
			>
				>Edit</Button
			>
		</Modal.Actions>
	</form>
</Modal>

<Dropdown key="env-{environment.id}">
	{#snippet trigger()}
		<Dropdown.Trigger variant="secondary" class="size-6 rounded p-1" key="env-{environment.id}">
			<EllipsisVertical class="size-full" />
		</Dropdown.Trigger>
	{/snippet}

	{#snippet items()}
		<!-- Edit -->
		<Dropdown.Item
			onclick={(e: MouseEvent) => {
				e.preventDefault();
				editEnvironmentModalOpen = true;
			}}
		>
			<Pen class="size-4" />
			Edit
		</Dropdown.Item>

		<!-- Delete -->
		<Dropdown.Item
			onclick={(e: MouseEvent) => {
				e.preventDefault();
				deleteEnvironmentModalOpen = true;
			}}
		>
			<Trash2 class="text-danger size-4" />
			Delete
		</Dropdown.Item>
	{/snippet}
</Dropdown>
