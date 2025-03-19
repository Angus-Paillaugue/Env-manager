<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, Button, Card, Input, Modal } from '$lib/components';
	import Link from '$lib/components/Link/Link.svelte';
	import { handleForm } from '$lib/utils/formHandler.js';

	let { form } = $props();
	let isLoading = $state<boolean>(false);
	let totpModalOpen = $state(true);
	let isSendingTOTP = $state(false);
	let emailValue = $state<string>('');
	let passwordValue = $state<string>('');

	$effect(() => {
		handleForm(form, {
			onSuccess: (body, action) => {
				switch (action) {
					case 'logIn': {
						const data = body as { totp?: boolean };
						if (data.totp) {
							totpModalOpen = true;
						}
						break;
					}
					default:
						break;
				}
			},
			onError: (error) => {
				console.error(error);
			}
		});
	});
</script>

<!-- TOTP input modal -->
<Modal bind:open={totpModalOpen}>
	<Modal.Heading>
		<Modal.Title>TOTP confirm</Modal.Title>
		<Modal.Description>Confirm your TOTP code</Modal.Description>
	</Modal.Heading>

	<form
		action="?/confirmTOTP"
		class="mt-6 flex flex-col gap-4"
		method="POST"
		use:enhance={(e) => {
			e.formData.append('email', emailValue);
			e.formData.append('password', passwordValue);
			isSendingTOTP = true;
			return async ({ update }) => {
				isSendingTOTP = false;
				update({ reset: false });
			};
		}}
	>
		<Input.TOTP name="totp" id="totp" class={{ container: 'mx-auto max-w-sm' }} />

		{#if form && form.ok === false && form.action === 'confirmTOTP'}
			<Alert.Danger>{form.error}</Alert.Danger>
		{/if}
		<Modal.Actions>
			<Button loading={isSendingTOTP}>Next</Button>
		</Modal.Actions>
	</form>
</Modal>

<div class="mx-auto w-full max-w-lg p-2">
	<Card>
		<Card.Heading>Log-in</Card.Heading>
		<form
			action="?/logIn"
			method="POST"
			class="mt-8 flex flex-col gap-4"
			use:enhance={() => {
				isLoading = true;
				return async ({ update }) => {
					isLoading = false;
					update({ reset: false });
				};
			}}
		>
			<Input.Floating type="text" id="email" label="Email" bind:value={emailValue} />
			<Input.Floating type="password" id="password" label="Password" bind:value={passwordValue} />
			{#if form && form.ok === false && form.action === 'logIn'}
				<Alert.Danger>{form.error}</Alert.Danger>
			{/if}
			<Button variant="primary" class="w-full" loading={isLoading}>Submit</Button>

			<p class="mt-4">No account ? <Link href="/auth/sign-up">Sign up.</Link></p>
		</form>
	</Card>
</div>
