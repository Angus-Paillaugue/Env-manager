<script lang="ts">
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	let hovered = false;
	const rows = 30; // Number of rows
	const cols = 55; // Number of columns
	let targetText = 'Secure & Easy';
	let grid: string[][] = [];
	let isTarget: boolean[][] = [];
	let isRevealed: boolean[][] = []; // Track which letters are revealed
	let characters =
		"!@#$%^&*()_+-=[]{}|;':,.<>?/~0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let scrambleInterval: ReturnType<typeof setTimeout> | null = null;
	let targetIndices: [number, number][] = []; // Store indices of target letters

	function getRandomChar() {
		return characters.charAt(Math.floor(Math.random() * characters.length));
	}

	function generateGrid() {
		grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => getRandomChar()));
		isTarget = Array.from({ length: rows }, () => Array.from({ length: cols }, () => false));
		isRevealed = Array.from({ length: rows }, () => Array.from({ length: cols }, () => false));

		let midRow = Math.floor(rows / 2);
		let startCol = Math.floor((cols - targetText.length) / 2);

		// Store target indices for later use
		targetIndices = [];
		targetText.split('').forEach((_, i) => {
			if (startCol + i < cols) {
				isTarget[midRow][startCol + i] = true;
				targetIndices.push([midRow, startCol + i]);
			}
		});
	}

	function scrambleEffect(reveal = false) {
		let steps = 15;
		let currentStep = 0;
		if (scrambleInterval) clearInterval(scrambleInterval);

		// Reset revealed state when starting a new scramble effect
		if (!reveal) {
			isRevealed = Array.from({ length: rows }, () => Array.from({ length: cols }, () => false));
		}

		// Clone target indices for random selection
		let unrevealed = [...targetIndices];
		let revealedCount = 0;
		let totalToReveal = targetIndices.length;

		// Calculate how many letters to reveal per step
		let revealPerStep = Math.ceil(totalToReveal / steps);

		scrambleInterval = setInterval(() => {
			// Create a new grid with random characters
			grid = grid.map((row, rowIndex) =>
				row.map((colChar, colIndex) => {
					if (isTarget[rowIndex][colIndex] && isRevealed[rowIndex][colIndex]) {
						// If it's a target cell that has been revealed, show the actual letter
						let targetIdx = colIndex - Math.floor((cols - targetText.length) / 2);
						return targetText[targetIdx];
					}
					return getRandomChar();
				})
			);

			// Reveal some letters if we're in reveal mode
			if (reveal && unrevealed.length > 0) {
				// Determine how many letters to reveal this step based on progress
				let toReveal = Math.min(
					Math.floor(revealPerStep * (currentStep + 1)) - revealedCount,
					unrevealed.length
				);

				for (let i = 0; i < toReveal; i++) {
					if (unrevealed.length === 0) break;
					let randomIndex = Math.floor(Math.random() * unrevealed.length);
					let [row, col] = unrevealed.splice(randomIndex, 1)[0];
					let targetIdx = col - Math.floor((cols - targetText.length) / 2);
					grid[row][col] = targetText[targetIdx];
					isRevealed[row][col] = true; // Mark this letter as revealed
					revealedCount++;
				}
			}

			currentStep++;
			if (currentStep >= steps) {
				if (scrambleInterval) clearInterval(scrambleInterval);

				if (reveal) {
					// Make sure all target letters are revealed
					let midRow = Math.floor(rows / 2);
					let startCol = Math.floor((cols - targetText.length) / 2);
					targetText.split('').forEach((char, i) => {
						if (startCol + i < cols) {
							grid[midRow][startCol + i] = char;
							isRevealed[midRow][startCol + i] = true;
						}
					});
				}

				if (!hovered) {
					generateGrid();
				}
			}
		}, 50);
	}

	onMount(generateGrid);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="text-muted group absolute inset-0 flex flex-col items-center justify-center font-mono select-none"
	onmouseenter={() => {
		hovered = true;
		scrambleEffect(true);
	}}
	onmouseleave={() => {
		hovered = false;
		scrambleEffect(false);
	}}
	onclick={() => {
		hovered = !hovered;
		scrambleEffect(hovered);
	}}
	style="--size: {cols}"
>
	{#each grid as row, i}
		<div class="flex justify-center">
			{#each row as char, j}
				<span
					class={cn(
						'text-base whitespace-pre transition-colors',
						isTarget[i][j] && isRevealed[i][j] && 'text-foreground font-bold'
					)}>{char}</span
				>
			{/each}
		</div>
	{/each}
</div>

<div
	class="pointer-events-none absolute inset-0"
	style="background: radial-gradient(closest-side, transparent,var(--color-card) 100%);"
></div>
