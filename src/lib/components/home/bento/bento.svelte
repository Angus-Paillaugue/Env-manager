<script lang="ts">
	import { SECTION_HEIGHT } from '$lib/components/home/utils';
	import { CloudUpload } from 'lucide-svelte';
	import Card1 from './card1.svelte';
	import Card2 from './card2.svelte';
	import Card3 from './card3.svelte';
	import Card4 from './card4.svelte';
	import Pill from '../pill.svelte';
</script>

<section class="px-2 py-12 lg:px-10 lg:py-24" style="min-height: {SECTION_HEIGHT};" id="features">
	<div
		class="mx-auto flex w-full max-w-screen-2xl grow flex-col items-center justify-center gap-10"
	>
		<!-- Heading -->
		<Pill>
			<CloudUpload class="size-4" />
			Live Sync
		</Pill>
		<div class="flex flex-col items-center justify-center gap-2">
			<h1 class="text-4xl font-bold">Real-time Collaboration</h1>
			<p class="text-muted text-base">
				Push once, sync everywhere. Instantly update environment variables across your entire team.
			</p>
		</div>

		<div class="flex w-full flex-col gap-4 lg:gap-10">
			<!-- First row -->
			<div class="grid gap-4 lg:grid-cols-3 lg:gap-10">
				<div
					class="bg-card border-border flex flex-col justify-between rounded-lg border lg:col-span-1"
				>
					<p class="m-4 text-center text-2xl font-bold">Control Who Sees What</p>
					<div class="relative flex grow flex-col overflow-hidden">
						<Card1 />
					</div>
					<div
						class="border-border flex w-full flex-col items-center justify-center border-t p-4 text-center"
					>
						<p class="text-muted text-base">
							Share variables securely with teammates. Assign roles and ensure sensitive data is
							only accessible to the right people.
						</p>
					</div>
				</div>

				<div
					class="bg-card border-border flex flex-col justify-between rounded-lg border lg:col-span-2"
				>
					<p class="m-4 text-center text-2xl font-bold">All Your Variables, One Secure Hub</p>
					<div class="relative w-full grow overflow-hidden max-lg:h-[400px]">
						<Card2 />
					</div>
					<div
						class="border-border flex w-full flex-col items-center justify-center border-t p-4 text-center"
					>
						<p class="text-muted text-base">
							Easily manage environment variables for all your projects in one place, with a clean
							UI and powerful CLI.
						</p>
					</div>
				</div>
			</div>

			<!-- Second row -->
			<div class="grid gap-4 lg:grid-cols-3 lg:gap-10">
				<div
					class="bg-card border-border flex flex-col justify-between rounded-lg border lg:col-span-2"
				>
					<p class="m-4 text-center text-2xl font-bold">
						Effortless Collaboration with Shared Variables
					</p>
					<div class="relative h-[300px] w-full grow overflow-hidden">
						<Card3 />
					</div>
					<div
						class="border-border flex w-full flex-col items-center justify-center border-t p-4 text-center"
					>
						<p class="text-muted text-base">
							With env-manager, teams stay in sync. Add a variable once, and it instantly reaches
							every team member—no more outdated .env files!
						</p>
					</div>
				</div>

				<div
					class="border-border flex flex-col items-center justify-between overflow-hidden rounded-lg border-2 border-dashed lg:col-span-1"
				>
					<p class="m-4 text-center text-2xl font-bold">Sync Variables in Seconds</p>
					<div class="relative w-full grow overflow-hidden">
						<Card4 />
					</div>
					<div
						class="border-border bg-card flex w-full flex-col items-center justify-center border-t-2 border-dashed p-4 text-center"
					>
						<p class="text-muted text-base">
							Pull and push environment variables seamlessly between your local setup and the cloud,
							keeping everything up to date.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
