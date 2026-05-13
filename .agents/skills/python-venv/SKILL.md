---
name: python-venv
description: How Python virtual environments are set up for this Quarto blog so that Python code cells use the project .venv instead of the global environment. Use this when asked to add Python packages, run Python code in posts, set up on a new machine, or troubleshoot Python execution in Quarto.
---

## Overview

A Python virtual environment lives at `.venv/` in the project root. Quarto automatically detects and uses it when rendering `.qmd` files that contain Python code cells (using the Jupyter engine).

The `.venv/` directory is gitignored (via `.venv/*` in `.gitignore`). A `requirements.txt` at the project root is committed so the environment can be reproduced.

## Initial setup (done May 2026)

```powershell
# Create the venv
python -m venv .venv

# Activate it
.venv\Scripts\Activate.ps1

# Install jupyter (required for Quarto Python execution) + any other packages
python -m pip install --upgrade pip jupyter

# Freeze to requirements.txt
python -m pip freeze > requirements.txt
```

> **PowerShell note:** If `Activate.ps1` fails with a "running scripts is disabled" error, run once:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
> ```

## Reproducing the environment on a new machine

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

## Adding new packages

```powershell
# Activate the venv first
.venv\Scripts\Activate.ps1

# Install the package
python -m pip install <package-name>

# Update requirements.txt
python -m pip freeze > requirements.txt

# Commit the updated requirements.txt
git add requirements.txt
git commit -m "chore: add <package-name> to requirements.txt"
```

## How Quarto discovers the venv

Quarto uses the Jupyter engine for Python code cells. When `.venv/` is present in the project root, Quarto automatically picks it up — no extra configuration needed in `_quarto.yml`.

You can verify which Python Quarto will use with:

```powershell
quarto check jupyter
```

The output should show a path inside `.venv/`.

## RStudio / reticulate (mixed R + Python posts)

If a post contains both `{r}` and `{python}` chunks, Quarto uses the Knitr engine and reticulate. To point reticulate at the `.venv` Python, add this to `.Rprofile` in the project root:

```r
Sys.setenv(RETICULATE_PYTHON = ".venv/Scripts/python.exe")  # Windows
# Sys.setenv(RETICULATE_PYTHON = ".venv/bin/python")        # Mac/Linux
```

## Current baseline packages

The `.venv` was bootstrapped with `jupyter` (and its full dependency tree — ~97 packages). See `requirements.txt` for the full pinned list.

Common packages to add for data-science posts:
- `pandas`, `matplotlib`, `seaborn` — data wrangling and plotting
- `plotly` — interactive charts
- `scikit-learn` — ML
- `polars` — fast DataFrames
