<script lang="ts">
  import '@jj/ui/theme.css';
  import { SiteNav, SiteFooter, Analytics } from '@jj/ui';
  let { children } = $props();
</script>

<Analytics />
<SiteNav current={__SECTION__} />
<main>{@render children()}</main>
<SiteFooter />
