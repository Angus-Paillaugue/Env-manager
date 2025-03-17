<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, Button, Input, Modal } from '$lib/components';
	import type { Environment } from '$lib/types';
	import { EllipsisVertical, Pen, Trash2 } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { portal } from '$lib/utils/portal.svelte';

	interface MyPros {
		environment: Environment;
		form: any;
		open: boolean;
		onOpen: () => void;
	}

	let { open = false, onOpen, environment, form }: MyPros = $props();
	let deleteEnvironmentModalOpen = $state<boolean>(false);
	let isDeletingEnvironment = $state<boolean>(false);
	let editEnvironmentModalOpen = $state<boolean>(false);
	let isEditingEnvironment = $state<boolean>(false);
	let editedEnvironment = $state<Environment>(clone(environment));

	function onPageClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		const closest = target.closest('.dropdown');
		if (
			(closest && closest.getAttribute('data-environment-id') === environment.id) ||
			target.closest('.portal')
		)
			return;
		open = false;
	}

	// Check if the editedEnvironment has been changed from the actual environment
	function isEnvironmentEdited() {
		return environment.name !== editedEnvironment.name;
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
		editEnvironmentModalOpen = false;
		deleteEnvironmentModalOpen = false;
	});

	// Reset edited environment when modal is closed
	$effect(() => {
		if (!editEnvironmentModalOpen) {
			editedEnvironment = clone(environment);
		}
	});
</script>

<svelte:window onclick={onPageClick} />

<div use:portal class="portal">
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
				<Button
					type="button"
					variant="secondary"
					onclick={() => (deleteEnvironmentModalOpen = false)}>Cancel</Button
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
				<Button variant="primary" loading={isEditingEnvironment} disabled={!isEnvironmentEdited()}
					>Edit</Button
				>
			</Modal.Actions>
		</form>
	</Modal>
</div>

<div class="dropdown relative ml-auto" data-environment-id={environment.id}>
	<Button
		variant="secondary"
		class="size-6 rounded p-1"
		onclick={(e: MouseEvent) => {
			e.preventDefault();
			open = !open;
		}}
	>
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
				onclick={(e: MouseEvent) => {
					e.preventDefault();
					editEnvironmentModalOpen = true;
				}}
			>
				<Pen class="size-4" />
				Edit
			</button>
			<!-- Delete -->
			<button
				class="hover:bg-card-hover border-border flex w-full cursor-pointer flex-row items-center gap-2 border-t p-2 text-left transition-colors"
				onclick={(e: MouseEvent) => {
					e.preventDefault();
					deleteEnvironmentModalOpen = true;
				}}
			>
				<Trash2 class="text-danger size-4" />
				Delete
			</button>
		</div>
	{/if}
</div>
