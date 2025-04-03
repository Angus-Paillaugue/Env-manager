<script lang="ts">
  import { Card } from '$lib/components';
  import { pageHeading } from '$lib/stores';
  import { localizeHref, t } from '$lib/translations';
  import { DoorOpen, Settings } from 'lucide-svelte';

  pageHeading.set({
    title: $t('app.account.title'),
    description: $t('app.account.description'),
    breadcrumbs: [{ title: $t('app.account.title'), href: '/app/account' }]
  });
</script>

<section class="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
  <Card
    href="/app/account/settings"
    class="group flex-row items-center gap-4 rounded"
    hoverEffect={true}
  >
    <div
      class="border-border text-muted bg-background group-hover:bg-primary group-hover:text-primary-foreground rounded-full border p-1.5 font-mono text-base font-bold transition-colors"
    >
      <Settings class="size-4" />
    </div>
    {$t('app.account.settings.title')}
  </Card>

  <Card
    href="/log-out"
    overrideHref={false}
    class="group flex-row items-center gap-4 rounded"
    hoverEffect={true}
  >
    <div
      class="border-border text-muted bg-background group-hover:bg-primary group-hover:text-primary-foreground rounded-full border p-1.5 font-mono text-base font-bold transition-colors"
    >
      <DoorOpen class="size-4" />
    </div>
    {$t('app.account.logOut')}
  </Card>
</section>
