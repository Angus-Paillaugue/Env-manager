<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { isMobile } from '$lib/utils';
	import MobileModal from './mobileModal.svelte';
	import DesktopModal from './desktopModal.svelte';
	import { portal } from '$lib/utils/portal.svelte';
	import Backdrop from './Backdrop.svelte';

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
	let portalElement = $state<HTMLElement | null>(null);

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
			// Focus the first input field in the modal
			if (!portalElement) return;
			const firstInput = portalElement.querySelector('input, textarea, select') as
				| HTMLInputElement
				| HTMLTextAreaElement
				| HTMLSelectElement;
			if (firstInput) {
				firstInput.focus();
			}
		} else {
			document.body.style.overflow = 'auto';
			if (onClose) onClose();
		}
	});
</script>

<Backdrop bind:open />

<div use:portal class="portal" bind:this={portalElement}>
	{#if isMobile.current}
		<MobileModal bind:open {children} {fullScreen} />
	{:else}
		<DesktopModal bind:open {children} />
	{/if}
</div>
