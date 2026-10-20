/**
 * Pull the latest Instagram posts into data/instagram.json and apps/insta/static/ig/.
 *
 *   INSTAGRAM_ACCESS_TOKEN=... pnpm ig:fetch            fetch posts
 *   INSTAGRAM_ACCESS_TOKEN=... pnpm ig:fetch --refresh   fetch, then refresh the token
 *   INSTAGRAM_ACCESS_TOKEN=... pnpm ig:refresh           only refresh the token
 *
 * Uses the Instagram API with Instagram Login (Creator or Business account).
 * Media URLs from Instagram's CDN expire, so every image is downloaded and
 * re-encoded as WebP; the JSON never holds a CDN URL or the token.
 *
 * With --refresh, the new long-lived token is written to $GITHUB_OUTPUT as
 * `token` (masked) so the workflow can store it with `gh secret set`.
 */
import { appendFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const API = 'https://graph.instagram.com';
const LIMIT = 48;
const root = resolve(import.meta.dirname, '..');
const imgDir = resolve(root, 'apps/insta/static/ig');
const jsonPath = resolve(root, 'data/instagram.json');

const token = process.env.INSTAGRAM_ACCESS_TOKEN;
if (!token) {
  console.error('INSTAGRAM_ACCESS_TOKEN is not set');
  process.exit(1);
}

const args = new Set(process.argv.slice(2));

interface Media {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  children?: { data: { id: string; media_type: string; media_url?: string }[] };
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const body = await res.text();
  if (!res.ok) {
    // Never echo the URL, it carries the token.
    throw new Error(`Instagram API ${res.status}: ${body.slice(0, 300)}`);
  }
  return JSON.parse(body) as T;
}

async function fetchPosts() {
  const me = await get<{ username: string }>(`${API}/me?fields=username&access_token=${token}`);
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{id,media_type,media_url}';
  let next: string | undefined = `${API}/me/media?fields=${encodeURIComponent(fields)}&limit=25&access_token=${token}`;
  const media: Media[] = [];
  while (next && media.length < LIMIT) {
    const page: { data: Media[]; paging?: { next?: string } } = await get(next);
    media.push(...page.data);
    next = page.paging?.next;
  }

  mkdirSync(imgDir, { recursive: true });
  const posts = [];
  for (const m of media.slice(0, LIMIT)) {
    const src = m.media_type === 'VIDEO' ? m.thumbnail_url : (m.media_url ?? m.children?.data.find((c) => c.media_url)?.media_url);
    if (!src) continue;
    const file = `${m.id}.webp`;
    const out = resolve(imgDir, file);
    if (!existsSync(out)) {
      const res = await fetch(src);
      if (!res.ok) {
        console.warn(`skip ${m.id}: image download ${res.status}`);
        continue;
      }
      await sharp(Buffer.from(await res.arrayBuffer())).resize(720, 720, { fit: 'cover' }).webp({ quality: 78 }).toFile(out);
    }
    posts.push({
      id: m.id,
      caption: (m.caption ?? '').trim(),
      mediaType: m.media_type,
      permalink: m.permalink,
      timestamp: m.timestamp,
      image: `/ig/${file}`,
      width: 720,
      height: 720,
      count: m.children?.data.length ?? 1
    });
  }

  // Drop images that are no longer in the feed.
  const keep = new Set(posts.map((p) => `${p.id}.webp`));
  for (const f of readdirSync(imgDir)) if (f.endsWith('.webp') && !keep.has(f)) rmSync(resolve(imgDir, f));

  writeFileSync(jsonPath, JSON.stringify({ fetchedAt: new Date().toISOString(), username: me.username, posts }, null, 2) + '\n');
  console.log(`Wrote ${posts.length} posts for @${me.username}`);
}

async function refreshToken() {
  const r = await get<{ access_token: string; expires_in: number }>(
    `${API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
  );
  const days = Math.round(r.expires_in / 86400);
  console.log(`Token refreshed, valid for ${days} more days`);
  if (process.env.GITHUB_OUTPUT) {
    console.log(`::add-mask::${r.access_token}`);
    appendFileSync(process.env.GITHUB_OUTPUT, `token=${r.access_token}\n`);
  }
}

if (!args.has('--refresh-only')) await fetchPosts();
if (args.has('--refresh') || args.has('--refresh-only')) await refreshToken();
