<script lang="ts">
	import { Card } from '$lib/components';
	import { pageHeading } from '$lib/stores';

	$pageHeading = {
		title: 'Success',
		description: 'Your device is now connected.'
	};
</script>

<div class="p-2">
	<Card class="mx-auto w-full max-w-screen-sm" hoverEffect={true}>
		<Card.Heading>Success</Card.Heading>
		<div class="mt-4 flex flex-col">
			<p class="text-lg">Congratulations, you're all set!</p>
			<p>Your device is now connected.</p>
		</div>
	</Card>
</div>
