<script lang="ts">
	import Hero from '$lib/components/home/hero/hero.svelte';
	import { pageHeading } from '$lib/stores';
	import Workflow from '$lib/components/home/workflow/workflow.svelte';
	// import Marquee from '$lib/components/home/marquee/marquee.svelte';
	import Bento from '$lib/components/home/bento/bento.svelte';

	$pageHeading = {
		title: 'Home',
		description: "Env manager's home page"
	};
</script>

<Hero />

<!-- <Marquee /> -->

<Bento />

<Workflow />
