<script lang="ts">
  import { page } from '$app/state';
  import { Card, Hr, Sidebar } from '$lib/components';
  import { t } from '$lib/translations';
  import { cn } from '$lib/utils';
  import { ChevronDown, Code, Folder, FolderOpen, User } from 'lucide-svelte';
  import { onMount } from 'svelte';

  const SIDEBAR_SIZE_BOUNDS = {
    min: 350,
    max: 500
  };

  let projects = $derived(page.data.projects);
  let currentProject = $derived(page.data?.project);
  let currentEnvironment = $derived(page.data?.environment);
  let user = $derived(page.data.user);
  let pathname = $derived(page.url.pathname);
  let sidebarWidth = $state(
    Math.min(Math.max(page.data.sideBarWidth, SIDEBAR_SIZE_BOUNDS.min), SIDEBAR_SIZE_BOUNDS.max)
  );
  let sidebarResizer = $state<HTMLDivElement | null>(null);
  let sidebarResizerMouse = $state({ x: 0, mouseDown: false });

  // TODO: Fix this
  function isActive(node: HTMLAnchorElement) {
    const href = node.getAttribute('href');
    const isActive = href && pathname === href;
    node.dataset.active = isActive ? 'true' : 'false';
    return {
      update(newHref: string) {
        node.dataset.active = newHref && pathname === newHref ? 'true' : 'false';
      }
    };
  }

  onMount(() => {
    const handleSidebarResizerMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // Only left mouse button
      sidebarResizerMouse.mouseDown = true;
      sidebarResizerMouse.x = e.clientX;
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    };

    const handleSidebarResizerMouseMove = (e: MouseEvent) => {
      if (!sidebarResizerMouse.mouseDown) return;
      const deltaX = e.clientX - sidebarResizerMouse.x;
      const newWidth = sidebarWidth + deltaX;
      if (newWidth >= SIDEBAR_SIZE_BOUNDS.min && newWidth <= SIDEBAR_SIZE_BOUNDS.max) {
        // If the mouse is inside the upper and lower size bounds we can update the sidebar width
        sidebarWidth = newWidth;
        sidebarResizerMouse.x = e.clientX;
      }
    };

    const handleSidebarResizerMouseUp = () => {
      sidebarResizerMouse.mouseDown = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      setCookieWidth(sidebarWidth);
    };

    sidebarResizer?.addEventListener('mousedown', handleSidebarResizerMouseDown);
    document?.addEventListener('mousemove', handleSidebarResizerMouseMove);
    document?.addEventListener('mouseup', handleSidebarResizerMouseUp);

    return () => {
      sidebarResizer?.removeEventListener('mousedown', handleSidebarResizerMouseDown);
      document?.removeEventListener('mousemove', handleSidebarResizerMouseMove);
      document?.removeEventListener('mouseup', handleSidebarResizerMouseUp);
    };
  });

  const setCookieWidth = (width: number) => {
    const newCookie = `sidebarWidth=${width}; path=/; max-age=31536000;`;
    document.cookie = newCookie;
  };
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
</Sidebar>

<aside
  class="bg-card border-border relative hidden w-full shrink-0 flex-col overflow-hidden border-r p-4 transition-transform duration-300 lg:flex rtl:border-l"
  style:width={sidebarWidth + 'px'}
>
  <div class="flex flex-col gap-1">
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
  </div>

  <Card hoverEffect={true} href="/app/account" class="mt-auto flex-row items-center gap-4 rounded">
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

  <!-- Sidebar resizer -->
  <div
    class="group/resizer absolute top-1/2 right-2 h-1/2 max-h-[250px] translate-x-1/2 -translate-y-1/2 rounded-full p-8"
  >
    <div
      class="bg-border h-full w-1 cursor-ew-resize rounded-full opacity-0 transition-all group-hover/resizer:opacity-30 hover:opacity-100"
      bind:this={sidebarResizer}
    ></div>
  </div>
</aside>

<style>
  details > summary {
    list-style: none;
  }
  details > summary::-webkit-details-marker {
    display: none;
  }
</style>
