<script lang="ts">
	import { Card } from '$lib/components';
	import { pageHeading } from '$lib/stores';
	import { DoorOpen, Settings } from 'lucide-svelte';

	pageHeading.set({
		title: 'Account',
		description: 'Manage your account',
		breadcrumbs: [{ title: 'Account', href: '/app/account' }]
	});
</script>

<section class="mt-12 grid grid-cols-3 gap-4">
	<Card href="/app/account/settings" class="group flex-row items-center gap-4 rounded">
		<div
			class="border-border text-muted bg-background group-hover:bg-primary group-hover:text-primary-foreground rounded-full border p-1.5 font-mono text-base font-bold transition-colors"
		>
			<Settings class="size-4" />
		</div>
		Settings
	</Card>

	<Card href="/log-out" class="group flex-row items-center gap-4 rounded">
		<div
			class="border-border text-muted bg-background group-hover:bg-primary group-hover:text-primary-foreground rounded-full border p-1.5 font-mono text-base font-bold transition-colors"
		>
			<DoorOpen class="size-4" />
		</div>
		Log-out
	</Card>
</section>
