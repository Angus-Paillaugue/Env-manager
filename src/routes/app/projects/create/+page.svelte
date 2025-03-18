<script lang="ts">
	import { enhance } from '$app/forms';
	import { pageHeading } from '$lib/stores';
	import { Alert, Button, Input } from '$lib/components';

	let { form } = $props();
	let isLoading = $state<boolean>(false);

	pageHeading.set({
		title: 'Create a project',
		description: 'Create a new project to manage your environments and variables',
		breadcrumbs: [
			{ title: 'Projects', href: '/app' },
			{ title: 'Create', href: '/app/projects/create' }
		]
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
	<Input.Floating type="text" id="name" label="Name" autofocus={true} autocomplete="off" />

	{#if form && form.ok === false && form?.action === 'editEnvironment' && form.error}
		<Alert.Danger>{form.error}</Alert.Danger>
	{/if}

	<Button loading={isLoading}>Create</Button>
</form>
