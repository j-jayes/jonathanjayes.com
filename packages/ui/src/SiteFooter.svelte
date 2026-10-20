<script lang="ts">
  import { sites, links } from './sites';
  const year = new Date().getFullYear();
</script>

<footer class="footer">
  <div class="wrap inner">
    <p class="name">Jonathan Jayes</p>
    <ul aria-label="Elsewhere">
      {#each sites as site (site.key)}
        <li><a href={site.url}>{site.label}</a></li>
      {/each}
      <li><a href={links.github}>GitHub</a></li>
      <li><a href={links.linkedin}>LinkedIn</a></li>
      <li><a href={links.email}>Email</a></li>
    </ul>
    <p class="small">© {year}</p>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--rule);
    margin-top: clamp(3rem, 8vw, 6rem);
    padding-block: 2rem 2.5rem;
    color: var(--muted);
    font-size: 0.9rem;
  }
  .inner {
    display: grid;
    gap: 0.75rem;
  }
  .name {
    font-family: var(--font-display);
    color: var(--ink);
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem 1rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  a {
    color: var(--muted);
  }
  a:hover {
    color: var(--ink);
  }
  .small {
    font-size: 0.8rem;
  }
</style>
