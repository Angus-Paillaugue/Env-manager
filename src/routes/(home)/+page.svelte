
<script lang="ts">
  import Hero from './hero.svelte';
	import { pageHeading } from "$lib/stores";
	import { SECTION_HEIGHT } from "./layout";

  $pageHeading = {
    title: 'Home',
    description: 'Env manager\'s home page',
  }
</script>

<Hero />


<section class="py-12 lg:py-24 px-2 lg:px-10" style="height: {SECTION_HEIGHT};">
  <div class="max-w-screen-2xl mx-auto gap-4 lg:gap-10 h-full grid lg:grid-cols-3 lg:grid-rows-2">
    <div class="lg:col-span-1 bg-card border-border border rounded-lg">Item 1</div>
    <div class="lg:col-span-2 bg-card border-border border rounded-lg">Item 2</div>
    <div class="lg:col-span-2 bg-card border-border border rounded-lg">Item 3</div>
    <div class="lg:col-span-1 border-border rounded-xl border-2 p-4 border-dashed">Item 4</div>
  </div>
</section>

<section class="bg-background" style="height: {SECTION_HEIGHT};"></section>
