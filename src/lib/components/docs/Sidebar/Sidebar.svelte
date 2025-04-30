<script lang="ts">
  import { Sidebar } from '$lib/components/';
  import type { Docs } from '$lib/types';
  import ElementList from './elementList.svelte';

  interface MyProps {
    tree: Docs['Tree'][];
  }

  const { tree }: MyProps = $props();
</script>

<Sidebar>
  {#snippet desktop()}
    <div class="flex flex-col gap-1">
      <ElementList {tree} root={true} />
    </div>
  {/snippet}
</Sidebar>
