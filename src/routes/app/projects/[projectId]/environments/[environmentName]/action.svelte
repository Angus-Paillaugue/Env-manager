<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, Button, Dropdown, Input, Modal } from '$lib/components';
	import type { Environment, Variable } from '$lib/types';
	import { cloneObject, isDeepEqual } from '$lib/utils';
	import { handleForm } from '$lib/utils/formHandler.svelte';
	import { EllipsisVertical, Pen, Trash2 } from 'lucide-svelte';

	interface MyPros {
		variable: Variable;
		environment: Environment;
		form: any;
	}
	let { variable, environment, form }: MyPros = $props();
	let deleteVariableModalOpen = $state<boolean>(false);
	let isDeletingVariable = $state<boolean>(false);
	let editVariableModalOpen = $state<boolean>(false);
	let isEditingVariable = $state<boolean>(false);
	let editedVariable = $state<Variable>(cloneObject(variable) as Variable);

	// Reset edited variable when modal is closed
	$effect(() => {
		if (!editVariableModalOpen) {
			editedVariable = cloneObject(variable) as Variable; // Update to use cloneObject
		}
	});

	handleForm(form, {
		onSuccess: (body, action) => {
			switch (action) {
				case 'deleteVariable': {
					deleteVariableModalOpen = false;
					break;
				}
			}
		},
		onError: (error, action) => {
			console.error(`Error in action ${action}:`, error);
		}
	});
</script>

<!-- Delete variable modal -->
<Modal bind:open={deleteVariableModalOpen}>
	<Modal.Heading>
		<Modal.Title>Delete a variable</Modal.Title>
		<Modal.Description
			>Delete <b>{variable.name}</b> from <b>{environment.name}</b>?</Modal.Description
		>
	</Modal.Heading>
	<form
		method="POST"
		action="?/deleteVariable"
		class="flex w-full flex-col gap-2"
		use:enhance={() => {
			isDeletingVariable = true;
			return async ({ update }) => {
				isDeletingVariable = false;
				update({ reset: false });
			};
		}}
	>
		<input type="hidden" name="variableId" value={variable.id} />
		<p>Are you sure you want to delete this variable ?</p>
		<p>
			This action cannot be undone. This will permanently delete the variable <b>{variable.name}</b>
			from the <b>{environment.name}</b> environment.
		</p>
		{#if form && form.ok === false && form?.action === 'deleteVariable' && form.error}
			<Alert.Danger>{form.error}</Alert.Danger>
		{/if}
		<Modal.Actions>
			<Button type="button" variant="secondary" onclick={() => (deleteVariableModalOpen = false)}
				>Cancel</Button
			>
			<Button variant="danger" loading={isDeletingVariable}>Delete</Button>
		</Modal.Actions>
	</form>
</Modal>

<!-- Edit variable modal -->
<Modal bind:open={editVariableModalOpen}>
	<Modal.Heading>
		<Modal.Title>Edit a variable</Modal.Title>
		<Modal.Description>Edit <b>{variable.name}</b> in <b>{environment.name}</b></Modal.Description>
	</Modal.Heading>
	<form
		method="POST"
		action="?/editVariable"
		class="flex w-full flex-col gap-2"
		use:enhance={() => {
			isEditingVariable = true;
			return async ({ update }) => {
				isEditingVariable = false;
				update({ reset: false });
			};
		}}
	>
		<input type="hidden" name="variableId" value={variable.id} />

		<div class="grid grid-cols-2 gap-4">
			<Input
				type="text"
				id="variableName"
				label="Key"
				placeholder="e.g. API_KEY"
				bind:value={editedVariable.name}
			/>
			<Input type="text" id="variableValue" label="Value" bind:value={editedVariable.value} />
		</div>

		{#if form && form.ok === false && form?.action === 'editVariable' && form.error}
			<Alert.Danger>{form.error}</Alert.Danger>
		{/if}
		<Modal.Actions>
			<Button type="button" variant="secondary" onclick={() => (editVariableModalOpen = false)}
				>Cancel</Button
			>
			<Button
				variant="primary"
				loading={isEditingVariable}
				disabled={!isDeepEqual(editedVariable, variable)}>Edit</Button
			>
		</Modal.Actions>
	</form>
</Modal>

<Dropdown key="var-{variable.id}" class="ml-auto">
	{#snippet trigger()}
		<Dropdown.Trigger variant="secondary" class="size-6 rounded p-1" key="var-{variable.id}">
			<EllipsisVertical class="size-full" />
		</Dropdown.Trigger>
	{/snippet}

	{#snippet items()}
		<Dropdown.Item
			class="hover:bg-card-hover flex w-full cursor-pointer flex-row items-center gap-2 p-2 text-left transition-colors"
			onclick={() => {
				editVariableModalOpen = true;
			}}
		>
			<Pen class="size-4" />
			Edit
		</Dropdown.Item>
		<Dropdown.Item
			class="hover:bg-card-hover border-border flex w-full cursor-pointer flex-row items-center gap-2 border-t p-2 text-left transition-colors"
			onclick={() => {
				deleteVariableModalOpen = true;
			}}
		>
			<Trash2 class="text-danger size-4" />
			Delete
		</Dropdown.Item>
	{/snippet}
</Dropdown>
