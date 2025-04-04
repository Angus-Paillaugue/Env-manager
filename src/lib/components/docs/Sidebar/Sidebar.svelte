<script lang="ts">
  import type { Docs } from '$lib/types';
  import ElementList from './elementList.svelte';

  interface MyProps {
    tree: Docs['Tree'][];
  }

  const { tree }: MyProps = $props();
</script>

<div class="flex flex-col">
  <ElementList {tree} root={true} />
</div>
