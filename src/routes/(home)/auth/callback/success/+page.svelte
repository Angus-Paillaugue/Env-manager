<script lang="ts">
	import { Card } from '$lib/components';
	import { pageHeading } from '$lib/stores';
	import { SECTION_HEIGHT } from '../../../layout';

	$pageHeading = {
		title: 'Success',
		description: 'Your device is now connected.'
	};
</script>

<div class="p-2 flex flex-col items-center justify-center" style="height: {SECTION_HEIGHT};">
	<Card class="w-full max-w-lg" hoverEffect={true}>
		<Card.Heading>Success</Card.Heading>
		<div class="mt-4 flex flex-col">
			<p class="text-lg">Congratulations, you're all set!</p>
			<p>Your device is now connected.</p>
		</div>
	</Card>
</div>
