<script lang="ts">
  import { feed } from '#lib/feed.ts';

  const profile = feed.username ? `https://www.instagram.com/${feed.username}/` : 'https://www.instagram.com/';
  const updated = feed.fetchedAt
    ? new Date(feed.fetchedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const short = (s: string, n = 140) => (s.length > n ? `${s.slice(0, n).trimEnd()}…` : s);
  const when = (t: string) => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
</script>

<svelte:head>
  <title>Insta · Jonathan Jayes</title>
  <meta name="description" content="My latest Instagram posts." />
  <link rel="canonical" href="https://insta.jonathanjayes.com" />
</svelte:head>

<header class="wrap head">
  <p class="kicker">{feed.username ? `@${feed.username}` : 'Instagram'}</p>
  <h1>Insta</h1>
  <p class="intro">
    The latest photos from my Instagram, for fun.
    {#if updated}Last synced {updated}.{/if}
    <a href={profile}>Follow along on Instagram</a>.
  </p>
</header>

<section class="wrap">
  {#if feed.posts.length === 0}
    <p class="empty">Nothing here yet. The feed fills in once the daily sync has run.</p>
  {:else}
    <ul class="grid">
      {#each feed.posts as post (post.id)}
        <li>
          <a class="tile" href={post.permalink}>
            <img src={post.image} width={post.width} height={post.height} alt={post.caption ? short(post.caption, 120) : 'Instagram post'} loading="lazy" decoding="async" />
            {#if post.mediaType === 'CAROUSEL_ALBUM' && post.count > 1}
              <span class="badge" aria-label={`${post.count} photos`}>1/{post.count}</span>
            {:else if post.mediaType === 'VIDEO'}
              <span class="badge">Video</span>
            {/if}
            <span class="overlay">
              {#if post.caption}<span class="caption">{short(post.caption)}</span>{/if}
              <span class="date">{when(post.timestamp)}</span>
            </span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .head {
    margin-top: clamp(2.5rem, 7vw, 4.5rem);
    margin-bottom: 2rem;
  }
  h1 {
    font-size: clamp(2.5rem, 7vw, 4.25rem);
    margin-top: 0.5rem;
  }
  .intro {
    color: var(--muted);
    font-size: 1.15rem;
    margin-top: 1rem;
    max-width: 60ch;
  }
  .empty {
    color: var(--muted);
    padding: 3rem 0;
    border-top: 1px solid var(--rule);
  }
  .grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
    gap: 6px;
  }
  .tile {
    position: relative;
    display: block;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 4px;
    background: var(--paper-2);
  }
  .tile img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 300ms ease;
  }
  .tile:hover img,
  .tile:focus-visible img {
    transform: scale(1.04);
  }
  .badge {
    position: absolute;
    top: 8px;
    right: 8px;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: #fff;
    background: rgb(0 0 0 / 0.55);
    padding: 0.15em 0.5em;
    border-radius: 999px;
  }
  .overlay {
    position: absolute;
    inset: auto 0 0 0;
    display: grid;
    gap: 0.3rem;
    padding: 2.5rem 0.8rem 0.7rem;
    background: linear-gradient(transparent, rgb(0 0 0 / 0.72));
    color: #fff;
    font-size: 0.85rem;
    line-height: 1.35;
    opacity: 0;
    transition: opacity 180ms ease;
  }
  .tile:hover .overlay,
  .tile:focus-visible .overlay {
    opacity: 1;
  }
  .date {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    opacity: 0.85;
  }
  @media (hover: none) {
    .overlay {
      display: none;
    }
  }
</style>
