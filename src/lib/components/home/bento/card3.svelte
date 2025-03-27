<script lang="ts">
	import { onMount } from 'svelte';

	interface TextSegment {
		text: string;
		color?: string;
	}

	interface FormattedLine {
		type: 'formatted';
		content: TextSegment[];
	}

	type TerminalLine = string | FormattedLine;

	let terminalContent = $state<TerminalLine[]>([]);
	let teamTerminals = $state<TerminalLine[][]>([[], [], []]); // Simulating three team members' terminals
	let terminal = $state<HTMLElement | null>(null);
	let currentLine = $state<string>('');
	let cursor = $state<boolean>(true);
	let typingComplete = $state<boolean>(false);
	let animationActive = $state<boolean>(false);
	let typingInterval = $state<ReturnType<typeof setInterval> | null>(null);
	let timeoutIds = $state<ReturnType<typeof setTimeout>[]>([]);
	let restartTimeout = $state<ReturnType<typeof setTimeout> | null>(null);

	const commandToType: string = 'env-manager push NEW_VAR=secret123';

	async function typeCommand(command: string): Promise<void> {
		return new Promise((resolve) => {
			let i = 0;
			typingInterval = setInterval(() => {
				if (!animationActive) {
					clearInterval(typingInterval!);
					typingInterval = null;
					resolve();
					return;
				}

				currentLine += command[i];
				i++;
				if (i >= command.length) {
					clearInterval(typingInterval!);
					typingInterval = null;
					terminalContent = [...terminalContent, `$ ${currentLine}`];
					currentLine = '';
					const timeout = setTimeout(resolve, 500);
					timeoutIds.push(timeout);
				}
			}, 100);
		});
	}

	const scrollToBottom = (): void => {
		terminal?.scrollTo(0, terminal.scrollHeight);
	};

	async function syncToTeam(): Promise<void> {
		return new Promise((resolve) => {
			if (!animationActive) return resolve();

			// Simulate syncing across team members' terminals
			teamTerminals.forEach((terminal, index) => {
				const timeout = setTimeout(() => {
					if (!animationActive) return;
					teamTerminals[index] = [
						...teamTerminals[index],
						{
							type: 'formatted',
							content: [
								{ text: '⇢ ', color: 'text-green-400' },
								{ text: 'NEW_VAR=secret123', color: 'text-gray-300' }
							]
						}
					];
				}, index * 700);
				timeoutIds.push(timeout);
			});

			// Completion message
			const timeout = setTimeout(
				() => {
					if (!animationActive) return resolve();

					terminalContent = [
						...terminalContent,
						{
							type: 'formatted',
							content: [
								{ text: '✔ ', color: 'text-green-400' },
								{ text: 'Team members synced successfully!' }
							]
						}
					];

					resolve();
				},
				teamTerminals.length * 700 + 1000
			);
			timeoutIds.push(timeout);
		});
	}

	async function start() {
		cancel();

		terminalContent = [];
		teamTerminals = [[], [], []];
		currentLine = '';
		cursor = true;
		typingComplete = false;
		animationActive = true;

		await typeCommand(commandToType);
		if (!animationActive) return;

		await syncToTeam();
		if (!animationActive) return;

		typingComplete = true;

		// Restart animation after 2 seconds
		if (animationActive) {
			restartTimeout = setTimeout(() => {
				start();
			}, 2000);
		}
	}

	function cancel() {
		animationActive = false;

		if (typingInterval !== null) {
			clearInterval(typingInterval);
			typingInterval = null;
		}

		timeoutIds.forEach((id) => clearTimeout(id));
		timeoutIds = [];

		if (restartTimeout !== null) {
			clearTimeout(restartTimeout);
			restartTimeout = null;
		}

		terminalContent = [];
		teamTerminals = [[], [], []];
		currentLine = '';
		cursor = true;
		typingComplete = false;
	}

	$effect(() => {
		scrollToBottom();
	});

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						start();
					} else {
						cancel();
					}
				}
			},
			{ threshold: 0.5 }
		);
		if (terminal) observer.observe(terminal);

		return () => observer.disconnect();
	});
</script>

<div class="flex h-full grow flex-col items-center justify-between gap-4 p-4">
	<div
		class="no-scrollbar border-border bg-background flex w-full flex-col gap-2 overflow-x-hidden overflow-y-auto rounded-md border p-4 font-mono text-sm"
		bind:this={terminal}
	>
		{#each terminalContent as line}
			{#if typeof line === 'string'}
				<div class="break-all">{line}</div>
			{:else if line.type === 'formatted'}
				<div>
					{#each line.content as segment}
						<span class={segment.color}>{segment.text}</span>
					{/each}
				</div>
			{/if}
		{/each}

		{#if !typingComplete}
			<p class="whitespace-pre">
				$ {currentLine}{#if cursor}<span class="cursor-blink">█</span>{/if}
			</p>
		{:else}
			<div class="whitespace-pre">
				$ {#if cursor}<span class="cursor-blink">█</span>{/if}
			</div>
		{/if}
	</div>

	<!-- Team Member Terminals -->
	<div class="flex-wo flex w-full items-end gap-2">
		{#each teamTerminals as teamTerminal, index}
			<div
				class="no-scrollbar border-border bg-background flex h-fit w-1/3 flex-col gap-2 overflow-x-hidden overflow-y-auto rounded-md border p-4 font-mono text-sm"
			>
				<div class="text-foreground font-bold">Dev {index + 1}</div>
				{#each teamTerminal as line}
					{#if typeof line === 'string'}
						<div class="break-all">{line}</div>
					{:else if line.type === 'formatted'}
						<div>
							{#each line.content as segment}
								<span class={segment.color}>{segment.text}</span>
							{/each}
						</div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.cursor-blink {
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
