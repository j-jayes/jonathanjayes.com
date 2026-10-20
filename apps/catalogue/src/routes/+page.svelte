<script lang="ts">
  import { Card } from '@jj/ui';
  import { formatDate } from '#lib/catalogue.ts';

  let { data } = $props();
  const url = $derived(`https://${data.section}.jonathanjayes.com`);
  const count = $derived(data.groups.reduce((n, g) => n + g.items.length, 0));
</script>

<svelte:head>
  <title>{data.meta.title} · Jonathan Jayes</title>
  <meta name="description" content={data.meta.intro} />
  <meta property="og:title" content={`${data.meta.title} · Jonathan Jayes`} />
  <meta property="og:description" content={data.meta.intro} />
  <link rel="canonical" href={url} />
</svelte:head>

<header class="wrap head">
  <p class="kicker">{count} items</p>
  <h1>{data.meta.title}</h1>
  <p class="intro">{data.meta.intro}</p>
  <nav class="jump" aria-label="Jump to group">
    {#each data.groups as g (g.key)}
      <a href={`#${g.key}`}>{g.label} <span>{g.items.length}</span></a>
    {/each}
  </nav>
</header>

{#each data.groups as g (g.key)}
  <section class="wrap group" id={g.key} aria-labelledby={`${g.key}-title`}>
    <h2 id={`${g.key}-title`}>{g.label}</h2>
    <div class="grid">
      {#each g.items as item (item.slug)}
        <Card
          href={item.live}
          title={item.title}
          description={item.description}
          image={item.thumb}
          imageAlt={`Screenshot of ${item.title}`}
          kicker={item.featured ? 'Featured' : ''}
          meta={formatDate(item.date)}
        >
          {#snippet actions()}
            <a class="button" href={item.live}>View</a>
            {#if item.repo}
              <a class="button" href={item.repo}>Code</a>
            {:else}
              <span class="private" title="The repo for this one is private">Private repo</span>
            {/if}
          {/snippet}
        </Card>
      {/each}
    </div>
  </section>
{/each}

<style>
  .head {
    margin-top: clamp(2.5rem, 7vw, 4.5rem);
  }
  h1 {
    font-size: clamp(2.5rem, 7vw, 4.25rem);
    margin-top: 0.5rem;
  }
  .intro {
    max-width: 60ch;
    color: var(--muted);
    font-size: 1.15rem;
    margin-top: 1rem;
  }
  .jump {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1.75rem;
  }
  .jump a {
    font-size: 0.9rem;
    text-decoration: none;
    color: var(--ink);
    border: 1px solid var(--rule);
    border-radius: 999px;
    padding: 0.35em 0.85em;
    background: var(--card);
  }
  .jump a:hover {
    border-color: var(--accent);
  }
  .jump span {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--muted);
    margin-left: 0.2em;
  }
  .group {
    margin-top: clamp(2.75rem, 6vw, 4.5rem);
    scroll-margin-top: 80px;
  }
  h2 {
    font-size: clamp(1.5rem, 3.2vw, 2rem);
    padding-bottom: 0.7rem;
    margin-bottom: 1.4rem;
    border-bottom: 1px solid var(--rule);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
    gap: 1rem;
  }
  .button {
    padding: 0.35em 0.85em;
    font-size: 0.82rem;
  }
  .private {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--muted);
    align-self: center;
  }
</style>
