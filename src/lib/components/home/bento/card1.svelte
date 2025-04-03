<script lang="ts">
  import Hr from '$lib/components/Hr';
  import { t } from '$lib/translations';
  import { cn } from '$lib/utils';
  import { Crown, Lock, Pencil, User } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { flip } from 'svelte/animate';
  import { cubicOut } from 'svelte/easing';
  import { fade, scale } from 'svelte/transition';

  type Role = 'Owner' | 'Guest';
  const rolesSequence = [
    'Owner',
    'Guest',
    'Guest',
    'Owner',
    'Guest',
    'Owner',
    'Owner',
    'Guest'
  ] as Role[];

  interface Member {
    name: string;
    role: Role;
    seed: number;
  }

  let card = $state<HTMLElement | null>(null);
  let members = $state<Member[]>([
    { name: 'Alice', role: 'Owner', seed: 5 },
    { name: 'Bob', role: 'Guest', seed: 3 },
    { name: 'Me', role: 'Owner', seed: 1 }
  ]);
  let interval = $state<ReturnType<typeof setInterval> | null>(null);
  let canEditVariables = $state(true);
  const variables = [
    { name: 'POSTGRES_PASSWORD', value: 'LkKWgTtOFwJMwG' },
    { name: 'POSTGRES_USER', value: 'postgres' },
    { name: 'POSTGRES_DB', value: 'Env-manager' },
    { name: 'JWT_SECRET', value: 'odRIaNSfh0DQN7' }
  ];

  function cycleRoles() {
    members = members
      .map((member) => {
        const seed = member.seed + 1;
        return {
          ...member,
          role: rolesSequence[seed % rolesSequence.length],
          seed
        };
      })
      .sort(sortByRole);
    canEditVariables = members.find((member) => member.name === 'Me')?.role === 'Owner';
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!interval) {
              cycleRoles();
              interval = setInterval(cycleRoles, 2000);
            }
          } else {
            if (interval) {
              clearInterval(interval);
              interval = null;
            }
          }
        }
      },
      { threshold: 0.5 }
    );

    if (card) observer.observe(card);
    return () => observer.disconnect();
  });

  const sortByRole = (a: Member, b: Member) => {
    if (a.role === 'Owner') return -1;
    if (b.role === 'Owner') return 1;
    return 0;
  };
</script>

<div class="flex h-full w-full grow flex-col">
  <!-- Members list -->
  <ul class="space-y-3 px-2" bind:this={card}>
    {#each members as member (member.name)}
      <li
        class={cn(
          'flex items-center justify-between rounded px-4 py-2',
          member.name === 'Me' && 'bg-card-hover'
        )}
        animate:flip={{ duration: 500, easing: cubicOut }}
      >
        <div class="flex items-center gap-3">
          <div class="relative size-5">
            {#if member.role === 'Owner'}
              <span
                class="absolute inset-0 text-lg text-yellow-500"
                transition:fade={{ duration: 300 }}
              >
                <Crown class="size-full" />
              </span>
            {:else}
              <span class="text-muted absolute inset-0 text-lg" transition:fade={{ duration: 300 }}>
                <User class="size-full" />
              </span>
            {/if}
          </div>
          <span class="text-foreground">{member.name}</span>
        </div>
        <span
          class={cn(
            'text-foreground rounded px-3 py-1 text-sm font-medium transition-all duration-300',
            member.role === 'Owner' ? 'bg-yellow-500' : 'bg-secondary-hover'
          )}
        >
          {$t('home.homepage.bento.card1.roles.' + member.role.toLowerCase())}
        </span>
      </li>
    {/each}
  </ul>

  <Hr />

  <!-- Variables list -->
  <ul class="space-y-3 px-2 pb-4">
    {#each variables as { name, value } (name)}
      <li class="flex items-center gap-2 px-2">
        <!-- Variable name -->
        <span
          class="text-foreground min-w-0 flex-shrink flex-grow-0 truncate font-mono text-sm font-bold"
          >{name}</span
        >

        <!-- Flexible spacer -->
        <div class="flex-grow"></div>

        <!-- Value and button container -->
        <div class="flex min-w-0 flex-shrink-0 items-center gap-2">
          <!-- Variable value -->
          <div
            class="bg-secondary-hover min-w-0 truncate rounded-sm border px-1 py-0.5 text-start font-mono text-sm select-none max-sm:max-w-[70px]"
          >
            {value}
          </div>

          <!-- Edit button -->
          <button
            class={cn(
              'bg-secondary-hover relative size-6.5 flex-none rounded-full',
              canEditVariables ? 'cursor-pointer' : 'cursor-not-allowed'
            )}
          >
            {#if canEditVariables}
              <div class="absolute inset-1.5" in:scale={{ duration: 300 }}>
                <Pencil class="size-full" />
              </div>
            {:else}
              <div class="absolute inset-1.5" in:scale={{ duration: 300 }}>
                <Lock class="size-full" />
              </div>
            {/if}
          </button>
        </div>
      </li>
    {/each}
  </ul>
</div>
