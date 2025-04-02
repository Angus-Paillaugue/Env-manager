<script lang="ts">
	import Footer from './footer.svelte';
	import Navbar from './navbar.svelte';

	let { children } = $props();
</script>

<div class="flex h-svh flex-col">
	<Navbar />

	<div class="flex h-full grow flex-col overflow-hidden p-2 !pt-0 lg:p-4">
		<main
			class="border-border no-scrollbar grow overflow-x-hidden overflow-y-auto rounded-lg border"
		>
			{@render children?.()}
			<Footer />
		</main>
	</div>
</div>
