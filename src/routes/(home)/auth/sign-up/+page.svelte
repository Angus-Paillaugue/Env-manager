<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, Button, Card, Input, Link } from '$lib/components';
	import { pageHeading } from '$lib/stores';

	$pageHeading = {
		title: 'Sign-up',
		description: 'Create a new account.'
	};

	let { form } = $props();
	let isLoading = $state<boolean>(false);
</script>

<div class="mx-auto w-full max-w-lg p-2">
	<Card>
		<Card.Heading>Sign-up</Card.Heading>
		<form
			action="?/signUp"
			method="POST"
			class="mt-8 flex flex-col gap-4"
			use:enhance={() => {
				isLoading = true;
				return async ({ update }) => {
					isLoading = false;
					update({ reset: false });
				};
			}}
		>
			<Input.Floating type="text" id="email" label="Email" />
			<Input.Floating type="text" id="username" label="Username" />
			<Input.Floating type="password" id="password" label="Password" />
			{#if form && form.ok === false && form.action === 'signUp'}
				<Alert.Danger>{form.error}</Alert.Danger>
			{/if}
			<Button variant="primary" class="w-full" loading={isLoading}>Submit</Button>

			<p>Already have an account? <Link href="/auth/log-in">Log in.</Link></p>
		</form>
	</Card>
</div>
