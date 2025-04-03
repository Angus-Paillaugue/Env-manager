<script lang="ts">
  import { enhance } from '$app/forms';
  import { Alert, Button, Card, Input, Link } from '$lib/components';
  import { pageHeading } from '$lib/stores';
  import { t } from '$lib/translations';

  $pageHeading = {
    title: $t('home.auth.signUp.title'),
    description: $t('home.auth.signUp.description')
  };

  let { form } = $props();
  let isLoading = $state<boolean>(false);
</script>

<div class="flex w-full grow flex-col items-center justify-center p-2">
  <Card class="w-full  max-w-lg">
    <Card.Heading>{$t('home.auth.signUp.title')}</Card.Heading>
    <form
      action="?/signUp"
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
      <Input.Floating type="text" id="email" label={$t('labels.email')} />
      <Input.Floating type="text" id="username" label={$t('labels.username')} />
      <Input.Floating type="password" id="password" label={$t('labels.password')} />
      {#if form && form.ok === false && form.action === 'signUp'}
        <Alert.Danger>{form.error}</Alert.Danger>
      {/if}
      <Button variant="primary" class="w-full" loading={isLoading}>{$t('labels.submit')}</Button>

      <p>
        {$t('home.auth.signUp.alreadyHaveAnAccount.text')}
        <Link href="/auth/log-in">{$t('home.auth.signUp.alreadyHaveAnAccount.cta')}</Link>
      </p>
    </form>
  </Card>
</div>
