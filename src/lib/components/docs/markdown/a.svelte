<script lang="ts">
  import { ExternalLink } from 'lucide-svelte';

  const { href, children } = $props();

  let isPointingOutside = href.startsWith('http') || href.startsWith('mailto');
</script>

<a
  {href}
  target={isPointingOutside ? '_blank' : '_self'}
  class="border-border hover:border-foreground focus:border-foreground relative inline-flex cursor-pointer flex-row items-center gap-1 border-b text-inherit no-underline transition-colors"
>
  {@render children()}
  {#if isPointingOutside}
    <ExternalLink class="size-4" />
  {/if}
</a>
