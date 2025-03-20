<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, Card, Input, Modal, Spinner } from '$lib/components';
	import Button from '$lib/components/Button/Button.svelte';
	import type { User } from '$lib/types';
	import { handleForm } from '$lib/utils/formHandler';
	import QRCode from 'qrcode';
	import { page } from '$app/state';
	import { Shield, ShieldBan } from 'lucide-svelte';

	let user = $state<User>(page.data.user);
	let setUpTOTPModalOpen = $state(false);
	let isSettingUpTOTP = $state(false);
	let TOTPSuccessModalOpen = $state(false);
	let TOTPsecret = $state('');
	let isChangingPassword = $state(false); // Fixed the typo in variable name

	$effect(() => {
		handleForm(page.form, {
			onSuccess: (body, action) => {
				switch (action) {
					case 'unlinkTOTP': {
						const data = body as { success: boolean };
						if (data.success) {
							user.totpEnabled = false;
							user.totpSecret = null;
							setUpTOTPModalOpen = false;
						}
						break;
					}
					case 'setUpTOTP': {
						const data = body as { success: boolean };
						if (data.success) {
							user.totpEnabled = true; // Assuming you want to enable TOTP for the user
							setUpTOTPModalOpen = false; // Close the modal after successful setup
							TOTPSuccessModalOpen = true;
						}
					}
				}
			}
		});
	});

	async function getTOTPURL() {
		const res = await fetch('/api/authenticate/totp/generateURL');
		const data = await res.json();
		if (!res.ok) {
			throw new Error(data.message);
		}
		TOTPsecret = data.secret;
		return data.url;
	}

	const generateQR = async () => {
		try {
			const url = await getTOTPURL();
			const qrCodeUrl = await QRCode.toDataURL(url, {
				errorCorrectionLevel: 'H',
				type: 'image/png',
				width: 256,
				margin: 1
			});
			return qrCodeUrl;
		} catch (err) {
			console.error(err);
		}
	};
</script>

<Card>
	<Card.Heading>Change Password</Card.Heading>
	<p class="text-muted text-sm">Update your password.</p>

	<div class="mt-4 flex flex-col gap-4">
		<form
			action="?/updatePassword"
			method="POST"
			class=" flex flex-col gap-2"
			use:enhance={() => {
				isChangingPassword = true;
				return async ({ update }) => {
					isChangingPassword = false;
					update({ reset: false });
				};
			}}
		>
			<Input.Floating
				type="password"
				id="currentPassword"
				label="Current password"
				required
				autocomplete="current-password"
			/>
			<Input.Floating
				type="password"
				label="New password"
				id="newPassword"
				required
				autocomplete="new-password"
			/>

			{#if page.form && page.form.ok == false && page.form.action === 'updatePassword'}
				<Alert.Danger>{page.form.error}</Alert.Danger>
			{:else if page.form && page.form.ok == true && page.form.action === 'updatePassword'}
				<Alert.Success>Password changed successfully.</Alert.Success>
			{/if}

			<Button loading={isChangingPassword}>Update</Button>
		</form>
	</div>
</Card>

<Card>
	<Card.Heading>2FA</Card.Heading>
	<p class="text-muted text-sm">Add an extra layer of security to your account.</p>

	<div class="mt-4 flex flex-col gap-4">
		<Modal bind:open={setUpTOTPModalOpen}>
			<Modal.Heading>
				<Modal.Title>{user.totpEnabled ? 'Manage 2FA' : 'Set up 2FA'}</Modal.Title>
			</Modal.Heading>

			<!-- Unlink TOTP -->
			{#if user.totpEnabled}
				<p>
					2FA is already set up for your account. You can disable it by clicking the button below.
				</p>

				<form
					action="?/unlinkTOTP"
					class="mt-6 flex flex-col gap-4"
					method="POST"
					use:enhance={() => {
						isSettingUpTOTP = true;
						return async ({ update }) => {
							isSettingUpTOTP = false;
							update({ reset: false });
						};
					}}
				>
					<Modal.Actions>
						<Button variant="secondary" type="button" onclick={() => (setUpTOTPModalOpen = false)}
							>Close</Button
						>
						<Button loading={isSettingUpTOTP} variant="danger">Unlink 2FA</Button>
					</Modal.Actions>
				</form>
			{:else}
				<!-- Set up TOTP -->
				<p>To enhance your account security, please set up Time-based One-Time Password (2FA).</p>

				{#await generateQR()}
					<Spinner class="mx-auto size-8" />
				{:then url}
					<img src={url} alt="QR Code for 2FA setup" class="mx-auto size-64" />
				{:catch error}
					<Alert.Danger>{error.message}</Alert.Danger>
				{/await}

				<form
					action="?/setUpTOTP"
					class="mt-6 flex flex-col gap-4"
					method="POST"
					use:enhance={(e) => {
						e.formData.append('TOTPsecret', TOTPsecret);
						isSettingUpTOTP = true;
						return async ({ update }) => {
							isSettingUpTOTP = false;
							update({ reset: false });
						};
					}}
				>
					<Input.Floating type="text" maxlength={6} id="totp" label="TOTP code" />
					{#if page.form && page.form.ok == false && page.form.action === 'setUpTOTP'}
						<Alert.Danger>
							{page.form.error}
						</Alert.Danger>
					{/if}
					<Modal.Actions>
						<Button variant="secondary" type="button" onclick={() => (setUpTOTPModalOpen = false)}
							>Close</Button
						>
						<Button loading={isSettingUpTOTP}>Next</Button>
					</Modal.Actions>
				</form>
			{/if}
		</Modal>

		<!-- TOTP success modal -->
		<Modal bind:open={TOTPSuccessModalOpen}>
			<Modal.Heading>
				<Modal.Title>Success</Modal.Title>
				<Modal.Description>Success setting up TOTP</Modal.Description>
			</Modal.Heading>

			<p>
				You successfully set-up TOTP authentication on your account. You will be prompted to enter
				the code on each log-in.
			</p>

			<Modal.Actions>
				<Button onclick={() => (TOTPSuccessModalOpen = false)}>Close</Button>
			</Modal.Actions>
		</Modal>

		{#if !user.totpEnabled}
			<Alert icon={ShieldBan} variant="warning"
				>Two-factor authentication is not enabled. Enable it to secure your account.</Alert
			>
		{:else}
			<Alert icon={Shield} variant="success">
				Two-factor authentication is enabled for your account.
			</Alert>
		{/if}

		<Button onclick={() => (setUpTOTPModalOpen = true)}
			>{user.totpEnabled ? 'Manage 2FA' : 'Set up 2FA'}</Button
		>
	</div>
</Card>
