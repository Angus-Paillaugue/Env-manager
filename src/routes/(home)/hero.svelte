<script lang="ts">
	import { SECTION_HEIGHT } from "./layout";

  const egEnvFile = [
    {
      key:
        'JWT_SECRET',
      value:
        '8ycCoXZzJ9R6YoMqv3xGkgOjkRl',
    },
    {
      key:
        'API_KEY',
      value:
        '0;*4"!llsMFX@z~4.__x%oj>F',
    },
    {
      key:
        'POSTGRES_PASSWORD',
      value:
        '7Dmap6ZRn+bhWPwjvLzw',
    },
  ]
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section class="relative text-foreground overflow-hidden" style="height: {SECTION_HEIGHT};">
  <div class="absolute inset-0 -z-10 bg-[size:10px_10px] bg-fixed bg-[image:radial-gradient(var(--pattern)_1px,_transparent_0)]" style="--pattern: color-mix(in oklab,var(--color-foreground)15%,transparent);">
  </div>

  <!-- Dot env file example -->
  <div class="border border-border z-0 bg-card hover:bg-card-hover group transition-all cursor-pointer hover:scale-105 duration-300 rounded-lg absolute -rotate-12 w-[450px] top-1/6 -right-10 rounded-tl-none hover:rotate-[-17deg] hover:-right-2">
    <div class="flex flex-col relative p-6">
      <!-- File name -->
      <div class="absolute bottom-full left-0 px-4 py-1.5 bg-card transition-all group-hover:bg-card-hover border border-b-0 -mt-px -ml-px rounded-t border-border duration-300">
        <span class="text-lg font-medium text-muted">.env.dev</span>
      </div>
      <!-- File contents -->
      <div class="flex flex-col text-lg font-medium file-contents font-mono select-none">
        {#each egEnvFile as env}
          <div class="flex flex-row items-center h-8 flex-nowrap">
            <span class="token key">{env.key}</span>
            <span class="token operator">=</span>
            <div class="relative h-full w-full">
              <div class="absolute left-0 top-1/2 -translate-y-1/2 flex flex-row gap-1 group-hover:opacity-0 ml-1 transition-all duration-300">
                {#each new Array(env.value.length) as _}
                  <span class="size-[6.5px] bg-muted rounded-full"></span>
                {/each}
              </div>
              <span class="token string absolute top-1/2 left-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                {env.value}
              </span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- CLI Integration card -->
  <div class="absolute bottom-1/3 left-1 z-0 border border-border bg-card hover:bg-card-hover duration-300 transition-all hover:scale-110 hover:rotate-10 hover:left-10 group rounded-lg w-[400px] cursor-pointer h-[300px] rotate-5 flex flex-col gap-4 items-center justify-center">
    <h2 class="text-2xl font-medium">CLI Integration</h2>
    <!-- svelte-ignore a11y_missing_attribute -->
    <img src="/terminal.webp" class="w-1/2 mx-auto" />
  </div>

  <!-- Main text -->
  <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
    <div class="max-w-screen-xl w-full flex flex-col items-center justify-center h-full">
      <p class="italic text-xl font-medium">Seamless environment variable management, anywhere.</p>
    </div>
</div>

  <!-- Fade gradient -->
  <div class="absolute bottom-0 left-0 right-0 pointer-events-none h-1/2 bg-gradient-to-b from-transparent to-background"></div>
</section>

<style>
  .file-contents .token.key {
    color: #f69d50;
  }
  .file-contents .token.string {
    color: #6cb6ff;
  }
  .file-contents .token.operator {
    color: #adbac7;
  }
</style>
