<script lang="ts">
  import { t } from '$lib/translations';
  import { SquareTerminal } from 'lucide-svelte';
  import Pill from '../pill.svelte';
  import Encrypt from './encrypt.svelte';
  import OrbitingCircles from './OrbitingCircles.svelte';
  import Terminal from './terminal.svelte';
</script>

<section class="flex flex-col px-2 py-12 lg:px-10 lg:py-24 min-h-svh">
  <div
    class="mx-auto flex w-full max-w-screen-2xl grow flex-col items-center justify-center gap-10"
  >
    <Pill>
      <SquareTerminal class="size-4" />
      {$t('home.homepage.workflow.heading.pill')}
    </Pill>
    <div class="flex flex-col items-center justify-center gap-2">
      <h1 class="text-4xl font-bold">{$t('home.homepage.workflow.heading.title')}</h1>
      <p class="text-muted text-base">
        {$t('home.homepage.workflow.heading.description')}
      </p>
    </div>
    <div class="grid h-fit w-full grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-10 xl:grid-cols-3">
      <div
        class="bg-card border-border flex h-[470px] flex-col items-start gap-2 rounded-lg border p-4"
      >
        <span
          class="bg-card-hover text-foreground rounded px-2 py-1 font-mono text-base font-medium"
        >
          01
        </span>
        <p class="text-lg font-medium">{$t('home.homepage.workflow.card1.title')}</p>
        <p class="text-muted text-sm">
          {$t('home.homepage.workflow.card1.description')}
        </p>

        <div class="relative flex w-full grow flex-col overflow-hidden">
          <OrbitingCircles />
        </div>
      </div>
      <div
        class="bg-card border-border flex h-[470px] flex-col items-start gap-2 rounded-lg border p-4"
      >
        <span
          class="bg-card-hover text-foreground rounded px-2 py-1 font-mono text-base font-medium"
        >
          02
        </span>
        <p class="text-lg font-medium">{$t('home.homepage.workflow.card2.title')}</p>
        <p class="text-muted text-sm">
          {$t('home.homepage.workflow.card2.description')}
        </p>

        <div class="relative flex w-full grow flex-col overflow-hidden">
          <Encrypt />
        </div>
      </div>
      <Terminal />
    </div>
  </div>
</section>
