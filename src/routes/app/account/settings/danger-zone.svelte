<script lang="ts">
	import { enhance } from '$app/forms';
	import { Modal } from '$lib/components';
	import Button from '$lib/components/Button/Button.svelte';
	import { Trash2 } from 'lucide-svelte';

	let deleteAccountConfirmModalOpen = $state(false);
	let isDeletingAccount = $state(false);
</script>

<!-- Delete account confirm modal -->
<Modal bind:open={deleteAccountConfirmModalOpen}>
	<Modal.Heading>
		<Modal.Title>Delete account</Modal.Title>
	</Modal.Heading>

	<p>
		Are you sure you want to delete your account? This action is irreversible and will delete all
		your data.
	</p>

	<p class="text-danger">This action cannot be undone.</p>

	<form
		action="?/deleteAccount"
		class="flex flex-col gap-4"
		method="POST"
		use:enhance={() => {
			isDeletingAccount = true;
			return async ({ update }) => {
				isDeletingAccount = false;
				update({ reset: false });
			};
		}}
	>
		<Modal.Actions>
			<Button
				variant="secondary"
				type="button"
				onclick={() => (deleteAccountConfirmModalOpen = false)}
				disabled={isDeletingAccount}>Cancel</Button
			>
			<Button loading={isDeletingAccount} variant="danger">Delete</Button>
		</Modal.Actions>
	</form>
</Modal>

<Button variant="danger" onclick={() => (deleteAccountConfirmModalOpen = true)}>
	<Trash2 class="size-5" />
	Delete account
</Button>
