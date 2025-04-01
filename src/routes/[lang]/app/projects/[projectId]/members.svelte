<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, Button, Input, Modal } from '$lib/components';
	import type { Project, User } from '$lib/types';
	import { Plus } from 'lucide-svelte';
	import Member from './member.svelte';
	import { cn } from '$lib/utils';
	import { handleForm } from '$lib/utils/formHandler';
	import { t } from '$lib/translations';

	interface MyProps {
		project: Project;
		form: any;
	}
	let { project, form }: MyProps = $props();
	let addMemberModalOpen = $state(false);
	let isAddingMember = $state(false);
	let autoCompleteUsers = $state<User[]>([]);
	let addUserInputValue = $state<string>('');

	async function autoComplete(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		const response = await fetch(`/api/projects/members/autocomplete?query=${value}`);
		const data = await response.json();
		if (!response.ok) {
			console.error(data.error);
			return;
		}
		autoCompleteUsers = data.users;
	}

	$effect(() => {
		handleForm(form, {
			onSuccess: (body, action) => {
				switch (action) {
					case 'addMember':
						addMemberModalOpen = false;
				}
			}
		});
	});
</script>

<!-- Add member modal -->
<Modal bind:open={addMemberModalOpen}>
	<Modal.Heading>
		<Modal.Title>{$t('app.project.members.add.title')}</Modal.Title>
		<Modal.Description
			>{$t('app.project.members.add.description', { projectName: project.name })}</Modal.Description
		>
	</Modal.Heading>
	<form
		method="POST"
		action="?/addMember"
		class="flex w-full flex-col gap-2"
		use:enhance={() => {
			isAddingMember = true;
			return async ({ update }) => {
				isAddingMember = false;
				update({ reset: false });
			};
		}}
	>
		<Input.Floating
			bind:value={addUserInputValue}
			type="text"
			id="memberUsername"
			label={$t('labels.username')}
			autocomplete="off"
			onkeydown={autoComplete}
		/>
		{#if autoCompleteUsers.length > 0}
			<div class="border-border flex w-full flex-col overflow-hidden rounded border shadow">
				{#each autoCompleteUsers as user, i}
					<button
						type="button"
						class={cn(
							'border-border hover:bg-card-hover flex w-full cursor-pointer flex-row items-center justify-start gap-2 p-2 text-start transition-colors',
							i !== 0 && 'border-t'
						)}
						onclick={() => {
							addUserInputValue = user.username;
							autoCompleteUsers = [];
						}}
					>
						<img src={user.profilePicture} alt={user.username} class="size-8 rounded-full" />
						<div class="flex min-w-0 grow flex-col">
							<span class="text-sm font-medium">{user.username}</span>
							<span class="text-muted text-xs font-normal">{user.email}</span>
						</div>
					</button>
				{/each}
			</div>
		{/if}
		{#if form && form.ok === false && form?.action === 'addMember' && form.error}
			<Alert.Danger>{form.error}</Alert.Danger>
		{/if}
		<Modal.Actions>
			<Button type="button" variant="secondary" onclick={() => (addMemberModalOpen = false)}
				>{$t('labels.cancel')}</Button
			>
			<Button loading={isAddingMember} type="submit">{$t('labels.add')}</Button>
		</Modal.Actions>
	</form>
</Modal>

<section class="mt-12 flex flex-col gap-4">
	<div class="flex flex-row items-center justify-between">
		<h2 class="text-2xl font-medium">{$t('app.project.members.list.title')}</h2>
		<Button onclick={() => (addMemberModalOpen = true)}
			><Plus class="size-4" />{$t('labels.add')}</Button
		>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
		{#each project.members as member}
			<Member {member} {form} />
		{/each}
	</div>
</section>
