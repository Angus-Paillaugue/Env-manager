<script lang="ts">
  import { enhance } from '$app/forms';
  import { Alert, Button, Card, Input, Modal } from '$lib/components';
  import { SECTION_HEIGHT } from '$lib/components/home/utils';
  import Link from '$lib/components/Link/Link.svelte';
  import { pageHeading } from '$lib/stores';
  import { t } from '$lib/translations';
  import { handleForm } from '$lib/utils/formHandler';

  $pageHeading = {
    title: $t('home.auth.logIn.title'),
    description: $t('home.auth.logIn.description')
  };

  let { form } = $props();
  let isLoading = $state<boolean>(false);
  let totpModalOpen = $state(false);
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
<Modal bind:open={totpModalOpen} noBackdropClose={true}>
  <Modal.Heading>
    <Modal.Title>{$t('home.auth.logIn.totp.title')}</Modal.Title>
    <Modal.Description>{$t('home.auth.logIn.totp.description')}</Modal.Description>
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
    <Input.TOTP name="totp" id="totp" class={{ container: 'mx-auto w-fit' }} />

    {#if form && form.ok === false && form.action === 'confirmTOTP'}
      <Alert.Danger>{form.error}</Alert.Danger>
    {/if}
    <Modal.Actions>
      <Button loading={isSendingTOTP}>{$t('home.auth.logIn.totp.next')}</Button>
    </Modal.Actions>
  </form>
</Modal>

<div class="flex w-full grow flex-col items-center justify-center p-2">
  <Card class="w-full max-w-lg">
    <Card.Heading>{$t('home.auth.logIn.title')}</Card.Heading>
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
      <Input.Floating type="text" id="email" label={$t('labels.email')} bind:value={emailValue} />
      <Input.Floating
        type="password"
        id="password"
        label={$t('labels.password')}
        bind:value={passwordValue}
      />
      {#if form && form.ok === false && form.action === 'logIn'}
        <Alert.Danger>{form.error}</Alert.Danger>
      {/if}
      <Button variant="primary" class="w-full" loading={isLoading}>{$t('labels.submit')}</Button>

      <p class="mt-4">
        {$t('home.auth.logIn.noAccount.text')}
        <Link href="/auth/sign-up">{$t('home.auth.logIn.noAccount.cta')}</Link>
      </p>
    </form>
  </Card>
</div>
