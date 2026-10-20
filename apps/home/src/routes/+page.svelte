<script lang="ts">
  import { Card, sites, links } from '@jj/ui';
  import { hero, bio, quote, experience, education } from '#lib/content.ts';

  const elsewhere = sites.filter((s) => s.key !== 'home');
  const description = `${hero.role}. ${hero.line}`;
</script>

<svelte:head>
  <title>Jonathan Jayes</title>
  <meta name="description" content={description} />
  <meta property="og:title" content="Jonathan Jayes" />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="https://jonathanjayes.com/portrait.webp" />
  <link rel="canonical" href="https://jonathanjayes.com" />
</svelte:head>

<section class="hero wrap">
  <div class="intro">
    <p class="kicker">{hero.role}</p>
    <h1>{hero.name}</h1>
    <p class="line">{hero.line}</p>
    <div class="cta">
      <a class="button primary" href="https://blog.jonathanjayes.com">Read the blog</a>
      <a class="button" href="/cv/Jonathan-Jayes-CV.pdf">CV (PDF)</a>
      <a class="button" href={links.github}>GitHub</a>
      <a class="button" href={links.linkedin}>LinkedIn</a>
    </div>
  </div>
  <figure class="portrait">
    <img src="/portrait.webp" width="640" height="800" alt="Jonathan, grinning and holding up a peace sign on a running track after a race" />
  </figure>
</section>

<section class="wrap about" aria-labelledby="about">
  <h2 id="about" class="section-title">About</h2>
  <div class="prose">
    {#each bio as para}<p>{para}</p>{/each}
    <blockquote>
      <p>“{quote.text}”</p>
      <footer>{quote.who}, <a href={quote.href}><cite>{quote.source}</cite></a></footer>
    </blockquote>
  </div>
</section>

<section class="wrap" aria-labelledby="elsewhere">
  <h2 id="elsewhere" class="section-title">Have a look around</h2>
  <div class="grid">
    {#each elsewhere as site (site.key)}
      <Card href={site.url} title={site.label} description={site.blurb} meta={site.url.replace('https://', '')} />
    {/each}
  </div>
</section>

<section class="wrap cols">
  <div aria-labelledby="work">
    <h2 id="work" class="section-title">Work</h2>
    <ol class="timeline">
      {#each experience as r (r.org)}
        <li>
          <span class="when">{r.when}</span>
          <div>
            <a class="org" href={r.href}>{r.org}</a>
            <p class="muted">{r.title}</p>
          </div>
        </li>
      {/each}
    </ol>
  </div>
  <div aria-labelledby="study">
    <h2 id="study" class="section-title">Study</h2>
    <ol class="timeline">
      {#each education as d (d.degree)}
        <li>
          <span class="when">{d.when}</span>
          <div>
            <span class="org">{d.school}</span>
            <p class="muted">{d.degree}{d.note ? ` · ${d.note}` : ''}</p>
          </div>
        </li>
      {/each}
    </ol>
  </div>
</section>

<section class="wrap contact" aria-labelledby="contact">
  <h2 id="contact" class="section-title">Get in touch</h2>
  <p>The quickest way to reach me is <a href={links.email}>email</a> or <a href={links.linkedin}>LinkedIn</a>.</p>
</section>

<style>
  section {
    margin-top: clamp(3rem, 7vw, 5.5rem);
  }
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
    gap: clamp(2rem, 6vw, 5rem);
    align-items: center;
    margin-top: clamp(2.5rem, 7vw, 5rem);
  }
  h1 {
    font-size: clamp(2.8rem, 8vw, 5.25rem);
    margin-top: 0.6rem;
  }
  .line {
    font-size: clamp(1.1rem, 2.2vw, 1.35rem);
    color: var(--muted);
    margin-top: 1.25rem;
    max-width: 34ch;
    line-height: 1.5;
  }
  .cta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 2rem;
  }
  .portrait {
    margin: 0;
    justify-self: end;
    width: min(100%, 380px);
    position: relative;
  }
  .portrait::before {
    content: '';
    position: absolute;
    inset: 14px -14px -14px 14px;
    border: 1px solid var(--accent);
    border-radius: calc(var(--radius) + 4px);
  }
  .portrait img {
    position: relative;
    width: 100%;
    height: auto;
    border-radius: calc(var(--radius) + 4px);
    box-shadow: var(--shadow);
  }
  .section-title {
    font-size: clamp(1.6rem, 3.5vw, 2.1rem);
    padding-bottom: 0.75rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--rule);
  }
  .prose {
    max-width: var(--measure);
    display: grid;
    gap: 1.1rem;
    font-size: 1.12rem;
  }
  blockquote {
    margin: 0.75rem 0 0;
    padding-left: 1.1rem;
    border-left: 2px solid var(--accent);
    font-family: var(--font-display);
    font-size: 1.15rem;
    font-weight: 300;
    color: var(--ink);
  }
  blockquote footer {
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: var(--muted);
    margin-top: 0.5rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
    gap: 1rem;
  }
  .cols {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
    gap: clamp(2rem, 5vw, 4rem);
  }
  .timeline {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 1.1rem;
  }
  .timeline li {
    display: grid;
    grid-template-columns: 8.5rem 1fr;
    gap: 1rem;
    align-items: baseline;
  }
  .when {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--muted);
  }
  .org {
    font-weight: 700;
    color: var(--ink);
  }
  a.org {
    text-decoration: none;
  }
  a.org:hover {
    color: var(--accent-ink);
    text-decoration: underline;
  }
  .muted {
    color: var(--muted);
    font-size: 0.95rem;
  }
  .contact p {
    font-size: 1.12rem;
  }
  @media (max-width: 760px) {
    .hero {
      grid-template-columns: 1fr;
    }
    .portrait {
      justify-self: start;
      width: min(100%, 300px);
      order: -1;
    }
    .timeline li {
      grid-template-columns: 1fr;
      gap: 0.15rem;
    }
  }
</style>
