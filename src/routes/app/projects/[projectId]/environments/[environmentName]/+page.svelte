<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Alert, Button, Card, Hr, Input, Modal } from '$lib/components';
	import { pageHeading } from '$lib/stores';
	import type { Environment, Variable } from '$lib/types';
	import { cn } from '$lib/utils';
	import { Eye, EyeClosed, Key, Plus } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import Action from './action.svelte';
	import { flip } from 'svelte/animate';
	import { handleForm } from '$lib/utils/formHandler.svelte';

	interface HiddenVariable extends Variable {
		hidden: boolean;
	}

	interface MyEnvironment extends Environment {
		variables: HiddenVariable[];
	}

	let { data, form } = $props();
	let environment = $state<MyEnvironment>({
		...data.environment,
		variables: transformEnvVariables(data.environment)
	});
	let createVariableModalOpen = $state(false);
	let isCreatingVariable = $state(false);
	let envFileFiles = $state<FileList>();
	let createVariableForm = $state<HTMLFormElement>();

	$effect(() => {
		pageHeading.set({
			title: environment.name + ' environment',
			description: `Manage variables in the <b>${environment.name}</b> environment of the <b>${page.data.project.name}</b> project`,
			breadcrumbs: [
				{ title: 'Projects', href: '/app' },
				{ title: page.data.project.name, href: '/app/projects/' + page.data.project.id },
				{
					title: environment.name,
					href: '/app/projects/' + page.data.project.id + '/environments/' + environment.name
				}
			],
			seo: {
				title: data.project.name + ' - ' + environment.name
			}
		});
	});

	// For refreshing page data after navigation on the same page but with a different path param
	$effect(() => {
		environment = {
			...data.environment,
			variables: transformEnvVariables(data.environment)
		};
	});

	// Transform the environment variables to include a hidden property
	function transformEnvVariables(env: Environment): HiddenVariable[] {
		return (env.variables ?? []).map((variable) => {
			return {
				...variable,
				hidden: true
			};
		});
	}

	handleForm(form, {
		onSuccess: (body, action) => {
			switch (action) {
				case 'createVariable':
					const newEnv = body as unknown as Environment;
					environment = {
						...newEnv,
						variables: transformEnvVariables(newEnv)
					};
					createVariableModalOpen = false;
					break;
				case 'deleteVariable':
					environment.variables = environment.variables.filter(
						(v) => v.id !== (body as Variable['id'])
					);
					break;
				case 'editVariable':
					const editedVariable = body as Variable;
					const index = environment.variables.findIndex((v) => v.id === editedVariable.id);
					environment.variables[index] = {
						...editedVariable,
						hidden: environment.variables[index].hidden
					};
					break;
				default:
					console.error('Unknown action', action);
			}
		},
		onError: (error, action) => {
			console.error(`Error in action ${action}:`, error);
		}
	});

	// Handle the form submission when an env file is selected
	$effect(() => {
		if (!envFileFiles || !createVariableForm) return;
		if (envFileFiles.length === 0) return;
		createVariableForm.submit();
	});

	function copyVariable(variable: Variable) {
		navigator.clipboard.writeText(variable.value);
	}

	function toggleVariableVisibility(variable: HiddenVariable) {
		if (!environment.variables) return;
		if (!variable.hidden) {
			variable.hidden = true;
			return;
		}
		environment.variables?.forEach((v) => (v.hidden = true));
		variable.hidden = !variable.hidden;
	}
</script>

