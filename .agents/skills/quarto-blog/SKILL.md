---
name: quarto-blog
description: How the Quarto blog is structured, configured, and rendered. Use this when asked to add posts, modify site configuration, render the site, manage R dependencies, or understand the project layout.
---

## Site overview

This is a Quarto website blog (type: `website`) migrated from the `j-jayes/interlude-one` GitHub repo. Source lives in `j-jayes/jonathanjayes.com`.

Live URL: `https://blog.jonathanjayes.com`

## Key configuration – `_quarto.yml`

```yaml
project:
  type: website
  output-dir: docs        # Firebase Hosting serves from docs/
  render:
    - "*.qmd"
    - "*.Rmd"
    - "!posts/2021-07-28-spanish-flu-mortality/*.Rmd"   # excluded – slow/broken

website:
  title: "Jonathan Jayes"
  site-url: https://blog.jonathanjayes.com/
  favicon: assets/favicon.ico

format:
  html:
    theme: assets/custom.scss
    toc: true
```

Analytics via GoatCounter (`https://j0nathan.goatcounter.com/count`) injected in `include-in-header`.

## Directory layout

| Path | Purpose |
|---|---|
| `index.qmd` | Homepage listing |
| `about.qmd` | About page |
| `cv.qmd` | CV page |
| `posts/` | Blog posts (each in its own sub-folder) |
| `content/` | Static pages (research, publications, teaching, data) |
| `assets/` | SCSS theme, favicons, images |
| `docs/` | **Rendered output** (committed to git; served by Firebase) |
| `_freeze/` | Frozen render cache for R/Python posts |
| `_extensions/` | Quarto extensions (e.g. Font Awesome) |
| `_variables.yml` | Shared variables referenced in `.qmd` files |

## Rendering locally

```bash
# Full render (slow – re-renders everything)
quarto render

# Preview with live reload
quarto preview

# Render a single file
quarto render posts/my-post/index.qmd
```

Requires R 4.4+ and packages managed via `renv`. Run `renv::restore()` in R to install dependencies before first render.

## Freeze behaviour

`freeze: auto` (or `freeze: true` in individual posts) means Quarto skips re-executing code cells if the source hasn't changed. Frozen outputs are stored in `_freeze/` and committed to git.

**Implication for CI/CD**: GitHub Actions renders from source using R, so R-based posts re-execute on every push unless their `_freeze/` entry is committed.

## Adding a new post

1. Create a folder under `posts/YYYY-MM-DD-post-slug/`
2. Add `index.qmd` with YAML front matter:
   ```yaml
   ---
   title: "Post title"
   date: "YYYY-MM-DD"
   categories: [r, analysis]
   image: image.png
   ---
   ```
3. Run `quarto render` locally to generate output in `docs/`
4. Commit both source (`posts/`) and rendered output (`docs/`, `_freeze/`)
5. Push to `main` — GitHub Actions will re-render and deploy automatically

## Rproj

`quarto-template.Rproj` is the RStudio project file. Open it in RStudio to get the correct working directory and renv context.

## Known gotchas

- `docs/` is **committed to git** and is the source of truth served by Firebase. Do not add it to `.gitignore`.
- The excluded post `posts/2021-07-28-spanish-flu-mortality/` has `.Rmd` files that are explicitly skipped in `_quarto.yml` render list.
- `index.html` in the repo root is a redirect shim from before the Quarto site was set up; it is superseded by `docs/index.html`.
- The GitHub Actions workflow installs R packages via `r-lib/actions/setup-renv@v2`, which reads `renv.lock`. If new R packages are added locally, run `renv::snapshot()` and commit `renv.lock`.
