<!-- Unused page because we do not provide a SMTP server yet -->

<script lang="ts">
	import { Button, Card } from '$lib/components';
	import { pageHeading } from '$lib/stores';
	import { Cog } from 'lucide-svelte';

	$pageHeading = {
		title: '2FA unlinked',
		description:
			'Your two-factor authentication has been successfully removed. You can re-enable it at any time in your account settings.',

		breadcrumbs: [
			{ title: 'Account', href: '/app/account' },
			{ title: 'Settings', href: '/app/account/settings' },
			{ title: '2FA unlinked', href: '/app/account/settings/totp/unlink' }
		]
	};
</script>

<div class="flex h-full flex-col items-center justify-center">
	<Card class="w-full max-w-screen-lg">
		<Card.Heading>2FA unlinked</Card.Heading>

		<div class="flex flex-col gap-4">
			<p>
				Your two-factor authentication has been successfully removed. You can re-enable it at any
				time in your account settings.
			</p>

			<Button href="/app/account/settings">
				Go back to settings
				<Cog class="size-5" />
			</Button>
		</div>
	</Card>
</div>
