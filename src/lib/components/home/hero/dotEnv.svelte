<script lang="ts">
  const egEnvFile = [
    {
      key: 'JWT_SECRET',
      value: '8ycCoXZzJ9R6YoMqv3xGkgOjkRl'
    },
    {
      key: 'API_KEY',
      value: '0;*4"!llsMFX@z~4.__x%oj>F'
    },
    {
      key: 'POSTGRES_PASSWORD',
      value: '7Dmap6ZRn+bhWPwjvLzw'
    }
  ];
</script>

<button
  class="border-border bg-card hover:bg-card-hover focus:bg-card-hover group absolute top-1/6 -right-10 z-0 w-[450px] -rotate-12 cursor-pointer rounded-lg rounded-tl-none border transition-all duration-300 hover:-right-2 hover:scale-105 hover:rotate-[-17deg] focus:-right-2 focus:scale-105 focus:rotate-[-17deg] max-lg:hidden"
>
  <div class="relative flex flex-col p-6">
    <!-- File name -->
    <div
      class="bg-card group-hover:bg-card-hover group-focus:bg-card-hover border-border absolute bottom-full left-0 -mt-px -ml-px rounded-t border border-b-0 px-4 py-1.5 transition-all duration-300"
    >
      <span class="text-muted text-lg font-medium">.env.dev</span>
    </div>
    <!-- File contents -->
    <div class="file-contents flex flex-col font-mono text-lg font-medium select-none">
      {#each egEnvFile as env}
        <div class="flex h-8 flex-row flex-nowrap items-center">
          <span class="token key">{env.key}</span>
          <span class="token operator">=</span>
          <div class="relative h-full w-full">
            <div
              class="absolute top-1/2 left-0 ml-1 flex -translate-y-1/2 flex-row gap-1 transition-all duration-300 group-hover:opacity-0 group-focus:opacity-0"
            >
              {#each new Array(env.value.length) as _}
                <span class="bg-muted size-[6.5px] rounded-full"></span>
              {/each}
            </div>
            <span
              class="token string absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus:opacity-100"
            >
              {env.value}
            </span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</button>

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
