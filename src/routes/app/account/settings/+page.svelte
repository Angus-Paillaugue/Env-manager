<script lang="ts">
	import DangerZone from './danger-zone.svelte';
	import Security from './security.svelte';
	import General from './general.svelte';
	import { pageHeading } from '$lib/stores';
	import { handleForm } from '$lib/utils/formHandler';
	import { OctagonAlert, Shield, User } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let { form } = $props();
	let currentTabIndex = $state(0);

	pageHeading.set({
		title: 'Settings',
		description: 'Manage your account settings',
		breadcrumbs: [
			{ title: 'Account', href: '/app/account' },
			{ title: 'Settings', href: '/app/account/settings' }
		]
	});

	$effect(() => {
		handleForm(form, {
			onError: (error, action) => {
				console.error(`Error in action ${action}:`, error);
			}
		});
	});

	const changeTab = (index: number) => {
		currentTabIndex = index;
	};

	const sections = [
		{
			title: 'General',
			icon: User,
			description: 'Update your profile information.',
			component: General
		},
		{
			title: 'Security',
			description: 'Add an extra layer of security to your account.',
			icon: Shield,
			component: Security
		},
		{
			title: 'Danger Zone',
			description: 'Irreversible and destructive actions.',
			icon: OctagonAlert,
			component: DangerZone
		}
	];
</script>

<div
	class="bg-card border-border mt-12 grid w-full grid-cols-3 items-center justify-center overflow-hidden rounded border"
>
	{#each sections as section, i}
		<button
			class={cn(
				'flex w-full cursor-pointer flex-row items-center justify-center gap-2 bg-transparent p-2 font-medium transition-colors',
				i === currentTabIndex && 'bg-card-hover'
			)}
			onclick={() => changeTab(i)}
		>
			<section.icon class="size-5" />
			{section.title}
		</button>
	{/each}
</div>

<div class="border-border bg-card mt-6 flex w-full flex-col overflow-hidden rounded border">
	<div
		class="grid transition-transform duration-300"
		style="width: {sections.length *
			100}%;grid-template-columns: repeat({sections.length}, minmax(0, 1fr));transform: translateX(-{(currentTabIndex /
			sections.length) *
			100}%)"
	>
		{#each sections as section}
			<div class="flex w-full flex-col gap-4 p-4">
				<!-- Heading -->
				<div class="flex flex-col gap-1">
					<h2 class="text-xl font-medium">{section.title}</h2>
					<p class="text-muted text-sm">{section.description}</p>
				</div>
				<!-- Content -->
				<div class="flex flex-col gap-4">
					<section.component />
				</div>
			</div>
		{/each}
	</div>
</div>
