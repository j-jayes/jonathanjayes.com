---
name: large-files-and-git
description: How large binary data files (.rds, etc.) are handled in this repo to keep git history lean. Use this when asked about data file management, re-executing old posts, adding new large data files, or further history cleanup.
---

## Problem

The `posts/` directory contains R binary data files (`.rds`) used by Quarto/R posts as intermediate analysis artefacts. These files are large (some 60+ MB) and totalled ~323 MB across 43 files, bloating the repo significantly.

## Solution: ignore + history purge

### What was done (May 2026)

1. **Added `**/*.rds` to `.gitignore`** — prevents any `.rds` file anywhere in the repo from ever being tracked again.

2. **Removed all 43 tracked `.rds` files from the git index** without deleting them from disk:
   ```powershell
   git rm --cached $(git ls-files "*.rds")
   git add .gitignore
   git commit -m "chore: stop tracking .rds binary data files, add to .gitignore"
   ```

3. **Purged `.rds` files from all historical commits** using `git filter-repo`:
   ```powershell
   # Install (once)
   pip install git-filter-repo

   # Rewrite history — removes every .rds from every commit
   & "C:\Users\<you>\AppData\Roaming\Python\Python312\Scripts\git-filter-repo.exe" `
       --path-glob "*.rds" --invert-paths --force
   ```
   > Note: `git filter-repo` intentionally removes the `origin` remote as a safety guard. Re-add it manually before pushing.

4. **Re-added remote and force-pushed**:
   ```powershell
   git remote add origin https://github.com/j-jayes/jonathanjayes.com.git
   git push --force origin main
   ```

### Why this is safe

- The `_freeze/` directory is committed to the repo. Quarto reads frozen execution results from there, so **no post needs to be re-executed** just to render the site.
- The `.rds` files remain on local disk (only removed from git tracking), so existing local development workflows are unaffected.

## If you need to re-execute an old post

If you want to re-run R code in a post from scratch (not use the freeze cache), the `.rds` source data needs to be available locally. Options:

- **Keep them locally** — they're still on disk, just untracked. Running `quarto render posts/<slug>/` will work fine.
- **Archive to GCS** — for long-term storage, upload to a GCS bucket (`gs://jonathanjayes-blog-data/posts/...`) and add a download snippet at the top of the post's `.qmd`:
  ```r
  if (!file.exists("data/raw.rds")) {
    googleCloudStorageR::gcs_get_object(
      "posts/2021-05-04-fired/data/raw.rds",
      saveToDisk = "data/raw.rds"
    )
  }
  ```

## Adding new data files in future posts

- **Never commit `.rds` files** — they are gitignored.
- For small lookup tables or CSVs (< 1 MB): committing is fine.
- For large data (> 5 MB): store externally (GCS, GitHub Releases, or a public URL) and download at render time.
- After running a post, make sure `_freeze/` captures the output so others can render without the data.

## Other large-file warnings in this repo

GitHub also warned about large files still present in historical commits for:
- `docs/index.xml` (RSS feed, up to 93 MB in old commits)
- `docs/posts/2022-10-17-our-world-in-data-choropleth/our-world-in-data-choropleth.html` (~85 MB, contains embedded ggiraph JS)
- `_freeze/posts/2022-10-17-our-world-in-data-choropleth/.../html.json` (~85 MB)

These are warnings only (not blocking pushes). They relate to rendered output files in old commits; the current HEAD versions may differ. A future `filter-repo` pass targeting these paths could further shrink the repo if needed.
