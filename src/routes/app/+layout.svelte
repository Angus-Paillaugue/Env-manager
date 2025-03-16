<script lang="ts">
	import Header from './header.svelte';
	import Sidebar from './sidebar.svelte';

	let { children, data } = $props();
	let { projects } = data;
</script>

<div class="flex h-svh w-full flex-row">
	<Sidebar {projects} />
	<div class="flex w-full flex-col overflow-auto">
		<Header />
		<main class="max-w-screen-bp mx-auto mt-4 w-full px-2">
			{@render children?.()}
		</main>
	</div>
</div>
