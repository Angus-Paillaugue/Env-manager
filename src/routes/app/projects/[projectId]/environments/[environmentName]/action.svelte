<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, Button, Input, Modal } from '$lib/components';
	import type { Environment, Variable } from '$lib/types';
	import { EllipsisVertical, Pen, Trash2 } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	interface MyPros {
		variable: Variable;
		environment: Environment;
		form: any;
		open: boolean;
		onOpen: () => void;
	}
	let { open = false, onOpen, variable, environment, form }: MyPros = $props();
	let deleteVariableModalOpen = $state<boolean>(false);
	let isDeletingVariable = $state<boolean>(false);
	let editVariableModalOpen = $state<boolean>(false);
	let isEditingVariable = $state<boolean>(false);
	let editedVariable = $state<Variable>(clone(variable));

	function onPageClick(event: MouseEvent) {
		const closest = (event.target as HTMLElement).closest('.dropdown');
		if (closest && closest.getAttribute('data-variable-id') === variable.id) return;
		open = false;
	}

	// Check if the editedVariable has been changed from the actual variable
	function isVariableEdited() {
		return variable.name !== editedVariable.name || variable.value !== editedVariable.value;
	}

	// Clone an object
	function clone(obj: any) {
		return JSON.parse(JSON.stringify(obj));
	}

	// Call onOpen function when opening this dropdown
	// Close all other dropdowns when closing this dropdown
	$effect(() => {
		if (open) {
			onOpen();
			return;
		}
		editVariableModalOpen = false;
		deleteVariableModalOpen = false;
	});

	// Reset edited variable when modal is closed
	$effect(() => {
		if (!editVariableModalOpen) {
			editedVariable = clone(variable);
		}
	});
</script>

<svelte:window onclick={onPageClick} />

<div class="dropdown relative ml-auto" data-variable-id={variable.id}>
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
				This action cannot be undone. This will permanently delete the variable <b
					>{variable.name}</b
				>
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
			<Modal.Description>Edit <b>{variable.name}</b> in <b>{environment.name}</b></Modal.Description
			>
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
				<Button variant="primary" loading={isEditingVariable} disabled={!isVariableEdited()}
					>Edit</Button
				>
			</Modal.Actions>
		</form>
	</Modal>
	<Button variant="secondary" class="size-6 rounded p-1" onclick={() => (open = !open)}>
		<EllipsisVertical class="size-full" />
	</Button>
	{#if open}
		<div
			class="bg-card border-border absolute top-full right-0 z-20 flex h-fit w-40 flex-col overflow-hidden rounded border text-base font-medium"
			transition:slide={{ axis: 'y', duration: 400 }}
		>
			<!-- Edit -->
			<button
				class="hover:bg-card-hover flex w-full cursor-pointer flex-row items-center gap-2 p-2 text-left transition-colors"
				onclick={() => {
					editVariableModalOpen = true;
				}}
			>
				<Pen class="size-4" />
				Edit
			</button>
			<!-- Delete -->
			<button
				class="hover:bg-card-hover border-border flex w-full cursor-pointer flex-row items-center gap-2 border-t p-2 text-left transition-colors"
				onclick={() => {
					deleteVariableModalOpen = true;
				}}
			>
				<Trash2 class="text-danger size-4" />
				Delete
			</button>
		</div>
	{/if}
</div>
