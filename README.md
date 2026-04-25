# fg-crypt-dashboard

Public frontend for the **FG-CryptHub** crypto tracking suite. Hugo static site deployed to GitHub Pages, gated by Firebase Auth.

## Role in the suite

| Repo | Visibility | Role |
| --- | --- | --- |
| [fg-crypt-dashboard](https://github.com/FG-CryptHub/fg-crypt-dashboard) | **public** | Frontend UI — this repo |
| [fg-crypt-core](https://github.com/FG-CryptHub/fg-crypt-core) | private | Backend core — portfolio math, data store, HTTP API |
| [fg-crypt-ingest](https://github.com/FG-CryptHub/fg-crypt-ingest) | private | Data-loading jobs — pulls from exchanges/chains, writes to core's store |

```
┌──────────────┐       HTTP        ┌─────────────┐       reads        ┌──────────────┐
│  dashboard   │ ────────────────▶ │    core     │ ◀───────────────── │    ingest    │
│   (public)   │    (JSON/REST)    │  (private)  │   (shared store)   │  (private)   │
└──────────────┘                   └─────────────┘                    └──────────────┘
```

## Structure

```
content/
  _index.md              # Status tab (home dashboard)
  performance/_index.md  # Historical performance + XIRR
  setup/                 # Blog-style setup notes
    _index.md
    wallet-suite.md
    cash-flow.md
    key-management.md
layouts/
  _default/{baseof,list,single}.html
  index.html             # Status dashboard
  partials/
    head.html            # Injects Firebase + auth config from hugo.toml
    nav.html
    auth-gate.html       # Pre-auth sign-in card
    scripts.html         # Per-page JS loaders
static/
  css/app.css
  js/
    auth.js              # Firebase Auth + email allowlist
    api.js               # Authenticated fetch helper
    format.js            # USD / percent / date formatters
    status.js            # Home page data loader
    performance.js       # Performance page data loader
.github/workflows/deploy.yml  # Build + publish to GitHub Pages
hugo.toml                # Site + Firebase config (values, not secrets)
```

## Local development

Requires [Hugo extended](https://gohugo.io/installation/) ≥ 0.125.

```sh
hugo server -D
# http://localhost:1313
```

No build tooling, no npm. Firebase v10 is loaded as ESM from the official CDN.

## Configuration

All config lives in [`hugo.toml`](hugo.toml). Nothing here is a secret — Firebase web API keys are identifiers, not credentials.

### 1. Set up Firebase

1. Create a Firebase project → **Authentication** → enable **Google** provider.
2. **Authentication → Settings → Authorized domains** — add your GitHub Pages host (`fg-crypthub.github.io`) and `localhost` for dev.
3. Copy your web app config into `hugo.toml` under `[params.firebase]`:

```toml
[params.firebase]
  apiKey     = "..."
  authDomain = "your-project.firebaseapp.com"
  projectId  = "your-project"
  appId      = "..."
```

### 2. Email allowlist

Client-side allowlist in `[params.auth]`. Only listed emails can render the app shell:

```toml
[params.auth]
  allowedEmails = ["nguye208@gmail.com"]
```

### 3. API base URL

Once `fg-crypt-core` is deployed, point the dashboard at it:

```toml
[params.api]
  baseURL = "https://api.your-domain.example"
```

## Security model

- **The client allowlist is a UX layer, not a security boundary.** Anyone can clone this repo, change `allowedEmails`, and run it. That gets them a sign-in popup with *their* Google account — nothing else.
- **Real enforcement lives in `fg-crypt-core`.** Every request from the dashboard includes a Firebase ID token (`Authorization: Bearer …`). The core API must verify the token with the Firebase Admin SDK and check the email against its own server-side allowlist before returning data.
- **No secrets in this repo, ever.** Wallet addresses, transaction history, API keys belong in the private repos.

## Deployment

1. Push to `main` → GitHub Actions builds and deploys to GitHub Pages.
2. Repo **Settings → Pages → Source** must be set to **GitHub Actions**.
3. First deploy: verify `baseURL` in `hugo.toml` matches the Pages URL (defaults to `https://fg-crypthub.github.io/fg-crypt-dashboard/`).

## Tabs

| Route | Layout | Contents |
| --- | --- | --- |
| `/` | `layouts/index.html` | Live KPIs (total value, 24h, P/L, XIRR), holdings table, wallets list |
| `/performance/` | `layouts/_default/list.html` | XIRR breakdown (YTD / 1Y / 3Y / all), value chart placeholder, cash flow table |
| `/setup/` | `layouts/_default/list.html` + `single.html` | Blog-style notes on wallet suite design, cash-flow patterns, key management |

## Expected API shape (from `fg-crypt-core`)

```
GET /v1/status
{
  "updatedAt": "2026-04-23T12:00:00Z",
  "totalValue": 123456.78,
  "change24h": 0.0123,
  "pnl": 34567.89,
  "xirr": 0.28,
  "holdings": [ { "asset": "BTC", "amount": 1.234, "value": 75000, "weight": 0.6 }, ... ],
  "wallets":  [ { "name": "Hot", "value": 1234.56 }, ... ]
}

GET /v1/performance
{
  "xirr":    { "ytd": 0.12, "1y": 0.28, "3y": 0.45, "all": 0.33 },
  "history": [ { "date": "2026-01-01", "value": 100000 }, ... ],
  "cashflow":[ { "date": "2026-01-15", "type": "contribution", "amount": 5000 }, ... ]
}
```

Requests include `Authorization: Bearer <firebase-id-token>`. Endpoints, pagination, and error shape are the core repo's to define.
