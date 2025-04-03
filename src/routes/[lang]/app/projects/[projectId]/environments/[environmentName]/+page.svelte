<script lang="ts">
  import { enhance } from '$app/forms';
  import { Alert, Button, Card, Hr, Input, Modal } from '$lib/components';
  import { pageHeading } from '$lib/stores';
  import { t } from '$lib/translations';
  import type { Environment, Variable } from '$lib/types';
  import { cn, copyToClipboard } from '$lib/utils';
  import { handleForm } from '$lib/utils/formHandler';
  import { Download, Eye, EyeClosed, Key, Plus } from 'lucide-svelte';
  import { flip } from 'svelte/animate';
  import { fade, slide } from 'svelte/transition';
  import Action from './action.svelte';

  interface HiddenVariable extends Variable {
    hidden: boolean;
  }

  interface MyEnvironment extends Environment {
    variables: HiddenVariable[];
  }

  let { data, form } = $props();
  let project = $state(data.project);
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
      title: $t('app.projects.environments.environment.title', {
        name: environment.name
      }),
      description: $t('app.projects.environments.environment.description', {
        environmentName: environment.name,
        projectName: project.name
      }),
      breadcrumbs: [
        { title: $t('app.projects.title'), href: '/app' },
        { title: project.name, href: '/app/projects/' + project.id },
        {
          title: environment.name,
          href: '/app/projects/' + project.id + '/environments/' + environment.name
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

  $effect(() => {
    handleForm(form, {
      onSuccess: (body, action) => {
        switch (action) {
          case 'createVariable': {
            const newEnv = body as unknown as Environment;
            environment = {
              ...newEnv,
              variables: transformEnvVariables(newEnv)
            };
            createVariableModalOpen = false;
            break;
          }
          case 'deleteVariable': {
            environment.variables = environment.variables.filter(
              (v) => v.id !== (body as Variable['id'])
            );
            break;
          }
        }
      },
      onError: (error, action) => {
        console.error(`Error in action ${action}:`, error);
      }
    });

    form = null;
  });

  // Handle the form submission when an env file is selected
  $effect(() => {
    if (!envFileFiles || !createVariableForm) return;
    if (envFileFiles.length === 0) return;
    createVariableForm.submit();
  });

  function toggleVariableVisibility(variable: HiddenVariable) {
    if (!environment.variables) return;
    if (!variable.hidden) {
      variable.hidden = true;
      return;
    }
    environment.variables?.forEach((v) => (v.hidden = true));
    variable.hidden = !variable.hidden;
  }

  function downloadVariables() {
    const textContent = environment.variables.map((v) => v.name + '=' + v.value).join('\n');
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(textContent)
    );
    element.setAttribute('download', '.env.' + environment.name.toLowerCase());
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
</script>

<!-- Create variable modal -->
<Modal bind:open={createVariableModalOpen}>
  <Modal.Heading>
    <Modal.Title>{$t('app.projects.environments.environment.create.title')}</Modal.Title>
    <Modal.Description
      >{@html $t('app.projects.environments.environment.create.description', {
        name: environment.name
      })}</Modal.Description
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
      <h3 class="text-lg font-medium">
        {$t('app.projects.environments.environment.create.importDotEnv.label')}
      </h3>
      <Input.File
        id="envFile"
        placeholder={$t('app.projects.environments.environment.create.importDotEnv.placeholder')}
        accept=".env, .env.*"
        bind:files={envFileFiles}
      />
    </div>
    <Hr text="OR" />
    <h3 class="text-lg font-medium">
      {$t('app.projects.environments.environment.create.enterManually.label')}
    </h3>
    <div class="grid grid-cols-2 gap-4">
      <Input
        type="text"
        id="variableName"
        label={$t('labels.variables.keyLabel')}
        placeholder={$t('app.projects.environments.environment.create.enterManually.placeholder')}
      />
      <Input type="text" id="variableValue" label={$t('labels.variables.valueLabel')} />
    </div>
    {#if form && form.ok === false && form?.action === 'createVariable' && form.error}
      <Alert.Danger>{form.error}</Alert.Danger>
    {/if}
    <Modal.Actions>
      <Button type="button" variant="secondary" onclick={() => (createVariableModalOpen = false)}
        >{$t('labels.cancel')}</Button
      >
      <Button loading={isCreatingVariable}>{$t('labels.create')}</Button>
    </Modal.Actions>
  </form>
</Modal>

<section class="mt-12 flex flex-col gap-4">
  <div class="flex flex-row items-center justify-between">
    <div class="flex flex-row items-center gap-2">
      <h2 class="text-2xl font-medium">
        {$t('app.projects.environments.environment.variable.title')}
      </h2>

      {#if environment?.variables && environment.variables.length > 0}
        <Button
          variant="secondary"
          onclick={downloadVariables}
          class="size-8 p-2"
          title={$t('app.projects.environments.environment.variable.download.label')}
        >
          <Download class="size-full" />
        </Button>
      {/if}
    </div>
    <Button onclick={() => (createVariableModalOpen = true)}>
      <Plus class="size-4" />
      {$t('app.projects.environments.environment.variable.create')}
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
              <!-- Toggle visibility  -->
              <button
                class="hover:bg-secondary-hover text-muted mr-1 size-6 shrink-0 cursor-pointer rounded-sm p-1 transition-colors"
                title={$t('app.projects.environments.environment.variable.toggleValueVisibility')}
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
                  onclick={() => copyToClipboard(variable.value)}>{variable.value}</button
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
      {$t('app.projects.environments.environment.variable.noVariables')}
    </Alert.Info>
  {/if}
</section>
