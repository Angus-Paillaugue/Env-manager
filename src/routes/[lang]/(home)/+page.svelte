<script lang="ts">
  // import Marquee from '$lib/components/home/marquee/marquee.svelte';
  import Bento from '$lib/components/home/bento/bento.svelte';
  import Hero from '$lib/components/home/hero/hero.svelte';
  import Workflow from '$lib/components/home/workflow/workflow.svelte';
  import { pageHeading } from '$lib/stores';
  import { t } from '$lib/translations';

  $effect(() => {
    pageHeading.set({
      title: $t('home.homepage.title'),
      description: $t('home.homepage.description')
    });
  });
</script>

<Hero />

<!-- <Marquee /> -->

<Bento />

<Workflow />
