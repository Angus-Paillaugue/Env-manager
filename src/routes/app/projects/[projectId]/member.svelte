<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Alert, Button, Card, Modal } from '$lib/components';
	import type { ProjectMember } from '$lib/types';
	import { cn } from '$lib/utils';
	import { Trash2 } from 'lucide-svelte';

	interface MyProps {
		member: ProjectMember;
		form: any;
	}
	let { member, form }: MyProps = $props();
	let removeMemberModalOpen = $state(false);
	let isRemovingMember = $state(false);
	let mobileHover = $state(false);

	function handlePageClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (target.closest('.card') === null) {
			mobileHover = false;
		}
	}
</script>

<svelte:window onclick={handlePageClick} />

<!-- Remove member modal -->
<Modal bind:open={removeMemberModalOpen}>
	<Modal.Heading>
		<Modal.Title>Remove a member</Modal.Title>
		<Modal.Description>Remove <b>{member.user.username}</b></Modal.Description>
	</Modal.Heading>
	<form
		method="POST"
		action="?/removeMember"
		class="flex w-full flex-col gap-2"
		use:enhance={(e) => {
			e.formData.append('memberId', member.userId);
			isRemovingMember = true;
			return async ({ update }) => {
				isRemovingMember = false;
				update({ reset: false });
			};
		}}
	>
		{#if member.userId === page.data.user.id}
			<p>Are you sure you want to remove yourself from the project?</p>
		{:else}
			<p>
				Are you sure you want to remove <b>{member.user.username}</b> from the project?
			</p>
		{/if}
		{#if form && form.ok === false && form?.action === 'removeMember' && form.error}
			<Alert.Danger>{form.error}</Alert.Danger>
		{/if}
		<Modal.Actions>
			<Button
				type="button"
				variant="secondary"
				disabled={isRemovingMember}
				onclick={() => (removeMemberModalOpen = false)}>Cancel</Button
			>
			<Button variant="danger" loading={isRemovingMember} type="submit"
				>{member.userId === page.data.user.id ? 'Leave' : 'Remove'}</Button
			>
		</Modal.Actions>
	</form>
</Modal>

<Card class="group card flex-row items-center gap-4 rounded" onclick={() => (mobileHover = true)}>
	<div
		class={cn(
			'bg-card/50 absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg opacity-0 transition-opacity group-hover:opacity-100',
			mobileHover && 'opacity-100'
		)}
	>
		<Button variant="danger" onclick={() => (removeMemberModalOpen = true)}>
			<Trash2 class="size-4 shrink-0" />
			{#if member.userId === page.data.user.id}
				Leave project
			{:else}
				Remove from project
			{/if}
		</Button>
	</div>
	<!-- svelte-ignore a11y_missing_attribute -->
	<img src={member.user.profilePicture} class="size-12 shrink-0 rounded-full" />
	<div class="flex min-w-0 grow flex-col">
		<p class="text-foreground text-base font-bold">{member.user.username}</p>
		<p class="text-muted truncate text-sm font-normal">{member.user.email}</p>
	</div>
</Card>
