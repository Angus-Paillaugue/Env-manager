<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, Input, Modal, Spinner } from '$lib/components';
	import Button from '$lib/components/Button/Button.svelte';
	import { pageHeading } from '$lib/stores';
	import type { User } from '$lib/types';
	import { Upload } from 'lucide-svelte';

	let { data, form } = $props();

	let user = $state<User>(data.user);
	let profilePictureModalOpen = $state(false);
	let profilePictureInputFiles: FileList | null = $state(null);
	let profilePicturePreview: HTMLImageElement | null = $state(null);
	let isUploadingProfilePicture = $state(false);
	let isSavingGeneral = $state(false);
	let updatedUser = $derived<User>(user);
	let deleteAccountConfirmModalOpen = $state(false);
	let isDeletingAccount = $state(false);

	pageHeading.set({
		title: 'Settings',
		description: 'Manage your account settings',
		breadcrumbs: [
			{ title: 'Account', href: '/app/account' },
			{ title: 'Settings', href: '/app/account/settings' }
		]
	});

	$effect(() => {
		if (!form) return;
		let { body, ok, action } = form;
		if (!ok || !action || !body) {
			console.error(form);
			return;
		}

		switch (action) {
			case 'updateProfilePicture': {
				user.profilePicture = body + '?' + Date.now();
				profilePicturePreview = null;
				profilePictureInputFiles = null;
				profilePictureModalOpen = false;
				break;
			}
			case 'saveGeneral': {
				const data = body as User;
				user = data;
				break;
			}
		}
	});

	$effect(() => {
		if (profilePictureInputFiles?.length) {
			profilePictureModalOpen = true;
			const reader = new FileReader();
			reader.onload = (e) => {
				if (!e.target || typeof e.target.result !== 'string' || !profilePicturePreview) return;
				profilePicturePreview.src = e.target.result;
			};
			reader.readAsDataURL(profilePictureInputFiles[0]);
		}
	});
</script>

<!-- General -->
<section class="mt-12 flex flex-col gap-4">
	<h2 class="text-2xl font-medium">General</h2>

	<form
		class="grid grid-cols-2 gap-4"
		method="POST"
		action="?/saveGeneral"
		use:enhance={() => {
			isSavingGeneral = true;
			return async ({ update }) => {
				isSavingGeneral = false;
				update({ reset: false });
			};
		}}
	>
		<Input.Floating type="text" id="name" label="Username" value={updatedUser.username} />
		<Input.Floating type="email" id="email" label="E-mail" value={updatedUser.email} disabled />

		<div class="col-span-2 flex flex-row gap-4">
			<Button loading={isSavingGeneral}>Save</Button>
			{#if form?.ok && form.action === 'saveGeneral'}
				<Alert.Success>Your changes have been saved successfully.</Alert.Success>
			{/if}
		</div>
	</form>
</section>

<!-- Personalization -->
<section class="mt-12 flex flex-col gap-4">
	<h2 class="text-2xl font-medium">Personalization</h2>

	<!-- Save profile picture confirm modal -->
	<Modal bind:open={profilePictureModalOpen}>
		<Modal.Heading>
			<Modal.Title>Profile picture upload</Modal.Title>
			<Modal.Description>Do you want to save this profile picture?</Modal.Description>
		</Modal.Heading>

		<form
			action="?/updateProfilePicture"
			class="flex flex-col gap-4"
			method="POST"
			enctype="multipart/form-data"
			use:enhance={(e) => {
				if (profilePictureInputFiles === null) return;
				e.formData.append('profilePicture', profilePictureInputFiles[0]);
				isUploadingProfilePicture = true;
				return async ({ update }) => {
					isUploadingProfilePicture = false;
					update({ reset: false });
				};
			}}
		>
			<div class="border-border bg-card relative size-32 overflow-hidden rounded-full border">
				<Spinner class="absolute top-1/2 left-1/2 -z-10 size-8 -translate-x-1/2 -translate-y-1/2" />
				<!-- svelte-ignore a11y_missing_attribute -->
				<img bind:this={profilePicturePreview} class="size-full object-cover" />
			</div>

			<Modal.Actions>
				<Button
					variant="secondary"
					type="button"
					onclick={() => (profilePictureModalOpen = false)}
					disabled={isUploadingProfilePicture}>Cancel</Button
				>
				<Button loading={isUploadingProfilePicture}>Save</Button>
			</Modal.Actions>
		</form>
	</Modal>

	<div class="grid grid-cols-2 gap-4">
		<!-- Profile picture input -->
		<label
			for="profilePicture"
			class="border-border bg-card group hover:bg-card-hover flex cursor-pointer flex-row items-center gap-4 rounded border p-2 transition-colors"
		>
			<div
				class="border-border bg-card-hover group-hover:bg-card size-8 overflow-hidden rounded-full border p-2 transition-colors"
			>
				<!-- svelte-ignore a11y_img_redundant_alt -->
				<Upload class="size-full" />
			</div>
			<input
				type="file"
				accept="image/*"
				bind:files={profilePictureInputFiles}
				id="profilePicture"
				class="hidden"
			/>
			<span class="text-muted text-sm">Upload a profile picture</span>
		</label>
	</div>
</section>

<!-- Security -->
<section class="mt-12 flex flex-col gap-4">
	<h2 class="text-2xl font-medium">Security</h2>

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

	<Button variant="danger" onclick={() => (deleteAccountConfirmModalOpen = true)}
		>Delete account</Button
	>
</section>
