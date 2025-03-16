<script lang="ts">
	import { fade } from 'svelte/transition';
	import { TRANSITION_DURATION } from '.';

	interface MyProps {
		open: boolean;
		duration?: number;
	}
	let { open = $bindable(false), duration = TRANSITION_DURATION }: MyProps = $props();

	function handleWindowKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			open = false;
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeyDown} />

{#if open}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		aria-label="Close sidebar"
		class="bg-background/50 fixed inset-0 z-40 backdrop-blur-xs"
		onclick={() => (open = false)}
		transition:fade={{ duration }}
	></div>
{/if}
