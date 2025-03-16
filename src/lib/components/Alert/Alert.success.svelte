<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import Alert from './Alert.svelte';

	const { children, ...props }: SvelteHTMLElements['div'] = $props();
</script>

<Alert {...props} variant="success">
	{@render children?.()}
</Alert>
