<script lang="ts">
  import { sites, type SiteKey } from './sites';

  let { current }: { current: SiteKey } = $props();
  const items = sites.filter((s) => s.key !== 'home');
</script>

<header class="nav">
  <div class="wrap inner">
    <a class="brand" href={sites[0].url} aria-current={current === 'home' ? 'page' : undefined}>
      Jonathan Jayes
    </a>
    <nav aria-label="Sites">
      <ul>
        {#each items as site (site.key)}
          <li>
            <a href={site.url} aria-current={current === site.key ? 'page' : undefined}>{site.label}</a>
          </li>
        {/each}
      </ul>
    </nav>
  </div>
</header>

<style>
  .nav {
    border-bottom: 1px solid var(--rule);
    background: color-mix(in srgb, var(--paper) 88%, transparent);
    backdrop-filter: saturate(1.4) blur(8px);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-height: 56px;
    flex-wrap: wrap;
    padding-block: 0.5rem;
  }
  .brand {
    font-family: var(--font-display);
    font-size: 1.15rem;
    font-weight: 500;
    color: var(--ink);
    text-decoration: none;
    white-space: nowrap;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1.1rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  nav a {
    font-size: 0.92rem;
    color: var(--muted);
    text-decoration: none;
    padding-block: 0.25rem;
    border-bottom: 1px solid transparent;
  }
  nav a:hover {
    color: var(--ink);
  }
  nav a[aria-current='page'] {
    color: var(--ink);
    border-bottom-color: var(--accent);
  }
</style>
