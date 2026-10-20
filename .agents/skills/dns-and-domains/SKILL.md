---
name: dns-and-domains
description: DNS and domain configuration for jonathanjayes.com and its subdomains (blog, talks, projects, insta, recipes). Use this when asked to change DNS records, troubleshoot domain resolution, manage SSL certificates, or switch DNS providers.
---

## Domain registrar

**Bluehost** is the domain registrar for `jonathanjayes.com`.

Bluehost DNS management: https://www.bluehost.com/hosting/my-account → Domains → DNS

Nameservers are set to Bluehost defaults:
- `NS1.BLUEHOST.COM`
- `NS2.BLUEHOST.COM`

## DNS records (Bluehost)

Values as returned by the Firebase Hosting customDomains API on 2026-10-20.

| Type | Host | Value | Status (2026-10-20) |
|---|---|---|---|
| CNAME | `blog` | `jonathanjayes-com.web.app` | live |
| A | `@` | `199.36.158.100` | to do; **delete** the Bluehost parking A `66.81.203.198` |
| TXT | `@` | `hosting-site=jonathanjayes-home` | to do |
| TXT | `_acme-challenge` | `DqKyNH-BRxOzu6NX-94mzre9jFPEcX8iZFY41QfpSGg` | to do |
| CNAME | `www` | `jonathanjayes-home.web.app` | to do; registered in Firebase as a redirect to the apex |
| TXT | `_acme-challenge.www` | `0-djSXcSrthFCZ5j__X9yh4erWIpoLyBn8KoTpBg-o0` | to do |
| CNAME | `talks` | `jonathanjayes-talks.web.app` | to do |
| TXT | `_acme-challenge.talks` | `cyoRFvLbDWxNxJetMrGaw9aDNRbRQ5-7h11rfc4Tm4o` | to do |
| CNAME | `projects` | `jonathanjayes-projects.web.app` | to do |
| TXT | `_acme-challenge.projects` | `8Kf2_uoHgMSkgxDoryD50gyz7UF_VfHFPmyAV2s4WcU` | to do |
| CNAME | `insta` | `jonathanjayes-insta.web.app` | to do |
| TXT | `_acme-challenge.insta` | `zcPettFsUpu2Gp3uSZBQiMOS5akkAWmIslfP73Sd6o0` | to do |
| CNAME | `recipes` | `j-jayes.github.io` | to do; then push branch `custom-domain` in `j-jayes/recipes` and set the Pages custom domain |

If `www` already exists as a CNAME to the apex or as an A record, replace it. Leave MX records alone. Re-read the required records from the API (firebase-hosting skill) if a cert stalls, since Firebase can rotate the ACME values.

## Old domain

`interludeone.com` (Bluehost, Netlify DNS, expires 2027-03-13) serves `docs/` of the archived `j-jayes/interlude-one` repo. `docs/_redirects` there sends every path to the same path on blog.jonathanjayes.com with a 301.

## Google Cloud DNS zone (inactive)

A Cloud DNS zone named `jonathanjayes-zone` exists in GCP project `jonathanjayes-com` but is **not active** — Bluehost nameservers are in control, not Google's. The zone has A records (199.36.158.100/101), TXT, CNAME, and NS records from an earlier experiment. It can be left in place or deleted; it has no effect on live traffic.

```bash
gcloud dns managed-zones list --project jonathanjayes-com
gcloud dns record-sets list --zone jonathanjayes-zone --project jonathanjayes-com
```

## Switching to Google Cloud DNS in future

If you ever want to move DNS management to Google Cloud DNS (not needed: Bluehost A records work for the apex):

1. In Google Cloud DNS, create A records pointing `jonathanjayes.com` to Firebase IPs (`199.36.158.100`, `199.36.158.101`)
2. Note the 4 NS records Google assigns to the zone
3. In Bluehost → Domains → Nameservers → **"Change Nameservers"**: enter Google's NS values
   - Do **not** use the "Custom Nameservers" section — it requires glue IPs, which Google doesn't provide for external domains
4. Wait up to 48 h for propagation

## Firebase custom domain verification

Firebase verifies subdomain ownership by checking the CNAME resolves to its hosting URL. No TXT record is required for `blog.jonathanjayes.com` — the CNAME alone is sufficient.

For the **apex domain** (`jonathanjayes.com`), Firebase requires an A record (CNAMEs are not allowed at the apex per RFC 1034).

## SSL certificates

Firebase provisions SSL certificates automatically via Let's Encrypt once DNS verification passes.

| Status | Meaning |
|---|---|
| `CERT_PENDING` | Certificate being minted (normal; wait up to 1 hour) |
| `CERT_ACTIVE` | Certificate live, HTTPS working |
| `DOMAIN_ACTIVE` | Domain verified and cert active |
| `DOMAIN_VERIFICATION_LOST` | DNS no longer resolves to Firebase (check CNAME/A records) |

Check status via API:

```bash
export PATH="/opt/homebrew/bin:$HOME/.npm-global/bin:$PATH"
ACCESS_TOKEN=$(gcloud auth print-access-token \
  --account=j0nathanjayes@gmail.com \
  --project=jonathanjayes-com)
curl -s \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "x-goog-user-project: jonathanjayes-com" \
  "https://firebasehosting.googleapis.com/v1beta1/sites/jonathanjayes-com/domains" \
  | python3 -m json.tool | grep -E "domainName|status"
```

## Quick DNS propagation check

```bash
# Check CNAME
dig blog.jonathanjayes.com CNAME +short

# Check resolved IP (should be a Firebase IP e.g. 199.36.158.100)
dig blog.jonathanjayes.com A +short
```
