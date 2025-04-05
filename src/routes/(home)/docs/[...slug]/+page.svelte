<script lang="ts">
  import { pageHeading } from '$lib/stores';
  import { t } from '$lib/translations';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let currentPage = $derived(data.page);

  $effect(() => {
    pageHeading.set({
      title: $t('docs.title') + ' - ' + currentPage.metadata.name,
      description: currentPage.metadata?.description ?? ''
    });
  });
</script>

{@render currentPage.component()}
