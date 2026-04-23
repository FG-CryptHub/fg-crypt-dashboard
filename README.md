# fg-crypt-dashboard

Public frontend for the **FG-CryptHub** crypto tracking suite. This is where portfolio performance, balances, and cash-flow views are rendered.

## Role in the suite

| Repo | Visibility | Role |
| --- | --- | --- |
| [fg-crypt-dashboard](https://github.com/FG-CryptHub/fg-crypt-dashboard) | **public** | Frontend UI — this repo |
| [fg-crypt-api](https://github.com/FG-CryptHub/fg-crypt-api) | private | Backend API — portfolio calc, auth, serves dashboard |
| [fg-crypt-ingest](https://github.com/FG-CryptHub/fg-crypt-ingest) | private | Data-loading jobs — pulls from exchanges/chains, writes to the API's store |

```
┌──────────────┐       HTTP        ┌─────────────┐       reads        ┌──────────────┐
│  dashboard   │ ────────────────▶ │     api     │ ◀───────────────── │    ingest    │
│   (public)   │    (JSON/REST)    │  (private)  │   (shared store)   │  (private)   │
└──────────────┘                   └─────────────┘                    └──────────────┘
```

## What lives here

- UI code only. No secrets, no wallet addresses, no API keys.
- Read-only view of data served by `fg-crypt-api`.
- Safe to be public — anything sensitive belongs in the private repos.

## What does **not** live here

- Transaction history, cost-basis logic, or wallet addresses → `fg-crypt-api`
- Exchange/chain credentials or sync jobs → `fg-crypt-ingest`

## Getting started

_TBD — scaffold pending._
