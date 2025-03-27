<script lang="ts">
	interface MyProps {
		startAnimation: boolean;
	}

	let { startAnimation }: MyProps = $props();

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

	const commandToType: string = 'env-manager pull';
	const catCommand: string = 'cat .env.prod';
	const envFileLines: string[] = [
		'API_KEY=********',
		'DATABASE_URL=postgres://user:password@host:5432/db',
		'REDIS_URL=redis://localhost:6379',
		'AWS_ACCESS_KEY=AKIA****************',
		'AWS_SECRET_KEY=**************************************',
		'STRIPE_SECRET=sk_test_*******************************',
		'JWT_SECRET=******************************************'
	];

	// Function to simulate typing
	function typeCommand(command: string): Promise<void> {
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
		const nbLines = terminalContent.filter((line) => typeof line === 'string').length; // Used just for the terminalContent ref to run the effect
		terminal?.scrollTo(0, terminal.scrollHeight);
	};

	// Function to simulate command execution
	function executeCommand(): Promise<void> {
		return new Promise((resolve) => {
			if (!animationActive) return resolve();

			// Line 1 with blue info icon and cyan project/env names
			terminalContent = [
				...terminalContent,
				{
					type: 'formatted',
					content: [
						{ text: 'ℹ ', color: 'text-blue-400' },
						{ text: 'Pulling variables for project ' },
						{ text: 'Env-manager', color: 'text-cyan-400' },
						{ text: ' and environment ' },
						{ text: 'Prod', color: 'text-cyan-400' },
						{ text: '...' }
					]
				}
			];

			const timeout1 = setTimeout(() => {
				if (!animationActive) return resolve();

				// Line 2 with green checkmark and cyan filename
				terminalContent = [
					...terminalContent,
					{
						type: 'formatted',
						content: [
							{ text: '✔ ', color: 'text-green-400' },
							{ text: 'Enter the filename to save the variables ' },
							{ text: '.env.prod', color: 'text-cyan-400' }
						]
					}
				];

				const timeout2 = setTimeout(() => {
					if (!animationActive) return resolve();

					// Line 3 with green checkmark and cyan filename
					terminalContent = [
						...terminalContent,
						{
							type: 'formatted',
							content: [
								{ text: '✔ ', color: 'text-green-400' },
								{ text: 'Variables saved to ' },
								{ text: '.env.prod', color: 'text-cyan-400' }
							]
						}
					];

					const timeout3 = setTimeout(resolve, 800);
					timeoutIds.push(timeout3);
				}, 1000);
				timeoutIds.push(timeout2);
			}, 800);
			timeoutIds.push(timeout1);
		});
	}

	function displayCatCommand(): Promise<void> {
		return new Promise(async (resolve) => {
			if (!animationActive) return resolve();

			await typeCommand(catCommand);
			if (!animationActive) return resolve();

			// Display the env file content as if cat command output
			envFileLines.forEach((line) => {
				terminalContent = [...terminalContent, line];
			});

			const timeout = setTimeout(resolve, 500);
			timeoutIds.push(timeout);
		});
	}

	async function start() {
		// Prevent starting a new animation if one is already running
		if (animationActive) return;

		terminalContent = [];
		currentLine = '';
		cursor = true;
		typingComplete = false;
		animationActive = true;

		await typeCommand(commandToType);
		if (!animationActive) return;

		await executeCommand();
		if (!animationActive) return;

		await displayCatCommand();
		if (!animationActive) return;

		typingComplete = true;
	}

	function cancel() {
		// Don't do anything if animation is already stopped
		if (!animationActive) return;

		// Set animation flag to false to stop further progression
		animationActive = false;

		// Clear any active interval
		if (typingInterval !== null) {
			clearInterval(typingInterval);
			typingInterval = null;
		}

		// Clear all active timeouts
		timeoutIds.forEach((id) => clearTimeout(id));
		timeoutIds = [];

		// Reset terminal state
		terminalContent = [];
		currentLine = '';
		cursor = true;
		typingComplete = false;
	}

	// Keep track of the last value to prevent redundant calls
	let lastStartAnimationValue = $state(false);

	$effect(() => {
		if (startAnimation === lastStartAnimationValue) return;

		lastStartAnimationValue = startAnimation;

		if (startAnimation) {
			start();
		} else {
			cancel();
		}
	});

	$effect(() => {
		scrollToBottom();
	});
</script>

<div
	class="text-foreground no-scrollbar w-full grow overflow-y-auto font-mono text-sm"
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

<!-- The only CSS we need is for the cursor blinking animation -->
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
