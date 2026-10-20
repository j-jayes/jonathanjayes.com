<script lang="ts">
  import '@jj/ui/theme.css';
  import { SiteNav, SiteFooter, Analytics } from '@jj/ui';
  let { children } = $props();
</script>

<Analytics />
<SiteNav current="home" />
<main>{@render children()}</main>
<SiteFooter />
