<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, Button, Input, Modal } from '$lib/components';
	import { pageHeading } from '$lib/stores';
	import { Plus } from 'lucide-svelte';

	let { project, form } = $props();
	let addMemberModalOpen = $state(false);
	let isAddingMember = $state(false);

	pageHeading.set({
		title: 'Environments',
		description: `Manage environments in the <b>${project.name}</b> project`,
		breadcrumbs: [
			{ title: 'Projects', href: '/app' },
			{ title: project.name, href: '/app/projects/' + project.id }
		]
	});
</script>

<!-- Add member modal -->
<Modal bind:open={addMemberModalOpen}>
	<Modal.Heading>
		<Modal.Title>Add a member</Modal.Title>
		<Modal.Description>Add a member to <b>{project.name}</b></Modal.Description>
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
		<Input.Floating type="text" id="memberUsername" label="Username" />
		{#if form && form.ok === false && form?.action === 'addMember' && form.error}
			<Alert.Danger>{form.error}</Alert.Danger>
		{/if}
		<Modal.Actions>
			<Button type="button" variant="secondary" onclick={() => (addMemberModalOpen = false)}
				>Cancel</Button
			>
			<Button loading={isAddingMember}>Add</Button>
		</Modal.Actions>
	</form>
</Modal>

<section class="mt-12 flex flex-col gap-4">
	<div class="flex flex-row items-center justify-between">
		<h2 class="text-2xl font-medium">Members</h2>
		<Button onclick={() => (addMemberModalOpen = true)}><Plus class="size-4" />Add</Button>
	</div>

	<div class="flex flex-col">
		{#each project.members as member}
			{member.user.username}
		{/each}
	</div>
</section>
