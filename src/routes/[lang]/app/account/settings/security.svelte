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
		ShieldBan
		// Trash2
	} from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import { copyToClipboard } from '$lib/utils';
	import { t } from '$lib/translations';

	let user = $state<User>(page.data.user);
	let setUpTOTPModalOpen = $state(false);
	let isSettingUpTOTP = $state(false);
	let TOTPSuccessModalOpen = $state(false);
	let TOTPsecret = $state('');
	let isChangingPassword = $state(false);
	let manualTOPTKeyVisible = $state(false);
	let unlinkTOTPSecondStepModalOpen = $state(false);
	// let unlinkTOTPSecondStepSuccessModalOpen = $state(false);

	$effect(() => {
		handleForm(page.form, {
			onSuccess: (body, action) => {
				switch (action) {
					case 'unlinkTOTP': {
						const data = body as { success: boolean; method: 'mail' | 'TOTP' };
						if (data.success) {
							user.totpEnabled = false;
							user.totpSecret = null;
							unlinkTOTPSecondStepModalOpen = false;
							setUpTOTPModalOpen = false;
							// if (data.method === 'mail') {
							// 	unlinkTOTPSecondStepSuccessModalOpen = true;
							// }
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
	<Card.Heading>{$t('app.account.settings.tabs.security.changePassword.title')}</Card.Heading>
	<p class="text-muted text-sm">
		{$t('app.account.settings.tabs.security.changePassword.description')}
	</p>

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
				label={$t('app.account.settings.tabs.security.changePassword.currentPassword')}
				required
				autocomplete="current-password"
			/>
			<Input.Floating
				type="password"
				label={$t('app.account.settings.tabs.security.changePassword.newPassword')}
				id="newPassword"
				required
				autocomplete="new-password"
			/>

			{#if page.form && page.form.ok == false && page.form.action === 'updatePassword'}
				<Alert.Danger>{page.form.error}</Alert.Danger>
			{:else if page.form && page.form.ok == true && page.form.action === 'updatePassword'}
				<Alert.Success
					>{$t('app.account.settings.tabs.security.changePassword.success')}</Alert.Success
				>
			{/if}

			<Button loading={isChangingPassword}>
				<Pen class="size-4" />
				{$t('app.account.settings.tabs.security.changePassword.updateButton')}
			</Button>
		</form>
	</div>
</Card>

<!-- Unused modal because we do not provide a SMTP server yet -->
<!-- <Modal bind:open={unlinkTOTPSecondStepSuccessModalOpen}>
  <Modal.Heading>
    <Modal.Title>Success</Modal.Title>
    <Modal.Description>Go check your main</Modal.Description>
  </Modal.Heading>

  <p>
    We have sent you an email with instructions to unlink 2FA. Please check your inbox.
  </p>

  <Modal.Actions>
    <Button onclick={() => (unlinkTOTPSecondStepSuccessModalOpen = false)}>
      <CheckCheck class="size-4" />
      Close
    </Button>
  </Modal.Actions>
</Modal> -->

<!-- Set up/Unlink 2FA -->
<Modal bind:open={unlinkTOTPSecondStepModalOpen}>
	<Modal.Heading>
		<Modal.Title>{$t('app.account.settings.tabs.security.unlink2fa.title')}</Modal.Title>
	</Modal.Heading>

	<form
		action="?/unlinkTOTP"
		class="mt-6 flex flex-col gap-4"
		method="POST"
		use:enhance={(e) => {
			e.formData.append('TOTPsecret', TOTPsecret);
			e.formData.append('method', 'TOTP');
			isSettingUpTOTP = true;
			return async ({ update }) => {
				isSettingUpTOTP = false;
				update({ reset: false });
			};
		}}
	>
		<p>{$t('app.account.settings.tabs.security.unlink2fa.description')}</p>
		<Input.TOTP id="totp" class={{ container: 'mx-auto w-fit' }} />
		{#if page.form && page.form.ok == false && page.form.action === 'unlinkTOTP'}
			<Alert.Danger>
				{page.form.error}
			</Alert.Danger>
		{/if}
		<Modal.Actions>
			<Button
				variant="secondary"
				type="button"
				onclick={() => (unlinkTOTPSecondStepModalOpen = false)}>{$t('labels.cancel')}</Button
			>
			<Button loading={isSettingUpTOTP}>
				{$t('app.account.settings.tabs.security.unlink2fa.disableButton')}
				<ArrowRight class="size-4" />
			</Button>
		</Modal.Actions>
	</form>

	<!-- Unused section because we do not provide a SMTP server yet -->
	<!-- <Hr text="Or" />
  <p>
    If you have lost access to your authenticator app, you can unlink 2FA by verifying your email.
  </p>

  <form action="?/unlinkTOTP" class="mt-6 flex flex-col gap-4" method="POST" use:enhance={(e) => {
    e.formData.append('method', 'mail');
    isSettingUpTOTP = true;
    return async ({ update }) => {
      isSettingUpTOTP = false;
      update({ reset: false });
    };
  }}>
    {#if page.form && page.form.ok == false && page.form.action === 'unlinkTOTP'}
      <Alert.Danger>
        {page.form.error}
      </Alert.Danger>
    {/if}
    <Button variant="primary" onclick={() => (unlinkTOTPSecondStepModalOpen = false)}>
      Send verification email
      <ArrowRight class="size-4" />
    </Button>
  </form> -->
</Modal>

<!-- Set up/Unlink 2FA -->
<Modal bind:open={setUpTOTPModalOpen}>
	<Modal.Heading>
		<Modal.Title
			>{$t(
				user.totpEnabled
					? 'app.account.settings.tabs.security.manage2fa.title'
					: 'app.account.settings.tabs.security.setup2fa.title'
			)}</Modal.Title
		>
	</Modal.Heading>

	<!-- Unlink TOTP -->
	{#if user.totpEnabled}
		<p>{$t('app.account.settings.tabs.security.manage2fa.description')}</p>

		<Modal.Actions>
			<Button variant="secondary" type="button" onclick={() => (setUpTOTPModalOpen = false)}
				>{$t('labels.close')}</Button
			>
			<Button
				variant="danger"
				onclick={() => {
					unlinkTOTPSecondStepModalOpen = true;
					setUpTOTPModalOpen = false;
				}}
			>
				{$t('app.account.settings.tabs.security.manage2fa.disableButton')}
				<ArrowRight class="size-4" />
			</Button>
		</Modal.Actions>
	{:else}
		<!-- Set up TOTP -->
		<p>{$t('app.account.settings.tabs.security.setup2fa.description')}</p>

		<div class="flex flex-col items-center justify-center gap-4">
			{#await generateQR()}
				<Spinner class="mx-auto size-8" />
			{:then url}
				<img
					src={url}
					alt={$t('app.account.settings.tabs.security.setup2fa.qrCodeAlt')}
					class="mx-auto size-64"
				/>
				<div class="flex flex-col items-center justify-center">
					<p>{$t('app.account.settings.tabs.security.setup2fa.unableToScan')}</p>
					<div class="flex flex-row items-center justify-center">
						<button
							class="hover:bg-secondary-hover text-muted mr-1 size-6 shrink-0 cursor-pointer rounded-sm p-1 transition-colors"
							title={$t('app.account.settings.tabs.security.setup2fa.showHideValue')}
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

		<Hr text={$t('app.account.settings.tabs.security.setup2fa.confirmCode')} />

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
					>{$t('labels.close')}</Button
				>
				<Button loading={isSettingUpTOTP}>
					{$t('app.account.settings.tabs.security.setup2fa.nextButton')}
					<ArrowRight class="size-4" />
				</Button>
			</Modal.Actions>
		</form>
	{/if}
</Modal>

<!-- TOTP success modal -->
<Modal bind:open={TOTPSuccessModalOpen}>
	<Modal.Heading>
		<Modal.Title>{$t('app.account.settings.tabs.security.successModal.title')}</Modal.Title>
		<Modal.Description
			>{$t('app.account.settings.tabs.security.successModal.description')}</Modal.Description
		>
	</Modal.Heading>

	<p>
		{$t('app.account.settings.tabs.security.successModal.message')}
	</p>

	<Modal.Actions>
		<Button onclick={() => (TOTPSuccessModalOpen = false)}>
			<CheckCheck class="size-4" />
			{$t('labels.close')}
		</Button>
	</Modal.Actions>
</Modal>

<Card>
	<Card.Heading>{$t('app.account.settings.tabs.security.2fa.title')}</Card.Heading>
	<p class="text-muted text-sm">{$t('app.account.settings.tabs.security.2fa.description')}</p>

	<div class="mt-4 flex flex-col gap-4">
		{#if !user.totpEnabled}
			<Alert icon={ShieldBan} variant="warning">
				{$t('app.account.settings.tabs.security.2fa.notEnabled')}
			</Alert>
		{:else}
			<Alert icon={Shield} variant="success">
				{$t('app.account.settings.tabs.security.2fa.enabled')}
			</Alert>
		{/if}

		<Button onclick={() => (setUpTOTPModalOpen = true)}>
			<Fingerprint class="size-4" />
			{$t(
				user.totpEnabled
					? 'app.account.settings.tabs.security.2fa.manageButton'
					: 'app.account.settings.tabs.security.2fa.setupButton'
			)}
		</Button>
	</div>
</Card>
