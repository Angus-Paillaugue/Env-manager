<script lang="ts">
  import { page } from '$app/state';
  import { Card, Hr, Sidebar } from '$lib/components';
  import { t } from '$lib/translations';
  import { cn } from '$lib/utils';
  import { ChevronDown, Code, Folder, FolderOpen, User } from 'lucide-svelte';

  let projects = $derived(page.data.projects);
  let currentProject = $derived(page.data?.project);
  let currentEnvironment = $derived(page.data?.environment);
  let user = $derived(page.data.user);
  let pathname = $derived(page.url.pathname);
</script>

<Sidebar>
  {#snippet mobile()}
    <Sidebar.MobileItem
      class="flex h-full w-full flex-row items-center justify-center gap-2 font-mono text-base font-medium"
      href="/app"
    >
      {#if pathname.startsWith('/app/projects')}
        <FolderOpen class="size-4" />
      {:else}
        <Folder class="size-4" />
      {/if}
      {$t('app.sidebar.items.projects')}
    </Sidebar.MobileItem>
    <Sidebar.MobileItem
      class="flex h-full w-full flex-row items-center justify-center gap-2 font-mono text-base font-medium"
      href="/app/account"
    >
      <User class="size-5" />
      {$t('app.sidebar.items.account')}
    </Sidebar.MobileItem>
  {/snippet}
  {#snippet desktop()}
    <Hr text={$t('app.projects.title')} href="/app" />
    {#each projects as project}
      {#if project.environments.length > 0}
        <details open={currentProject?.id === project.id} class="group">
          <summary
            class={cn(
              'flex cursor-pointer flex-row items-center justify-between rounded border border-transparent p-2 text-lg font-medium',
              currentProject?.id === project.id &&
                !currentEnvironment &&
                'bg-card-hover border-border'
            )}
          >
            <a href="/app/projects/{project.id}" class="flex grow flex-row items-center gap-2">
              {#if currentProject?.id === project.id}
                <FolderOpen class="size-4" />
              {:else}
                <Folder class="size-4" />
              {/if}
              {project.name}
            </a>
            <div
              class="hover:bg-card-hover text-muted size-6 shrink-0 rounded-sm p-1 transition-all group-open:rotate-180"
            >
              <ChevronDown class="size-full" />
            </div>
          </summary>

          <div class="ml-4 flex flex-col">
            {#each project.environments as environment}
              <a
                href="/app/projects/{project.id}/environments/{environment.name}"
                class={cn(
                  'flex flex-row items-center gap-2 rounded border border-transparent p-2 text-base font-normal',
                  currentEnvironment?.id === environment.id && 'bg-card-hover border-border'
                )}
              >
                <Code class="size-4" />
                {environment.name}
              </a>
            {/each}
          </div>
        </details>
      {:else}
        <a
          href={`/app/projects/${project.id}`}
          class="flex cursor-pointer flex-row items-center justify-between rounded p-2 text-lg font-medium"
        >
          {project.name}
        </a>
      {/if}
    {/each}
    <Card
      hoverEffect={true}
      href="/app/account"
      class="mt-auto flex-row items-center gap-4 rounded"
    >
      <div class="border-border size-12 overflow-hidden rounded-full border">
        <!-- svelte-ignore a11y_img_redundant_alt -->
        <img
          src={user.profilePicture}
          alt={$t('labels.profilePicture')}
          class="object-cover object-center"
        />
      </div>
      <div class="flex flex-col">
        <span class="text-sm font-medium">{user.username}</span>
        <span class="text-muted font-mono text-xs">{user.email}</span>
      </div>
    </Card>
  {/snippet}
</Sidebar>

<style>
  details > summary {
    list-style: none;
  }
  details > summary::-webkit-details-marker {
    display: none;
  }
</style>
