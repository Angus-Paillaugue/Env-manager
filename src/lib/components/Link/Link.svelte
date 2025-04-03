<script lang="ts">
  import { localizeHref } from '$lib/translations';
  import { cn } from '$lib/utils';
  import type { SvelteHTMLElements } from 'svelte/elements';

  const { class: className, children, ...restProps }: SvelteHTMLElements['a'] = $props();

  const baseClasses = 'text-primary font-medium underline hover:no-underline';

  const finalClasses = cn(baseClasses, className);

  let href = $state('href' in restProps ? restProps.href : undefined);
  if ('href' in restProps) {
    if (restProps.href) {
      href = localizeHref(restProps.href);
    }
  }
</script>

<a class={finalClasses} {...restProps} {href}>
  {@render children?.()}
</a>
