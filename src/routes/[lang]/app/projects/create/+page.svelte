<script lang="ts">
  import { enhance } from '$app/forms';
  import { Alert, Button, Input } from '$lib/components';
  import { pageHeading } from '$lib/stores';
  import { t } from '$lib/translations';
  import { Plus } from 'lucide-svelte';

  let { form } = $props();
  let isLoading = $state<boolean>(false);

  pageHeading.set({
    title: $t('app.projects.create.title'),
    description: $t('app.projects.create.description'),
    breadcrumbs: [
      { title: $t('app.projects.title'), href: '/app' },
      { title: $t('app.projects.create.title'), href: '/app/projects/create' }
    ]
  });
</script>

<form
  action="?/create"
  method="POST"
  class="flex flex-col gap-4"
  use:enhance={() => {
    isLoading = true;
    return async ({ update }) => {
      isLoading = false;
      update({ reset: false });
    };
  }}
>
  <Input.Floating
    type="text"
    id="name"
    label={$t('app.projects.create.nameLabel')}
    autofocus={true}
    autocomplete="off"
  />

  {#if form && form.ok === false && form?.action === 'create' && form.error}
    <Alert.Danger>{form.error}</Alert.Danger>
  {/if}

  <Button loading={isLoading}>
    <Plus class="size-4" />
    {$t('labels.create')}
  </Button>
</form>
