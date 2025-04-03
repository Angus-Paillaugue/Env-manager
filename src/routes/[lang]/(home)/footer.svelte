<script lang="ts">
  import { Flag, Link, Select } from '$lib/components';
  import { locale, locales, setLocale, t } from '$lib/translations';
</script>

<footer class="bg-card border-border w-full border-t px-4 py-8">
  <div class="mx-auto grid max-w-screen-xl grid-cols-1 gap-8 md:grid-cols-2">
    <!-- About Section -->
    <div>
      <h2 class="text-lg font-bold">{$t('home.footer.about.title')}</h2>
      <p class="text-muted mt-2 text-sm">
        {$t('home.footer.about.description')}
      </p>

      <!-- Lang change -->
      <div class="mt-4 flex flex-col gap-2">
        <h2 class="text-lg font-bold">{$t('home.footer.language.title')}</h2>
        <Select
          onChange={(value) => {
            setLocale(value as string);
          }}
        >
          {#each locales as l}
            <Select.Option value={l} selected={l === $locale}>
              <Flag class="size-4" lang={l} />
              {l}
            </Select.Option>
          {/each}
        </Select>
      </div>
    </div>

    <!-- Navigation Links -->
    <div>
      <h2 class="text-lg font-bold">{$t('home.footer.navigation.title')}</h2>
      <ul class="mt-2 space-y-2">
        <li>
          <Link href="/app" class="text-muted hover:text-foreground"
            >{$t('home.footer.navigation.links.dashboard')}</Link
          >
        </li>
        <li>
          <Link href="/auth/sign-up" class="text-muted hover:text-foreground"
            >{$t('home.footer.navigation.links.signUp')}</Link
          >
        </li>
        <li>
          <Link href="/auth/login" class="text-muted hover:text-foreground"
            >{$t('home.footer.navigation.links.logIn')}</Link
          >
        </li>
        <li>
          <Link href="/help" class="text-muted hover:text-foreground"
            >{$t('home.footer.navigation.links.help')}</Link
          >
        </li>
      </ul>
    </div>
  </div>

  <!-- Copyright Section -->
  <div class="border-border text-muted mt-8 border-t pt-4 text-center text-sm">
    &copy; {new Date().getFullYear()} Env-Manager. {$t('home.footer.copyright')}
  </div>
</footer>
