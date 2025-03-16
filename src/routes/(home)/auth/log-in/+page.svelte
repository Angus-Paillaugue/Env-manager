<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, Button, Card, Input } from '$lib/components';
	import Link from '$lib/components/Link/Link.svelte';

	let { form } = $props();
	let isLoading = $state<boolean>(false);
	let error = $state<string | null>(null);

	$effect(() => {
		if (!form) return;

		if (form.error) {
			error = form.error;
		}
	});
</script>

<div class="mx-auto w-full max-w-lg p-2">
	<Card>
		<Card.Heading>Log-in</Card.Heading>
		<form
			action="?/logIn"
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
			<Input.Floating type="password" id="password" label="Password" />
			{#if error}
				<Alert.Danger>{error}</Alert.Danger>
			{/if}
			<Button variant="primary" class="w-full" loading={isLoading}>Submit</Button>

			<p class="mt-4">No account ? <Link href="/auth/sign-up">Sign up.</Link></p>
		</form>
	</Card>
</div>
