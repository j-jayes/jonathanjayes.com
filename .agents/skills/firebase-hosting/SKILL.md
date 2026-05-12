---
name: firebase-hosting
description: Everything needed to deploy, manage, and debug Firebase Hosting for this project. Use this when asked to deploy the site, troubleshoot hosting, manage custom domains, or work with GitHub Actions CI/CD for Firebase.
---

## Project identifiers

| Key | Value |
|-----|-------|
| GCP / Firebase project ID | `jonathanjayes-com` |
| GCP project number | `834389686353` |
| GCP account | `j0nathanjayes@gmail.com` |
| Billing account | `01C287-84B1DF-3C7AE1` (Blaze / Kingfisher) |
| Default hosting URL | `https://jonathanjayes-com.web.app` |
| Live custom domain | `https://blog.jonathanjayes.com` |

## CLI prerequisites

Node.js 22 (via Homebrew) and firebase-tools must be on PATH:

```bash
export PATH="/opt/homebrew/bin:$HOME/.npm-global/bin:$PATH"
```

Check versions:

```bash
node --version   # v22.x
firebase --version  # 15.17.0+
```

## Common deploy commands

```bash
# Deploy only hosting (fastest – uses existing docs/ build)
firebase deploy --only hosting

# Full deploy
firebase deploy

# Preview channel deploy (does not affect live)
firebase hosting:channel:deploy preview_name
```

The `firebase.json` serves from `docs/` (Quarto's output directory):

```json
{
  "hosting": {
    "public": "docs",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "cleanUrls": true,
    "trailingSlash": false
  }
}
```

## GitHub Actions CI/CD

Two workflows exist in `.github/workflows/`:

| Workflow file | Trigger | Target |
|---|---|---|
| `firebase-hosting-merge.yml` | push to `main` | live channel |
| `firebase-hosting-pull-request.yml` | PR against `main` | preview channel |

Both workflows:
1. Check out the repo
2. Install Quarto + R 4.4 + renv dependencies
3. Run `quarto render`
4. Deploy via `FirebaseExtended/action-hosting-deploy@v0`

**Required GitHub secret**: `FIREBASE_SERVICE_ACCOUNT_JONATHANJAYES_COM`
(Service account JSON for the `jonathanjayes-com` Firebase project.)

## Custom domains

| Domain | Status | Notes |
|---|---|---|
| `blog.jonathanjayes.com` | Active (SSL auto-provisioned) | Primary custom domain |
| `jonathanjayes.com` | Needs setup | Not pointed at Firebase; ignore |

To inspect domain status via the API (useful when the Firebase Console UI is laggy):

```bash
export PATH="/opt/homebrew/bin:$HOME/.npm-global/bin:$PATH"
ACCESS_TOKEN=$(gcloud auth print-access-token \
  --account=j0nathanjayes@gmail.com \
  --project=jonathanjayes-com)
curl -s \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "x-goog-user-project: jonathanjayes-com" \
  "https://firebasehosting.googleapis.com/v1beta1/sites/jonathanjayes-com/domains" \
  | python3 -m json.tool
```

Key status values: `DOMAIN_ACTIVE`, `DOMAIN_VERIFICATION_LOST`, `CERT_PENDING`, `DNS_MATCH`.

## Firebase Console shortcut

https://console.firebase.google.com/project/jonathanjayes-com/hosting/sites/jonathanjayes-com/domains

## Known gotchas

- The Firebase CLI has **no `hosting:domain:add` command** — custom domains must be added via the Firebase Console UI.
- When adding a domain, a 409 error in the UI does not always mean failure — verify via the API call above before retrying.
- `.firebase/` is gitignored; it holds local deploy cache and should not be committed.
- GitHub Actions renders Quarto from source. If `freeze: auto` is set, pre-rendered outputs in `_freeze/` are used for posts that have not changed.
