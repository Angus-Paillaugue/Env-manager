<script lang="ts">
  import Button from '$lib/components/Button';
  import { t } from '$lib/translations';
  import { onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';

  const services = ['Vercel', 'Railway', 'Docker', 'Cloudflare'];
  let syncing = $state(false);
  let activeServices = $state<string[]>([]);
  let card = $state<HTMLDivElement | null>(null);
  let interval = $state<ReturnType<typeof setInterval> | null>(null);

  async function startSync() {
    if (syncing) return;
    syncing = true;
    activeServices = [];

    for (const service of services) {
      activeServices = [...activeServices, service];
      await new Promise((res) => setTimeout(res, 700)); // Simulate delay
    }

    await new Promise((res) => setTimeout(res, 1000));
    syncing = false;
    activeServices = [];
  }

  onMount(() => {
    // Check if the card is in view
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !interval) {
            startSync();
            interval = setInterval(startSync, 5200);
          } else if (!entry.isIntersecting && interval) {
            clearInterval(interval);
            interval = null;
          }
        }
      },
      { threshold: 0.5 }
    );
    if (card) observer.observe(card);

    return () => observer.disconnect();
  });
</script>

<div
  class="border-border bg-background absolute top-1/3 left-1/4 h-full w-full rounded-lg border p-4"
  bind:this={card}
>
  <div class="flex flex-row gap-4">
    <Button class="relative h-10 w-28 shrink-0" disabled={syncing}>
      {#if syncing}
        <span
          in:fly={{ y: '100%', duration: 300 }}
          out:fly={{ y: '-100%', duration: 300 }}
          class="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center"
          >{$t('home.homepage.bento.card2.syncing')}...</span
        >
      {:else}
        <span
          in:fly={{ y: '100%', duration: 300 }}
          out:fly={{ y: '-100%', duration: 300 }}
          class="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center"
          >{$t('home.homepage.bento.card2.syncNow')}</span
        >
      {/if}
    </Button>

    <div class="flex grow flex-col">
      <p class="text-muted text-sm">
        {$t('home.homepage.bento.card2.project.title')}
        <span class="text-foreground font-medium"
          >{$t('home.homepage.bento.card2.project.name')}</span
        >
      </p>
      <p class="text-muted text-sm">
        {$t('home.homepage.bento.card2.environment.title')}
        <span class="font-medium text-cyan-600"
          >{$t('home.homepage.bento.card2.environment.name')}</span
        >
      </p>
    </div>
  </div>

  <div class="mt-4 flex w-[calc(75%-1rem)] flex-col space-y-2">
    {#each activeServices as service (service)}
      <div
        class="bg-card flex items-center rounded px-3 py-2 text-sm"
        transition:fly={{ y: 10, duration: 400, easing: cubicOut }}
      >
        <span class="mr-2">🚀</span>
        {$t('home.homepage.bento.card2.syncingTo')}
        {service}...
      </div>
    {/each}
  </div>
</div>
