<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { Alert, Button, Card, Input, Modal } from '$lib/components';
  import { pageHeading } from '$lib/stores';
  import { t } from '$lib/translations';
  import type { Environment, Project, ProjectMember } from '$lib/types';
  import { handleForm } from '$lib/utils/formHandler';
  import { Code, Plus, Save, Trash2 } from 'lucide-svelte';
  import Action from './action.svelte';
  import Members from './members.svelte';

  let { data, form } = $props();
  let project = $derived<Project>(data.project);
  let createEnvironmentModalOpen = $state(false);
  let isCreatingEnvironment = $state(false);
  let deleteProjectModalOpen = $state(false);
  let isDeletingProject = $state(false);
  let isSavingProjectGeneralSettings = $state(false);

  $effect(() => {
    pageHeading.set({
      title: $t('app.environments.title'),
      description: $t('app.environments.description', { projectName: project.name }),
      breadcrumbs: [
        { title: $t('app.projects.title'), href: '/app' },
        { title: project.name, href: '/app/projects/' + project.id }
      ],
      seo: {
        title: $t('app.environments.seo.title', { projectName: project.name })
      }
    });
  });

  $effect(() => {
    handleForm(form, {
      onSuccess: (body, action) => {
        switch (action) {
          case 'deleteEnvironment': {
            project.environments = project.environments.filter(
              (env: Environment) => env.id !== body
            );
            break;
          }
          case 'addMember': {
            const data = body as unknown as ProjectMember;
            if (!project.members.some((member) => member.userId === data.userId)) {
              project.members.push(data);
            } else {
              form = {
                ok: false,
                action: 'addMember',
                error: 'User is already a member'
              };
            }
            break;
          }
          case 'editEnvironment': {
            const data = body as unknown as Environment;
            project.environments = project.environments.map((env) => {
              if (env.id === data.id) {
                return data;
              }
              return env;
            });
            break;
          }
          case 'removeMember': {
            const data = body as unknown as ProjectMember['userId'];
            project.members = project.members.filter((member) => member.userId !== data);
            break;
          }
          case 'saveSettings': {
            const data = body as unknown as Project;
            page.data.project = data;
            break;
          }
        }
      },
      onError: (error, action) => {
        console.error(`Error in action ${action}:`, error);
      }
    });
  });
</script>

<!-- Create environment modal -->
<Modal bind:open={createEnvironmentModalOpen}>
  <Modal.Heading>
    <Modal.Title>{$t('app.project.create.title')}</Modal.Title>
    <Modal.Description>{$t('app.project.create.description')}</Modal.Description>
  </Modal.Heading>
  <form
    method="POST"
    action="?/createEnvironment"
    class="flex w-full flex-col gap-2"
    use:enhance={() => {
      isCreatingEnvironment = true;
      return async ({ update }) => {
        isCreatingEnvironment = false;
        update({ reset: false });
      };
    }}
  >
    <Input.Floating type="text" id="environmentName" label="Environment name" />
    {#if form && form.ok === false && form?.action === 'createEnvironment' && form.error}
      <Alert.Danger>{form.error}</Alert.Danger>
    {/if}
    <Modal.Actions>
      <Button type="button" variant="secondary" onclick={() => (createEnvironmentModalOpen = false)}
        >{$t('labels.cancel')}</Button
      >
      <Button loading={isCreatingEnvironment}>{$t('labels.create')}</Button>
    </Modal.Actions>
  </form>
</Modal>

<!-- Delete project modal -->
<Modal bind:open={deleteProjectModalOpen}>
  <Modal.Heading>
    <Modal.Title>{$t('app.project.delete.title')}</Modal.Title>
    <Modal.Description>{$t('app.project.delete.description')}</Modal.Description>
  </Modal.Heading>
  <form
    method="POST"
    action="?/deleteProject"
    class="flex w-full flex-col gap-2"
    use:enhance={() => {
      isDeletingProject = true;
      return async ({ update }) => {
        isDeletingProject = false;
        update({ reset: false });
      };
    }}
  >
    <p>{@html $t('app.project.delete.content')}</p>
    {#if form && form.ok === false && form?.action === 'deleteProject' && form.error}
      <Alert.Danger>{form.error}</Alert.Danger>
    {/if}
    <Modal.Actions>
      <Button type="button" variant="secondary" onclick={() => (deleteProjectModalOpen = false)}
        >{$t('labels.cancel')}</Button
      >
      <Button loading={isDeletingProject} variant="danger" type="submit"
        >{$t('labels.delete')}</Button
      >
    </Modal.Actions>
  </form>
</Modal>

<section class="mt-12 flex flex-col gap-4">
  <div class="flex flex-row items-center justify-between">
    <h2 class="text-2xl font-medium">{$t('app.project.environments.title')}</h2>
    <Button onclick={() => (createEnvironmentModalOpen = true)}
      ><Plus class="size-4" />{$t('app.project.create.action')}</Button
    >
  </div>
  {#each project.environments as environment}
    <Card
      href="/app/projects/{project.id}/environments/{environment.name}"
      class="group flex-row items-center gap-4 rounded font-mono text-base font-bold"
      hoverEffect={true}
    >
      <div
        class="border-border text-muted bg-background group-hover:bg-primary group-hover:text-primary-foreground rounded-full border p-1.5 transition-colors"
      >
        <Code class="size-4" />
      </div>
      {environment.name}

      <div class="ml-auto">
        <Action {form} {environment} />
      </div>
    </Card>
  {:else}
    <Alert.Info>{$t('app.project.environments.noEnvironments')}</Alert.Info>
  {/each}
</section>

<Members {project} {form} />

{#if project.members.find((u) => u.user.id === data.user.id)?.role === 'owner'}
  <section class="mt-12 flex flex-col gap-4">
    <h2 class="text-2xl font-medium">{$t('app.project.environments.settings.title')}</h2>

    <!-- General settings -->
    <Card>
      <Card.Heading>{$t('app.project.environments.settings.tabs.general.title')}</Card.Heading>
      <form
        action="?/saveSettings"
        class="mt-4 flex flex-col gap-2"
        method="POST"
        use:enhance={() => {
          isSavingProjectGeneralSettings = true;
          return async ({ update }) => {
            isSavingProjectGeneralSettings = false;
            update({ reset: false });
          };
        }}
      >
        <Input.Floating
          type="text"
          id="projectName"
          label={$t('app.project.environments.settings.tabs.general.projectName')}
          bind:value={project.name}
        />
        {#if form && form.ok === false && form?.action === 'saveSettings' && form.error}
          <Alert.Danger>{form.error}</Alert.Danger>
        {/if}
        <Button type="submit" loading={isSavingProjectGeneralSettings}>
          <Save class="size-4" />
          {$t('labels.save')}
        </Button>
      </form>
    </Card>

    <!-- Security settings -->
    <Card class="gap-4">
      <Card.Heading>{$t('app.project.environments.settings.tabs.security.title')}</Card.Heading>
      <Button
        type="button"
        variant="danger"
        onclick={() => {
          deleteProjectModalOpen = true;
        }}
      >
        <Trash2 class="size-4" />
        {$t('app.project.environments.settings.tabs.security.deleteProject')}
      </Button>
    </Card>
  </section>
{/if}
