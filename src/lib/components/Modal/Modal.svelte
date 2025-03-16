<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { isMobile } from '$lib/utils';
	import MobileModal from './mobileModal.svelte';
	import DesktopModal from './desktopModal.svelte';

	interface MyProps {
		open: boolean;
		fullScreen?: boolean;
		onClose?: () => void;
	}

	let {
		open = $bindable(false),
		fullScreen = false,
		onClose,
		children
	}: SvelteHTMLElements['div'] & MyProps = $props();
</script>

{#if isMobile.current}
	<MobileModal bind:open {children} {onClose} {fullScreen} />
{:else}
	<DesktopModal bind:open {children} {onClose} />
{/if}
