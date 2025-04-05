<script lang="ts">
  import { t } from '$lib/translations';
  import { cn, copyToClipboard } from '$lib/utils';
  import { Check, Copy, File } from 'lucide-svelte';
  import type { Snippet } from 'svelte';
  import { scale } from 'svelte/transition';

  interface ReceivedParams {
    children: Snippet;
    class?: string;
    name: string;
    copyCode: string;
    snippet: string;
    lineNumbers: string;
  }

  interface Props {
    name: string;
    copyCode: boolean;
    snippet: boolean;
    lineNumbers: boolean;
  }
  let {
    children,
    class: className,
    name,
    copyCode,
    snippet,
    lineNumbers
  }: ReceivedParams = $props();

  // Parsing params received as string from mdsvex parser into usable values
  const params: Props = {
    name: name || '',
    copyCode: copyCode === 'true',
    snippet: snippet === 'true',
    lineNumbers: lineNumbers === 'true'
  };

  let codeCopied = $state(false);
  let codeContainer = $state<HTMLElement | null>(null);

  const copyCodeToClipboard = () => {
    copyToClipboard((codeContainer?.querySelector('code') as HTMLElement).innerText);
    codeCopied = true;
    setTimeout(() => {
      codeCopied = false;
    }, 2000);
  };
</script>

{#snippet copyCodeButton()}
  {#if params.copyCode}
    <button
      onclick={copyCodeToClipboard}
      tabindex="0"
      class={cn(
        'text-foreground bg-secondary hover:bg-secondary-hover absolute right-4 flex size-8 cursor-pointer items-center justify-center rounded p-2 transition-colors',
        params.snippet ? 'top-1/2 -translate-y-1/2' : 'top-4 right-4'
      )}
      name={$t('components.docs.markdown.pre.copyCode')}
      aria-label={$t('components.docs.markdown.pre.copyCode')}
    >
      {#if codeCopied}
        <div in:scale={{ start: 0.5 }}>
          <Check class="size-full" />
        </div>
      {:else}
        <div in:scale={{ start: 0.5 }}>
          <Copy class="size-full" />
        </div>
      {/if}
    </button>
  {/if}
{/snippet}

{#if params.snippet}
  <div class="snippet" bind:this={codeContainer}>
    {@render children()}
    {@render copyCodeButton()}
  </div>
{:else}
  <div
    class={cn('codeContainer relative my-4', params.lineNumbers && 'line-numbers')}
    bind:this={codeContainer}
  >
    {#if params.name}
      <div
        class="codeBlockName border-border relative flex w-full flex-row items-center rounded-t-md border border-b-0 px-3 py-1.5"
      >
        <span class="text-foreground flex flex-row items-center gap-2 text-base font-medium">
          <File class="size-4" />
          {params.name}
        </span>
      </div>
    {/if}

    <div class={cn('relative', className)}>
      {@render children()}
      {@render copyCodeButton()}
    </div>
  </div>
{/if}

<style>
  :global(.codeBlockName + div .shiki) {
    @apply !rounded-t-none;
  }
</style>
