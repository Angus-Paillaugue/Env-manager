<!-- Unused page because we do not provide a SMTP server yet -->

<script lang="ts">
  import { Button, Card } from '$lib/components';
  import { pageHeading } from '$lib/stores';
  import { t } from '$lib/translations';
  import { Cog } from 'lucide-svelte';

  pageHeading.set({
    title: $t('app.account.settings.2fa.unlink.title'),
    description: $t('app.account.settings.2fa.unlink.description'),
    breadcrumbs: [
      { title: $t('app.account.title'), href: '/app/account' },
      { title: $t('app.account.settings.title'), href: '/app/account/settings' },
      {
        title: $t('app.account.settings.2fa.unlink.title'),
        href: '/app/account/settings/totp/unlink'
      }
    ]
  });
</script>

<div class="flex h-full flex-col items-center justify-center">
  <Card class="w-full max-w-screen-lg">
    <Card.Heading>{$t('app.account.settings.2fa.unlink.title')}</Card.Heading>

    <div class="flex flex-col gap-4">
      <p>
        {$t('app.account.settings.2fa.unlink.description')}
      </p>

      <Button href="/app/account/settings">
        {$t('app.account.settings.2fa.unlink.goBackToSettings')}
        <Cog class="size-5" />
      </Button>
    </div>
  </Card>
</div>
