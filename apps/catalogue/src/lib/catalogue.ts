import { z } from 'zod';

export type Section = 'talks' | 'projects';

export const sections = {
  talks: {
    title: 'Talks and workshops',
    intro:
      'Slides from talks and seminars, workshop material and course sites from teaching. Each one links to the live page and, where the repo is public, the code behind it.',
    groups: [
      { key: 'talk', label: 'Talks' },
      { key: 'workshop', label: 'Workshops' },
      { key: 'teaching', label: 'Teaching' }
    ]
  },
  projects: {
    title: 'Projects',
    intro:
      'Scrollytelling pieces, websites, small tools and analyses. Each one links to the live page and, where the repo is public, the code behind it.',
    groups: [
      { key: 'scrolly', label: 'Scrollytelling' },
      { key: 'website', label: 'Websites' },
      { key: 'tool', label: 'Tools' },
      { key: 'template', label: 'Templates' },
      { key: 'analysis', label: 'Analysis' }
    ]
  }
} as const;

const dateish = z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v));

export const Item = z
  .object({
    slug: z.string().min(1),
    section: z.enum(['talks', 'projects']),
    group: z.string(),
    title: z.string().min(1),
    description: z.string().default(''),
    date: dateish,
    live: z.string().url(),
    repo: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    hidden: z.boolean().default(false)
  })
  .strict();

export type Item = z.infer<typeof Item> & { thumb?: string };

export interface Group {
  key: string;
  label: string;
  items: Item[];
}

/** Validate every entry, then slice, group and sort one section. Throws on bad data so the build fails loudly. */
export function buildSection(raw: unknown, section: Section, hasThumb: (slug: string) => string | undefined): Group[] {
  const all = z.array(Item).parse(raw);

  const seen = new Set<string>();
  for (const item of all) {
    if (seen.has(item.slug)) throw new Error(`Duplicate slug in catalogue.yaml: ${item.slug}`);
    seen.add(item.slug);
    const groups = sections[item.section].groups.map((g) => g.key) as string[];
    if (!groups.includes(item.group)) {
      throw new Error(`${item.slug}: group "${item.group}" is not one of ${groups.join(', ')} for section ${item.section}`);
    }
  }

  const visible = all.filter((i) => i.section === section && !i.hidden).map((i) => ({ ...i, thumb: hasThumb(i.slug) }));

  return sections[section].groups
    .map((g) => ({
      key: g.key,
      label: g.label,
      items: visible
        .filter((i) => i.group === g.key)
        .sort((a, b) => Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
    }))
    .filter((g) => g.items.length > 0);
}

export function formatDate(d: string): string {
  const [y, m] = d.split('-');
  if (!m) return y;
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}
