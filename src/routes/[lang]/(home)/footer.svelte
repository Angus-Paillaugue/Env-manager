<script lang="ts">
	import { Flag, Link, Select } from '$lib/components';
	import { locales, locale, setLocale } from '$lib/translations';
</script>

<footer class="bg-card border-border w-full border-t px-4 py-8">
	<div class="mx-auto grid max-w-screen-xl grid-cols-1 gap-8 md:grid-cols-2">
		<!-- About Section -->
		<div>
			<h2 class="text-lg font-bold">About</h2>
			<p class="text-muted mt-2 text-sm">
				Env-Manager simplifies environment variable management for teams, ensuring seamless
				collaboration and real-time updates.
			</p>

			<!-- Lang change -->
			<div class="mt-4 flex flex-col gap-2">
				<h2 class="text-lg font-bold">Language</h2>
				<Select
					onChange={(value) => {
						setLocale(value as string);
					}}
				>
					{#each $locales as l}
						<Select.Option value={l} selected={l === $locale}>
							<Flag class="size-4" lang={l} />
							{l}
						</Select.Option>
					{/each}
				</Select>
			</div>
		</div>

		<!-- Navigation Links -->
		<div>
			<h2 class="text-lg font-bold">Quick Links</h2>
			<ul class="mt-2 space-y-2">
				<li>
					<Link href="/app" class="text-muted hover:text-foreground">Dashboard</Link>
				</li>
				<li>
					<Link href="/auth/sign-up" class="text-muted hover:text-foreground">Sign Up</Link>
				</li>
				<li>
					<Link href="/auth/login" class="text-muted hover:text-foreground">Login</Link>
				</li>
				<li>
					<Link href="/help" class="text-muted hover:text-foreground">Help Center</Link>
				</li>
			</ul>
		</div>
	</div>

	<!-- Copyright Section -->
	<div class="border-border text-muted mt-8 border-t pt-4 text-center text-sm">
		&copy; {new Date().getFullYear()} Env-Manager. All rights reserved.
	</div>
</footer>
