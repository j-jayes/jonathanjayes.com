---
name: catalogue
description: How talks.jonathanjayes.com and projects.jonathanjayes.com are built from data/catalogue.yaml. Use when adding, hiding or regrouping a talk, workshop, course or project, or refreshing thumbnails.
---

## One app, two sites

`apps/catalogue` builds twice. `SECTION=talks` or `SECTION=projects` (set by the `build:talks` and `build:projects` scripts) picks which entries to show and writes to `build-talks/` or `build-projects/`. `vite.config.ts` exposes it to code as `__SECTION__`.

## Data

`data/catalogue.yaml` is the only source. `apps/catalogue/src/lib/catalogue.ts` validates it with zod and fails the build on an unknown field, an unknown `group`, a bad URL or a duplicate `slug`.

Groups, in display order:

| section | groups |
|---|---|
| talks | talk, workshop, teaching |
| projects | scrolly, website, tool, template, analysis |

Within a group, `featured: true` comes first, then newest `date`. `hidden: true` keeps an entry off the site. Leave `repo` out for private repos and the card shows "Private repo".

Client work or anything internal to Nexer should stay `hidden: true` unless Jonathan says otherwise.

## Thumbnails

`pnpm thumbs` screenshots each visible `live` URL with Playwright into `apps/catalogue/static/thumbs/<slug>.webp` (800x500). Existing files are skipped. Use `--force` to redo all or `--only a,b` for specific slugs. The page shows a card without an image when no thumbnail exists.

`pnpm check-links` checks every visible `live` and `repo` URL.
