<script lang="ts">
  import { cn } from '$lib/utils';
  import { CheckCheck, Info, OctagonAlert, TriangleAlert } from 'lucide-svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';

  interface MyProps {
    variant?: 'danger' | 'success' | 'warning' | 'info';
    icon?: any;
  }

  const {
    children,
    class: className,
    variant: variant = 'info',
    icon,
    ...props
  }: SvelteHTMLElements['div'] & MyProps = $props();
  const baseClasses = 'border p-4 rounded flex flex-row items-center gap-4';

  const icons = new Map<MyProps['variant'], any>([
    ['danger', OctagonAlert],
    ['success', CheckCheck],
    ['warning', TriangleAlert],
    ['info', Info]
  ]);

  const variantClasses = new Map<MyProps['variant'], string>([
    ['danger', 'border-danger'],
    ['success', 'border-success'],
    ['warning', 'border-warning'],
    ['info', 'border-primary']
  ]);
</script>

<div color="alert" class={cn(baseClasses, variantClasses.get(variant), className)} {...props}>
  <svelte:component this={icon ?? icons.get(variant)} class="size-6" />
  <p class="text-base font-medium">
    {@render children?.()}
  </p>
</div>
