<script lang="ts">
  import type { Docs } from '$lib/types';
  import ElementList from './elementList.svelte';

  interface MyProps {
    tree: Docs['Tree'][];
  }

  const { tree }: MyProps = $props();
</script>

<aside
  class="bg-card border-border hidden w-full max-w-sm shrink-0 flex-col border-r p-4 transition-transform duration-300 lg:flex rtl:border-l"
>
  <div class="flex flex-col gap-1">
    <ElementList {tree} root={true} />
  </div>
</aside>
