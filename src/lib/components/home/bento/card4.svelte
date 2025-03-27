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
	let terminal = $state<HTMLElement | null>(null);
	let currentLine = $state<string>('');
	let cursor = $state<boolean>(true);
	let typingComplete = $state<boolean>(false);
	let animationActive = $state<boolean>(false);
	let typingInterval = $state<ReturnType<typeof setInterval> | null>(null);
	let timeoutIds = $state<ReturnType<typeof setTimeout>[]>([]);
	let restartTimeout = $state<ReturnType<typeof setTimeout> | null>(null);

	const commandToType: string = 'env-manager push';
	const variablesToPush: string[] = [
		'POSTGRES_PASSWORD=********',
		'POSTGRES_USER=postgres',
		'POSTGRES_DB=Env-manager',
		'JWT_SECRET=******************************************'
	];

	async function typeCommand(command: string): Promise<void> {
		return new Promise((resolve) => {
			let i: number = 0;
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

	function executeCommand(): Promise<void> {
		return new Promise((resolve) => {
			if (!animationActive) return resolve();

			// Message de début d'envoi
			terminalContent = [
				...terminalContent,
				{
					type: 'formatted',
					content: [
						{ text: 'ℹ ', color: 'text-blue-400' },
						{ text: 'Pushing variables to project ' },
						{ text: 'Env-manager', color: 'text-cyan-400' },
						{ text: '...' }
					]
				}
			];

			const timeout1 = setTimeout(() => {
				if (!animationActive) return resolve();

				// Affichage progressif des variables en cours d'envoi
				variablesToPush.forEach((variable, index) => {
					const timeout = setTimeout(() => {
						if (!animationActive) return;
						terminalContent = [
							...terminalContent,
							{
								type: 'formatted',
								content: [
									{ text: '⇢ ', color: 'text-yellow-400' },
									{ text: variable, color: 'text-gray-300' }
								]
							}
						];
					}, index * 500);
					timeoutIds.push(timeout);
				});

				// Message de fin
				const timeout2 = setTimeout(
					() => {
						if (!animationActive) return resolve();

						terminalContent = [
							...terminalContent,
							{
								type: 'formatted',
								content: [
									{ text: '✔ ', color: 'text-green-400' },
									{ text: 'Variables pushed successfully!' }
								]
							}
						];

						resolve();
					},
					variablesToPush.length * 500 + 1000
				);
				timeoutIds.push(timeout2);
			}, 1000);
			timeoutIds.push(timeout1);
		});
	}

	async function start() {
		// Cancel any existing animations first
		cancel();

		terminalContent = [];
		currentLine = '';
		cursor = true;
		typingComplete = false;
		animationActive = true;

		await typeCommand(commandToType);
		if (!animationActive) return;

		await executeCommand();
		if (!animationActive) return;

		typingComplete = true;

		// Set up restart timer - restart after 2 seconds
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

		// Clear all timeout IDs
		timeoutIds.forEach((id) => clearTimeout(id));
		timeoutIds = [];

		// Clear restart timeout if it exists
		if (restartTimeout !== null) {
			clearTimeout(restartTimeout);
			restartTimeout = null;
		}

		terminalContent = [];
		currentLine = '';
		cursor = true;
		typingComplete = false;
	}

	$effect(() => {
		scrollToBottom();
	});

	onMount(() => {
		// Check if the card is in view
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

<div
	class="text-foreground no-scrollbar w-full grow overflow-x-hidden overflow-y-auto p-4 font-mono text-sm"
	bind:this={terminal}
>
	{#each terminalContent as line}
		{#if typeof line === 'string'}
			<div class="mb-1 break-all">{line}</div>
		{:else if line.type === 'formatted'}
			<div class="mb-1">
				{#each line.content as segment}
					<span class={segment.color}>{segment.text}</span>
				{/each}
			</div>
		{/if}
	{/each}

	{#if !typingComplete}
		<p class="mb-1 whitespace-pre">
			$ {currentLine}{#if cursor}<span class="cursor-blink">█</span>{/if}
		</p>
	{:else}
		<div class="mb-1 whitespace-pre">
			$ {#if cursor}<span class="cursor-blink">█</span>{/if}
		</div>
	{/if}
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
