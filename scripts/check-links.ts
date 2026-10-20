/** Check that every visible catalogue entry's live and repo links answer with 2xx or 3xx. */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { load } from 'js-yaml';

type Entry = { slug: string; live: string; repo?: string; hidden?: boolean };
const items = (load(readFileSync(resolve(import.meta.dirname, '../data/catalogue.yaml'), 'utf8')) as Entry[]).filter((i) => !i.hidden);

const check = async (url: string) => {
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'user-agent': 'jonathanjayes.com link check' } });
    return res.status;
  } catch {
    return 0;
  }
};

let bad = 0;
await Promise.all(
  items.flatMap((i) =>
    [i.live, i.repo].filter(Boolean).map(async (url) => {
      const status = await check(url!);
      const ok = status >= 200 && status < 400;
      if (!ok) bad++;
      console.log(`${ok ? 'ok ' : 'BAD'} ${status} ${i.slug} ${url}`);
    })
  )
);
if (bad) {
  console.error(`${bad} broken link(s)`);
  process.exit(1);
}
