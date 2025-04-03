<script lang="ts">
  import { Card } from '$lib/components';
  import { SECTION_HEIGHT } from '$lib/components/home/utils';
  import { pageHeading } from '$lib/stores';
  import { t } from '$lib/translations';

  $pageHeading = {
    title: $t('home.auth.callback.success.title'),
    description: $t('home.auth.callback.success.description')
  };
</script>

<div class="flex flex-col items-center justify-center p-2" style="height: {SECTION_HEIGHT};">
  <Card class="w-full max-w-lg" hoverEffect={true}>
    <Card.Heading>{$t('home.auth.callback.success.title')}</Card.Heading>
    <div class="mt-4 flex flex-col">
      <p class="text-lg">{$t('home.auth.callback.success.text')}</p>
      <p>{$t('home.auth.callback.success.description')}</p>
    </div>
  </Card>
</div>
