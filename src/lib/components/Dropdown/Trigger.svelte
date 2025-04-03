<script lang="ts">
  import type { Snippet } from 'svelte';
  import Button from '../Button';
  import type { ButtonProps } from '../Button/Button.svelte';
  import { open as openMap } from './dropdown.svelte';

  interface MyProps {
    children?: Snippet;
    key: string;
  }

  let { children, key, ...restProps }: ButtonProps & MyProps = $props();

  function toggle(e: MouseEvent) {
    e.preventDefault();
    if (!openMap.has(key)) {
      console.error('Key ' + key + ' does not exists!');
      return;
    }

    openMap.set(key, !openMap.get(key));
  }
</script>

<Button variant="secondary" onclick={toggle} {...restProps}>
  {@render children?.()}
</Button>
