<script lang="ts">
  import { enhance } from '$app/forms';
  import { Alert, Button, Dropdown, Input, Modal } from '$lib/components';
  import { t } from '$lib/translations';
  import type { Environment, Variable } from '$lib/types';
  import { cloneObject, isDeepEqual } from '$lib/utils';
  import { handleForm } from '$lib/utils/formHandler';
  import { EllipsisVertical, Pen, Trash2 } from 'lucide-svelte';

  interface MyPros {
    variable: Variable;
    environment: Environment;
    form: any;
  }
  let { variable, environment, form }: MyPros = $props();
  let deleteVariableModalOpen = $state<boolean>(false);
  let isDeletingVariable = $state<boolean>(false);
  let editVariableModalOpen = $state<boolean>(false);
  let isEditingVariable = $state<boolean>(false);
  let editedVariable = $state<Variable>(cloneObject(variable) as Variable);

  // Reset edited variable when modal is closed
  $effect(() => {
    if (!editVariableModalOpen) {
      editedVariable = cloneObject(variable) as Variable; // Update to use cloneObject
    }
  });

  $effect(() => {
    handleForm(form, {
      onSuccess: (body, action) => {
        switch (action) {
          case 'deleteVariable': {
            deleteVariableModalOpen = false;
            break;
          }
          case 'editVariable': {
            const newVar = body as Variable;
            if (newVar.id === variable.id) {
              // Optionally, you might want to update the variable in the environment after editing
              environment.variables = environment.variables.map((v) => {
                if (v.id === newVar.id) {
                  return { ...newVar, hidden: true };
                }
                return v;
              });
              editVariableModalOpen = false;
            }
            break;
          }
        }
      }
    });
  });
</script>

<!-- Delete variable modal -->
<Modal bind:open={deleteVariableModalOpen}>
  <Modal.Heading>
    <Modal.Title
      >{$t('app.projects.environments.environment.variable.actions.delete.title')}</Modal.Title
    >
    <Modal.Description
      >{@html $t('app.projects.environments.environment.variable.actions.delete.description', {
        variableName: variable.name,
        environmentName: environment.name
      })}</Modal.Description
    >
  </Modal.Heading>
  <form
    method="POST"
    action="?/deleteVariable"
    class="flex w-full flex-col gap-2"
    use:enhance={() => {
      isDeletingVariable = true;
      return async ({ update }) => {
        isDeletingVariable = false;
        update({ reset: false });
      };
    }}
  >
    <input type="hidden" name="variableId" value={variable.id} />
    <p>
      {@html $t('app.projects.environments.environment.variable.actions.delete.text', {
        variableName: variable.name,
        environmentName: environment.name
      })}
      {#if form && form.ok === false && form?.action === 'deleteVariable' && form.error}
        <Alert.Danger>{form.error}</Alert.Danger>
      {/if}
      <Modal.Actions>
        <Button type="button" variant="secondary" onclick={() => (deleteVariableModalOpen = false)}
          >{$t('labels.cancel')}</Button
        >
        <Button variant="danger" loading={isDeletingVariable}>{$t('labels.delete')}</Button>
      </Modal.Actions>
    </p>
  </form>
</Modal>

<!-- Edit variable modal -->
<Modal bind:open={editVariableModalOpen}>
  <Modal.Heading>
    <Modal.Title
      >{$t('app.projects.environments.environment.variable.actions.edit.title')}</Modal.Title
    >
    <Modal.Description
      >{@html $t('app.projects.environments.environment.variable.actions.edit.description', {
        variableName: variable.name,
        environmentName: environment.name
      })}</Modal.Description
    >
  </Modal.Heading>
  <form
    method="POST"
    action="?/editVariable"
    class="flex w-full flex-col gap-2"
    use:enhance={(e) => {
      e.formData.append('variableId', variable.id);
      isEditingVariable = true;
      return async ({ update }) => {
        isEditingVariable = false;
        update({ reset: false });
      };
    }}
  >
    <div class="grid grid-cols-2 gap-4">
      <Input
        type="text"
        id="variableName"
        label={$t('labels.variables.keyLabel')}
        placeholder={$t(
          'app.projects.environments.environment.variable.actions.edit.variablePlaceholder'
        )}
        bind:value={editedVariable.name}
      />
      <Input
        type="text"
        id="variableValue"
        label={$t('labels.variables.valueLabel')}
        bind:value={editedVariable.value}
      />
    </div>

    {#if form && form.ok === false && form?.action === 'editVariable'}
      <Alert.Danger>{form.error}</Alert.Danger>
    {/if}
    <Modal.Actions>
      <Button type="button" variant="secondary" onclick={() => (editVariableModalOpen = false)}
        >{$t('labels.cancel')}</Button
      >
      <Button
        variant="primary"
        loading={isEditingVariable}
        disabled={isDeepEqual(editedVariable, variable)}>{$t('labels.edit')}</Button
      >
    </Modal.Actions>
  </form>
</Modal>

<Dropdown key="var-{variable.id}" class="ltr:ml-auto rtl:mr-auto">
  {#snippet trigger()}
    <Dropdown.Trigger variant="secondary" class="size-6 rounded p-1" key="var-{variable.id}">
      <EllipsisVertical class="size-full" />
    </Dropdown.Trigger>
  {/snippet}

  {#snippet items()}
    <Dropdown.Item
      onclick={() => {
        editVariableModalOpen = true;
      }}
    >
      <Pen class="size-4" />
      {$t('labels.edit')}
    </Dropdown.Item>
    <Dropdown.Item
      onclick={() => {
        deleteVariableModalOpen = true;
      }}
    >
      <Trash2 class="text-danger size-4" />
      {$t('labels.delete')}
    </Dropdown.Item>
  {/snippet}
</Dropdown>
