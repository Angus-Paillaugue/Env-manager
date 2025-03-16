<script lang="ts">
	import { enhance } from '$app/forms';
	import { pageHeading } from '$lib/stores';
	import { Alert, Button, Input } from '$lib/components';

	let { form } = $props();
	let error = $state<string | null>(null);
	let isLoading = $state<boolean>(false);

	pageHeading.set({
		title: 'Create a project',
		description: 'Create a new project to manage your environments and variables',
		breadcrumbs: [
			{ title: 'Projects', href: '/app' },
			{ title: 'Create', href: '/app/projects/create' }
		]
	});

	$effect(() => {
		if (!form) return;
		if (form.error) error = form.error;
	});
</script>

<form
	action="?/create"
	method="POST"
	class="flex flex-col gap-4"
	use:enhance={() => {
		isLoading = true;
		return async ({ update }) => {
			isLoading = false;
			update({ reset: false });
		};
	}}
>
	<Input.Floating type="text" id="name" label="Name" />

	{#if error}
		<Alert.Danger>{error}</Alert.Danger>
	{/if}

	<Button loading={isLoading}>Create</Button>
</form>
