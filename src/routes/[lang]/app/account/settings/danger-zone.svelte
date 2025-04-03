<script lang="ts">
  import { enhance } from '$app/forms';
  import { Card, Modal } from '$lib/components';
  import Button from '$lib/components/Button/Button.svelte';
  import { t } from '$lib/translations';
  import { Trash2 } from 'lucide-svelte';

  let deleteAccountConfirmModalOpen = $state(false);
  let isDeletingAccount = $state(false);
</script>

Annuler<!-- Delete account confirm modal -->
<Modal bind:open={deleteAccountConfirmModalOpen}>
  <Modal.Heading>
    <Modal.Title>{$t('app.account.settings.tabs.dangerZone.deleteAccount.title')}</Modal.Title>
  </Modal.Heading>

  <p>{$t('app.account.settings.tabs.dangerZone.deleteAccount.description')}</p>

  <p class="text-danger">{$t('app.account.settings.tabs.dangerZone.deleteAccount.warning')}</p>

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
        disabled={isDeletingAccount}>{$t('labels.cancel')}</Button
      >
      <Button loading={isDeletingAccount} variant="danger">{$t('labels.delete')}</Button>
    </Modal.Actions>
  </form>
</Modal>

<Card>
  <Card.Heading>{$t('app.account.settings.tabs.dangerZone.name')}</Card.Heading>
  <p class="text-muted text-sm">{$t('app.account.settings.tabs.dangerZone.description')}</p>

  <div class="mt-4 flex flex-col gap-4">
    <Button variant="danger" onclick={() => (deleteAccountConfirmModalOpen = true)}>
      <Trash2 class="size-5" />
      {$t('app.account.settings.tabs.dangerZone.deleteAccount.button')}
    </Button>
  </div>
</Card>
