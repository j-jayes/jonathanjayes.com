import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { load as parseYaml } from 'js-yaml';
import { buildSection, sections } from '#lib/catalogue.ts';

export const prerender = true;

export function load() {
  const section = __SECTION__;
  const root = resolve(process.cwd(), '../..');
  const raw = parseYaml(readFileSync(resolve(root, 'data/catalogue.yaml'), 'utf8'));

  const thumb = (slug: string) =>
    existsSync(resolve(process.cwd(), `static/thumbs/${slug}.webp`)) ? `/thumbs/${slug}.webp` : undefined;

  return {
    section,
    meta: { title: sections[section].title, intro: sections[section].intro },
    groups: buildSection(raw, section, thumb)
  };
}
