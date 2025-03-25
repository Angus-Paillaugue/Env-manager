<script lang="ts">
	import Terminal from './terminal.svelte';
	import { SECTION_HEIGHT } from '$lib/components/home/utils';
	import { SquareTerminal } from 'lucide-svelte';
	import OrbitingCircles from './OrbitingCircles.svelte';
	import Pill from '../pill.svelte';
	import Encrypt from './encrypt.svelte';
</script>

<section class="flex flex-col px-2 py-12 lg:px-10 lg:py-24" style="min-height: {SECTION_HEIGHT};">
	<div class="mx-auto flex max-w-screen-2xl grow flex-col items-center justify-center gap-10">
		<Pill>
			<SquareTerminal class="size-4" />
			Integration
		</Pill>
		<div class="flex flex-col items-center justify-center gap-2">
			<h1 class="text-4xl font-bold">With us, integrating has never been easier</h1>
			<p class="text-muted text-base">
				Effortlessly switch to Env-Manager on new or existing projects. No need to change your
				workflow or learn new tools.
			</p>
		</div>
		<div class="grid h-fit grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-10 xl:grid-cols-3">
			<div
				class="bg-card border-border flex h-[470px] flex-col items-start gap-2 rounded-lg border p-4"
			>
				<span
					class="bg-card-hover text-foreground rounded px-2 py-1 font-mono text-base font-medium"
				>
					01
				</span>
				<p class="text-lg font-medium">Connect your projects</p>
				<p class="text-muted text-sm">
					Since environment variables are universal and language/framework agnostic, no special
					integration is needed.
				</p>

				<div class="relative flex w-full grow flex-col overflow-hidden">
					<OrbitingCircles />
				</div>
			</div>
			<div
				class="bg-card border-border flex h-[470px] flex-col items-start gap-2 rounded-lg border p-4"
			>
				<span
					class="bg-card-hover text-foreground rounded px-2 py-1 font-mono text-base font-medium"
				>
					02
				</span>
				<p class="text-lg font-medium">Secure & Manage with Ease</p>
				<p class="text-muted text-sm">
					Your environment variables are safely stored and easily accessible. Control access and
					update values effortlessly.
				</p>

				<div class="relative flex w-full grow flex-col overflow-hidden">
					<Encrypt />
				</div>
			</div>
			<Terminal />
		</div>
	</div>
</section>
