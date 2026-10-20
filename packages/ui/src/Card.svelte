<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    href,
    title,
    kicker = '',
    description = '',
    image = '',
    imageAlt = '',
    meta = '',
    actions
  }: {
    href: string;
    title: string;
    kicker?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
    meta?: string;
    actions?: Snippet;
  } = $props();
</script>

<article class="card">
  {#if image}
    <a class="thumb" href={href} tabindex="-1" aria-hidden="true">
      <img src={image} alt={imageAlt} loading="lazy" decoding="async" />
    </a>
  {/if}
  <div class="body">
    {#if kicker}<span class="chip">{kicker}</span>{/if}
    <h3><a class="stretch" href={href}>{title}</a></h3>
    {#if description}<p class="desc">{description}</p>{/if}
    {#if meta || actions}
      <div class="foot">
        {#if meta}<span class="meta">{meta}</span>{/if}
        {#if actions}<div class="actions">{@render actions()}</div>{/if}
      </div>
    {/if}
  </div>
</article>

<style>
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    background: var(--card);
    border: 1px solid var(--rule);
    border-radius: var(--radius);
    overflow: hidden;
    transition: border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease;
  }
  .card:hover {
    border-color: color-mix(in srgb, var(--accent) 55%, var(--rule));
    box-shadow: var(--shadow);
    transform: translateY(-2px);
  }
  .thumb {
    display: block;
    aspect-ratio: 16 / 10;
    background: var(--paper-2);
    border-bottom: 1px solid var(--rule);
  }
  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    padding: 1rem 1.1rem 1.1rem;
    flex: 1;
  }
  .chip {
    align-self: flex-start;
  }
  h3 {
    font-size: 1.15rem;
    font-weight: 500;
  }
  h3 a {
    color: var(--ink);
    text-decoration: none;
  }
  .stretch::after {
    content: '';
    position: absolute;
    inset: 0;
  }
  .desc {
    color: var(--muted);
    font-size: 0.95rem;
    line-height: 1.5;
  }
  .foot {
    margin-top: auto;
    padding-top: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .meta {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--muted);
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    position: relative;
    z-index: 1;
  }
</style>
