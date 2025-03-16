<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	const { children, ...restProps }: SvelteHTMLElements['option'] = $props();
</script>

<option {...restProps}>
	{@render children?.()}
</option>