<!-- Create variable modal -->
<Modal bind:open={createVariableModalOpen}>
	<Modal.Heading>
		<Modal.Title>Create a variable</Modal.Title>
		<Modal.Description
			>Create a new variable in the <b>{environment.name}</b> environment</Modal.Description
		>
	</Modal.Heading>
	<form
		method="POST"
		bind:this={createVariableForm}
		action="?/createVariable"
		class="flex w-full flex-col gap-2"
		enctype="multipart/form-data"
		use:enhance={() => {
			isCreatingVariable = true;
			return async ({ update }) => {
				isCreatingVariable = false;
				update({ reset: false });
			};
		}}
	>
		<div class="flex flex-col gap-2">
			<h3 class="text-lg font-medium">Import a .env file</h3>
			<Input.File
				id="envFile"
				placeholder="Choose a .env file"
				accept=".env, .env.*"
				bind:files={envFileFiles}
			/>
		</div>
		<Hr text="OR" />
		<h3 class="text-lg font-medium">Enter it manually</h3>
		<div class="grid grid-cols-2 gap-4">
			<Input type="text" id="variableName" label="Key" placeholder="e.g. API_KEY" />
			<Input type="text" id="variableValue" label="Value" />
		</div>
		{#if form && form.ok === false && form?.action === 'createVariable' && form.error}
			<Alert.Danger>{form.error}</Alert.Danger>
		{/if}
		<Modal.Actions>
			<Button type="button" variant="secondary" onclick={() => (createVariableModalOpen = false)}
				>Cancel</Button
			>
			<Button loading={isCreatingVariable}>Create</Button>
		</Modal.Actions>
	</form>
</Modal>

<section class="mt-12 flex flex-col gap-4">
	<div class="flex flex-row items-center justify-between">
		<h2 class="text-2xl font-medium">Variables</h2>
		<Button onclick={() => (createVariableModalOpen = true)}>
			<Plus class="size-4" />
			Create a variable
		</Button>
	</div>

	<!-- Variables list -->
	{#if environment?.variables && environment.variables.length > 0}
		<div class="border-border flex flex-col rounded border">
			{#each environment.variables as variable, i (variable.id)}
				<div animate:flip={{ duration: 400 }}>
					<Card
						class={cn(
							'grid grid-cols-3 items-center rounded-none border-0',
							i !== 0 && 'border-t',
							i === 0 && 'rounded-t',
							i === environment.variables.length - 1 && 'rounded-b'
						)}
					>
						<!-- Variable name -->
						<div class="flex flex-row items-center gap-4">
							<div class="border-border text-muted bg-background rounded-full border p-1.5">
								<Key class="size-4" />
							</div>
							<span class="font-mono text-sm font-bold">{variable.name}</span>
						</div>

						<!-- Variable value -->
						<div class="justify-bertween col-span-2 flex h-6 flex-row items-center gap-2">
							<!-- Toggle visiblity  -->
							<button
								class="hover:bg-secondary-hover text-muted mr-1 size-6 shrink-0 cursor-pointer rounded-sm p-1 transition-colors"
								title="Show/hide value"
								onclick={() => toggleVariableVisibility(variable)}
							>
								{#if variable.hidden}
									<span class="size-full" in:fade={{ duration: 400 }}>
										<Eye class="size-full" />
									</span>
								{:else}
									<span class="size-full" in:fade={{ duration: 400 }}>
										<EyeClosed class="size-full" />
									</span>
								{/if}
							</button>
							{#if variable.hidden}
								<div
									class="flex h-full flex-row items-center rounded-sm"
									in:slide={{ delay: 400, axis: 'x', duration: 300 }}
									out:slide={{ axis: 'x', duration: 300 }}
								>
									{#each new Array(10) as _}
										<div class=" flex w-2 shrink-0 flex-row items-center justify-center">
											<span class="bg-muted size-1 rounded-full"></span>
										</div>
									{/each}
								</div>
							{:else}
								<button
									in:slide={{ axis: 'x', duration: 400, delay: 400 }}
									out:slide={{ axis: 'x', duration: 400 }}
									class="bg-secondary-hover cursor-copy truncate rounded-sm border px-1 py-0.5 text-start font-mono text-sm"
									onclick={() => copyVariable(variable)}>{variable.value}</button
								>
							{/if}

							<Action {variable} {environment} {form} />
						</div>
					</Card>
				</div>
			{/each}
		</div>
	{:else}
		<!-- No variables indicator -->
		<Alert.Info>
			Looks like there are no variables in this environment. Click the button above to create one.
		</Alert.Info>
	{/if}
</section>
