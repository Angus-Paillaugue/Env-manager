<script>
  import { cn } from '$lib/utils';

  const { class: className, ...restProps } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  class={cn('size-4 animate-spin', className)}
  viewBox="0 0 24 24"
  {...restProps}
  ><path
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M21 12a9 9 0 1 1-6.219-8.56"
  /></svg
>
