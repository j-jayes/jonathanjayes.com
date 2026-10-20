---
name: firebase-hosting
description: Deploying and debugging the four Firebase Hosting sites in this repo (home, talks, projects, insta). Use when asked to deploy, add a site, connect a custom domain, or fix the GitHub Actions deploy.
---

## Identifiers

| Key | Value |
|---|---|
| Firebase / GCP project | `jonathanjayes-com` |
| GCP account | `j0nathanjayes@gmail.com` |
| Deploy secret (GitHub) | `FIREBASE_SERVICE_ACCOUNT_JONATHANJAYES_COM` |

| Target | Site ID | Default URL | Custom domain | Build output |
|---|---|---|---|---|
| home | `jonathanjayes-home` | jonathanjayes-home.web.app | jonathanjayes.com, www | `apps/home/build` |
| talks | `jonathanjayes-talks` | jonathanjayes-talks.web.app | talks.jonathanjayes.com | `apps/catalogue/build-talks` |
| projects | `jonathanjayes-projects` | jonathanjayes-projects.web.app | projects.jonathanjayes.com | `apps/catalogue/build-projects` |
| insta | `jonathanjayes-insta` | jonathanjayes-insta.web.app | insta.jonathanjayes.com | `apps/insta/build` |

The blog is a fifth site, `jonathanjayes-com`, deployed from the `j-jayes/blog` repo. This repo never touches it.

## Commands

```bash
export PATH="/opt/homebrew/bin:$HOME/.npm-global/bin:$PATH"
pnpm build:home && firebase deploy --only hosting:home
firebase hosting:channel:deploy preview --only home   # throwaway preview URL
firebase hosting:sites:list
```

## CI

`.github/workflows/deploy.yml` uses `dorny/paths-filter` to work out which sites changed, then runs one matrix job per site with `FirebaseExtended/action-hosting-deploy@v0` and `target:`. Changes under `packages/`, the lockfile or `firebase.json` redeploy all four. It can also be run by hand or called from another workflow with `app: <target>`.

## Custom domains

The Firebase CLI cannot add custom domains. Use the console: Hosting, pick the site, Add custom domain. It shows the DNS records to add at Bluehost (see the dns-and-domains skill). Certificates are issued automatically once DNS resolves.

Status via API:

```bash
TOKEN=$(gcloud auth print-access-token --account=j0nathanjayes@gmail.com)
for s in jonathanjayes-home jonathanjayes-talks jonathanjayes-projects jonathanjayes-insta; do
  curl -s -H "Authorization: Bearer $TOKEN" -H "x-goog-user-project: jonathanjayes-com" \
    "https://firebasehosting.googleapis.com/v1beta1/projects/jonathanjayes-com/sites/$s/customDomains" | python3 -m json.tool | grep -E '"name"|hostState|ownershipState|certState'
done
```
