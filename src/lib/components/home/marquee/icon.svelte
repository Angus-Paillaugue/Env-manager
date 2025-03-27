<script lang="ts">
	import {
		Activity,
		Ban,
		Braces,
		Brain,
		Briefcase,
		Bug,
		Code,
		Database,
		EthernetPort,
		FileCode,
		FileKey,
		Fingerprint,
		FolderKey,
		GitBranch,
		Key,
		LockKeyhole
	} from 'lucide-svelte';

	const icons = [
		Activity,
		Ban,
		Braces,
		Brain,
		Bug,
		Briefcase,
		Code,
		Database,
		EthernetPort,
		FileCode,
		Fingerprint,
		FolderKey,
		FileKey,
		GitBranch,
		Key,
		LockKeyhole
	];
	const icon = icons[Math.floor(Math.random() * icons.length)];
	const _colors = [
		'text-red-400',
		'text-orange-400',
		'text-amber-400',
		'text-yellow-400',
		'text-lime-400',
		'text-green-400',
		'text-emerald-400',
		'text-teal-400',
		'text-cyan-400',
		'text-sky-400',
		'text-blue-400',
		'text-indigo-400',
		'text-violet-400',
		'text-purple-400',
		'text-fuchsia-400',
		'text-pink-400'
	];
	const colorClass = _colors[Math.floor(Math.random() * _colors.length)];
</script>

<div
	class="bg-card border-border relative size-20 overflow-hidden rounded border will-change-transform"
>
	<!-- Blurred effect -->
	<div class="absolute inset-0 flex items-center justify-center">
		<svelte:component
			this={icon}
			class="size-12 {colorClass} blur-md transition-opacity duration-200"
		/>
	</div>
	<!-- Actual icon -->
	<div class="absolute inset-0 flex items-center justify-center">
		<svelte:component this={icon} class="size-12 {colorClass} transition-opacity duration-200" />
	</div>
</div>
