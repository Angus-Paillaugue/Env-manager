<script lang="ts">
	import Header from './header.svelte';
	import Sidebar from './sidebar.svelte';

	let { children } = $props();
</script>

<div class="flex h-svh w-full flex-col-reverse lg:flex-row">
	<Sidebar />
	<div class="flex w-full grow flex-col overflow-auto">
		<Header />
		<main class="max-w-screen-bp mx-auto mt-4 w-full px-2">
			{@render children?.()}
		</main>
	</div>
</div>
