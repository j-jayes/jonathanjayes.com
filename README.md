# jonathanjayes.com

The SvelteKit sites around my blog. One pnpm workspace, four static sites on Firebase Hosting.

| Site | App | Firebase site |
|---|---|---|
| [jonathanjayes.com](https://jonathanjayes.com) | `apps/home` | `jonathanjayes-home` |
| [talks.jonathanjayes.com](https://talks.jonathanjayes.com) | `apps/catalogue`, built with `SECTION=talks` | `jonathanjayes-talks` |
| [projects.jonathanjayes.com](https://projects.jonathanjayes.com) | `apps/catalogue`, built with `SECTION=projects` | `jonathanjayes-projects` |
| [insta.jonathanjayes.com](https://insta.jonathanjayes.com) | `apps/insta` | `jonathanjayes-insta` |

The blog itself lives in [j-jayes/blog](https://github.com/j-jayes/blog) and the cookbook in [j-jayes/recipes](https://github.com/j-jayes/recipes).

## Working on it

```bash
pnpm install
pnpm dev              # home page
pnpm dev:talks        # talks catalogue
pnpm dev:projects     # projects catalogue
pnpm dev:insta        # instagram grid
pnpm build            # all four sites
```

Node 22 and pnpm 10. SvelteKit 3 takes its config through the `sveltekit()` plugin in each `vite.config.ts`, and `#lib/...` replaces `$lib`.

## Adding a talk or project

Add an entry to `data/catalogue.yaml`. The header of that file documents the fields. Then grab a thumbnail and check the links:

```bash
pnpm thumbs --only my-slug     # screenshot into apps/catalogue/static/thumbs/
pnpm check-links
```

`hidden: true` keeps an entry in the file but off the site. A bad `group` or a duplicate `slug` fails the build.

## Home page copy

All of it is in `apps/home/src/lib/content.ts`. The CV is `apps/home/static/cv/Jonathan-Jayes-CV.pdf`, so replacing that file keeps the link stable.

## Instagram

`.github/workflows/instagram-sync.yml` runs daily. It pulls the latest posts with the Instagram API with Instagram Login, saves the images as WebP in `apps/insta/static/ig/`, writes `data/instagram.json`, refreshes the 60-day token, commits, and deploys the insta site.

It needs two repository secrets:

| Secret | What |
|---|---|
| `INSTAGRAM_ACCESS_TOKEN` | A long-lived token for a Creator or Business account |
| `GH_PAT` | A fine-grained token for this repo with *Secrets: read and write*, so the workflow can store the refreshed token |

## Deploys

A push to `main` builds and deploys only the sites whose files changed (`.github/workflows/deploy.yml`). Pull requests get Firebase preview channels. You can also deploy by hand:

```bash
firebase deploy --only hosting:home
```
