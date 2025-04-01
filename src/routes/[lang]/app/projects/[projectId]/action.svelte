<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, Button, Input, Modal, Dropdown } from '$lib/components';
	import type { Environment } from '$lib/types';
	import { cloneObject, isDeepEqual } from '$lib/utils';
	import { handleForm } from '$lib/utils/formHandler';
	import { EllipsisVertical, Pen, Trash2 } from 'lucide-svelte';
	import { t } from '$lib/translations';

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
		<Modal.Title>{$t('app.environment.delete.title')}</Modal.Title>
		<Modal.Description
			>{$t('app.environment.delete.description', {
				environmentName: environment.name
			})}</Modal.Description
		>
	</Modal.Heading>
	<form
		method="POST"
		action="?/deleteEnvironment"
		class="flex w-full flex-col gap-2"
		use:enhance={(e) => {
			e.formData.append('environmentId', environment.id);
			isDeletingEnvironment = true;
			return async ({ update }) => {
				isDeletingEnvironment = false;
				update({ reset: false });
			};
		}}
	>
		<input type="hidden" name="environmentId" value={environment.id} />
		<p>{$t('app.environment.delete.confirmation')}</p>
		<p>{@html $t('app.environment.delete.warning', { environmentName: environment.name })}</p>
		{#if form && form.ok === false && form?.action === 'deleteEnvironment' && form.error}
			<Alert.Danger>{form.error}</Alert.Danger>
		{/if}
		<Modal.Actions>
			<Button type="button" variant="secondary" onclick={() => (deleteEnvironmentModalOpen = false)}
				>{$t('labels.cancel')}</Button
			>
			<Button variant="danger" loading={isDeletingEnvironment}>{$t('labels.delete')}</Button>
		</Modal.Actions>
	</form>
</Modal>

<!-- Edit environment modal -->
<Modal bind:open={editEnvironmentModalOpen}>
	<Modal.Heading>
		<Modal.Title>{$t('app.environment.edit.title')}</Modal.Title>
		<Modal.Description
			>{@html $t('app.environment.edit.description', {
				environmentName: environment.name
			})}</Modal.Description
		>
	</Modal.Heading>
	<form
		method="POST"
		action="?/editEnvironment"
		class="flex w-full flex-col gap-2"
		use:enhance={(e) => {
			e.formData.append('environmentId', environment.id);
			isEditingEnvironment = true;
			return async ({ update }) => {
				isEditingEnvironment = false;
				update({ reset: false });
			};
		}}
	>
		<Input.Floating
			type="text"
			id="environmentName"
			label={$t('app.environment.edit.nameLabel')}
			placeholder={$t('app.environment.edit.placeholder')}
			bind:value={editedEnvironment.name}
		/>

		{#if form && form.ok === false && form?.action === 'editEnvironment' && form.error}
			<Alert.Danger>{form.error}</Alert.Danger>
		{/if}
		<Modal.Actions>
			<Button type="button" variant="secondary" onclick={() => (editEnvironmentModalOpen = false)}
				>{$t('labels.cancel')}</Button
			>
			<Button
				variant="primary"
				loading={isEditingEnvironment}
				disabled={isDeepEqual(environment, editedEnvironment)}
			>
				{$t('labels.edit')}</Button
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
			{$t('labels.edit')}
		</Dropdown.Item>

		<!-- Delete -->
		<Dropdown.Item
			onclick={(e: MouseEvent) => {
				e.preventDefault();
				deleteEnvironmentModalOpen = true;
			}}
		>
			<Trash2 class="text-danger size-4" />
			{$t('labels.delete')}
		</Dropdown.Item>
	{/snippet}
</Dropdown>
