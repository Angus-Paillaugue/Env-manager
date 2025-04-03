<script lang="ts">
  import { page } from '$app/state';
  import { SECTION_HEIGHT } from '$lib/components/home/utils';
</script>

<div class="flex flex-col items-center justify-center" style="height: {SECTION_HEIGHT};">
  <div class="border-foreground relative w-full max-w-md rounded border-2 p-4 pt-8">
    <p class="text-foreground text-center text-lg font-medium">{page.error?.message}</p>
    <div
      class="shadow-foreground absolute -top-px left-1/2 flex h-fit -translate-x-1/2 -translate-y-1/2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="31"
        height="30"
        fill="none"
        viewBox="0 0 28 30"
        class="text-foreground size-10"
        ><path
          fill="currentColor"
          d="M25.658.14h5.337v29.572h-5.337a9.24 9.24 0 0 1-6.626-2.8l-4.327-4.45A26.2 26.2 0 0 0 .5 14.926a26.2 26.2 0 0 0 14.205-7.535l4.327-4.451a9.24 9.24 0 0 1 6.626-2.8"
        ></path></svg
      >
      <div
        class="bg-foreground text-background -mx-px flex h-10 items-center px-2 font-mono text-4xl font-extrabold tracking-wide"
      >
        {page.status}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="31"
        height="30"
        fill="none"
        viewBox="0 0 28 30"
        class="text-foreground size-10 -scale-x-100"
        ><path
          fill="currentColor"
          d="M25.658.14h5.337v29.572h-5.337a9.24 9.24 0 0 1-6.626-2.8l-4.327-4.45A26.2 26.2 0 0 0 .5 14.926a26.2 26.2 0 0 0 14.205-7.535l4.327-4.451a9.24 9.24 0 0 1 6.626-2.8"
        ></path></svg
      >
    </div>
  </div>
</div>
