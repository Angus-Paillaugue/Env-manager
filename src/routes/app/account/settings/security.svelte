<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, Card, Hr, Input, Modal, Spinner } from '$lib/components';
	import Button from '$lib/components/Button/Button.svelte';
	import type { User } from '$lib/types';
	import { handleForm } from '$lib/utils/formHandler';
	import QRCode from 'qrcode';
	import { page } from '$app/state';
	import {
		ArrowRight,
		CheckCheck,
		Eye,
		EyeClosed,
		Fingerprint,
		Pen,
		Shield,
		ShieldBan,
		Trash2
	} from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import { copyToClipboard } from '$lib/utils';

	let user = $state<User>(page.data.user);
	let setUpTOTPModalOpen = $state(false);
	let isSettingUpTOTP = $state(false);
	let TOTPSuccessModalOpen = $state(false);
	let TOTPsecret = $state('');
	let isChangingPassword = $state(false);
	let manualTOPTKeyVisible = $state(false);

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

			<Button loading={isChangingPassword}>
				<Pen class="size-4" />
				Update
			</Button>
		</form>
	</div>
</Card>

<!-- Set up/Unlink 2FA -->
<Modal bind:open={setUpTOTPModalOpen}>
	<Modal.Heading>
		<Modal.Title>{user.totpEnabled ? 'Manage 2FA' : 'Set up 2FA'}</Modal.Title>
	</Modal.Heading>

	<!-- Unlink TOTP -->
	{#if user.totpEnabled}
		<p>2FA is already set up for your account. You can disable it by clicking the button below.</p>

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
				<Button loading={isSettingUpTOTP} variant="danger">
					<Trash2 class="size-4" />
					Unlink 2FA
				</Button>
			</Modal.Actions>
		</form>
	{:else}
		<!-- Set up TOTP -->
		<p>To enhance your account security, please set up Time-based One-Time Password (2FA).</p>

		<div class="flex flex-col items-center justify-center gap-4">
			{#await generateQR()}
				<Spinner class="mx-auto size-8" />
			{:then url}
				<img src={url} alt="QR Code for 2FA setup" class="mx-auto size-64" />
				<div class="flex flex-col items-center justify-center">
					<p>Unable to scan? You can show the secret key :</p>
					<div class="flex flex-row items-center justify-center">
						<button
							class="hover:bg-secondary-hover text-muted mr-1 size-6 shrink-0 cursor-pointer rounded-sm p-1 transition-colors"
							title="Show/hide value"
							onclick={() => (manualTOPTKeyVisible = !manualTOPTKeyVisible)}
						>
							{#if manualTOPTKeyVisible}
								<span class="size-full" in:fade={{ duration: 400 }}>
									<EyeClosed class="size-full" />
								</span>
							{:else}
								<span class="size-full" in:fade={{ duration: 400 }}>
									<Eye class="size-full" />
								</span>
							{/if}
						</button>
						{#if manualTOPTKeyVisible}
							<button
								in:slide={{ axis: 'x', duration: 400, delay: 400 }}
								out:slide={{ axis: 'x', duration: 400 }}
								class="bg-secondary-hover cursor-copy truncate rounded-sm border px-1 py-0.5 text-start font-mono text-sm"
								onclick={() => copyToClipboard(TOTPsecret)}>{TOTPsecret}</button
							>
						{:else}
							<div
								class="flex h-full flex-row items-center rounded-sm"
								in:slide={{ delay: 400, axis: 'x', duration: 300 }}
								out:slide={{ axis: 'x', duration: 300 }}
							>
								{#each new Array(10) as _}
									<div class="flex w-2 shrink-0 flex-row items-center justify-center">
										<span class="bg-muted size-1 rounded-full"></span>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{:catch error}
				<Alert.Danger>{error.message}</Alert.Danger>
			{/await}
		</div>

		<Hr text="Confirm code" />

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
			<Input.TOTP id="totp" class={{ container: 'mx-auto w-fit' }} />
			{#if page.form && page.form.ok == false && page.form.action === 'setUpTOTP'}
				<Alert.Danger>
					{page.form.error}
				</Alert.Danger>
			{/if}
			<Modal.Actions>
				<Button variant="secondary" type="button" onclick={() => (setUpTOTPModalOpen = false)}
					>Close</Button
				>
				<Button loading={isSettingUpTOTP}>
					Next
					<ArrowRight class="size-4" />
				</Button>
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
		You successfully set-up TOTP authentication on your account. You will be prompted to enter the
		code on each log-in.
	</p>

	<Modal.Actions>
		<Button onclick={() => (TOTPSuccessModalOpen = false)}>
			<CheckCheck class="size-4" />
			Close
		</Button>
	</Modal.Actions>
</Modal>

<Card>
	<Card.Heading>2FA</Card.Heading>
	<p class="text-muted text-sm">Add an extra layer of security to your account.</p>

	<div class="mt-4 flex flex-col gap-4">
		{#if !user.totpEnabled}
			<Alert icon={ShieldBan} variant="warning"
				>Two-factor authentication is not enabled. Enable it to secure your account.</Alert
			>
		{:else}
			<Alert icon={Shield} variant="success">
				Two-factor authentication is enabled for your account.
			</Alert>
		{/if}

		<Button onclick={() => (setUpTOTPModalOpen = true)}>
			<Fingerprint class="size-4" />
			{user.totpEnabled ? 'Manage 2FA' : 'Set up 2FA'}
		</Button>
	</div>
</Card>
