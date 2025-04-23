<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { Alert, Card, Flag, Input, Modal, Spinner } from '$lib/components';
  import Button from '$lib/components/Button/Button.svelte';
  import { locale, locales, setLocale, t } from '$lib/translations';
  import type { User } from '$lib/types';
  import { cloneObject, cn, isDeepEqual } from '$lib/utils/';
  import { handleForm } from '$lib/utils/formHandler';
  import { Save, Upload } from 'lucide-svelte';

  let user = $state<User>(page.data.user);
  let isSavingGeneral = $state(false);
  // svelte-ignore state_referenced_locally
  let updatedUser = $state<User>(cloneObject(user) as User);
  let profilePictureModalOpen = $state(false);
  let profilePictureInputFiles: FileList | null = $state(null);
  let profilePicturePreview: HTMLImageElement | null = $state(null);
  let isUploadingProfilePicture = $state(false);

  $effect(() => {
    handleForm(page.form, {
      onSuccess: (body, action) => {
        switch (action) {
          case 'saveGeneral': {
            const data = body as User;
            user = data;
            updatedUser = cloneObject(data) as User; // Update the derived state
            break;
          }
          case 'updateProfilePicture': {
            user.profilePicture = body + '?' + Date.now();
            profilePicturePreview = null;
            profilePictureInputFiles = null;
            profilePictureModalOpen = false;
            break;
          }
        }
      }
    });
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

<Card>
  <Card.Heading>{$t('app.account.settings.tabs.general.name')}</Card.Heading>
  <p class="text-muted text-sm">{$t('app.account.settings.tabs.general.description')}</p>

  <div class="mt-4 flex flex-col gap-4">
    <!-- Save profile picture confirm modal -->
    <Modal bind:open={profilePictureModalOpen}>
      <Modal.Heading>
        <Modal.Title
          >{$t('app.account.settings.tabs.general.avatar.confirmModal.title')}</Modal.Title
        >
        <Modal.Description
          >{$t(
            'app.account.settings.tabs.general.avatar.confirmModal.description'
          )}</Modal.Description
        >
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
          <Spinner
            class="absolute top-1/2 left-1/2 -z-10 size-8 -translate-x-1/2 -translate-y-1/2"
          />
          <!-- svelte-ignore a11y_missing_attribute -->
          <img bind:this={profilePicturePreview} class="size-full object-cover" />
        </div>

        <Modal.Actions>
          <Button
            variant="secondary"
            type="button"
            onclick={() => (profilePictureModalOpen = false)}
            disabled={isUploadingProfilePicture}>{$t('labels.cancel')}</Button
          >
          <Button loading={isUploadingProfilePicture}>
            <Save class="size-4" />
            {$t('labels.save')}
          </Button>
        </Modal.Actions>
      </form>
    </Modal>

    <!-- Profile picture input -->
    <div class="flex flex-row items-center gap-4">
      <!-- svelte-ignore a11y_missing_attribute -->
      <img
        src={user.profilePicture}
        class="border-border size-24 rounded-full border object-cover"
      />
      <label
        for="profilePicture"
        class="border-border bg-card group hover:bg-card-hover flex cursor-pointer flex-row items-center gap-4 rounded border p-2 transition-colors"
      >
        <div
          class="border-border bg-card-hover group-hover:bg-card size-8 overflow-hidden rounded-full border p-2 transition-colors"
        >
          <Upload class="size-full" />
        </div>
        <input
          type="file"
          accept="image/*"
          bind:files={profilePictureInputFiles}
          id="profilePicture"
          class="hidden"
        />
        <span class="text-muted text-sm"
          >{$t('app.account.settings.tabs.general.avatar.label')}</span
        >
      </label>
    </div>

    <!-- Username and email -->
    <form
      class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2"
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
      <Input
        type="text"
        id="name"
        label={$t('labels.username')}
        bind:value={updatedUser.username}
        disabled
        autocomplete="off"
      />
      <Input type="email" id="email" label={$t('labels.email')} bind:value={updatedUser.email} />

      <div class="flex flex-row gap-4 lg:col-span-2">
        <Button loading={isSavingGeneral} disabled={isDeepEqual(user, updatedUser)}>
          <Save class="size-4" />
          {$t('labels.save')}
        </Button>
        {#if page.form && page.form.ok === false && page.form.action === 'saveGeneral'}
          <Alert.Danger>{page.form.error}</Alert.Danger>
        {/if}
        {#if page.form && page.form.ok && page.form.action === 'saveGeneral'}
          <Alert.Success>Your changes have been saved successfully.</Alert.Success>
        {/if}
      </div>
    </form>

    <div class="flex flex-col gap-1">
      <h2 class="text-lg font-medium">{$t('app.account.settings.tabs.general.language')}</h2>
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {#each locales as l}
          <button
            onclick={() => setLocale(l)}
            class={cn(
              'bg-card border-border flex flex-row items-center gap-2 rounded border p-2 transition-colors',
              l === $locale ? 'bg-secondary-hover' : 'hover:bg-card-hover cursor-pointer'
            )}
          >
            <Flag lang={l} />
            <span class="border-border h-0 w-1 border-t"></span>
            {l.toUpperCase()}
          </button>
        {/each}
      </div>
    </div>
  </div>
</Card>
