---
title: "Cash-flow wallet pattern"
description: "A dedicated wallet for predictable inflows and outflows, sized to a known runway, with automatic sweeps above a threshold."
weight: 20
---

A **cash-flow wallet** is a ring-fenced address whose only job is to handle recurring money in and out — salary converted to crypto, subscriptions, stablecoin yields, regular DCA purchases. It exists so that operational noise never touches your long-term stack.

## Design goals

1. **Predictable balance.** At a glance you know whether the wallet has runway for the next *N* weeks of outflows.
2. **Clean accounting.** Every tx in the cash-flow wallet maps to a known line item (payroll, subscription, DCA, rebalance sweep). Nothing else.
3. **Automatic overflow.** When balance exceeds a ceiling, the excess is swept to the warm wallet. You don't do this by hand.
4. **Automatic topup (optional).** When balance drops below a floor, the warm wallet tops it up — either manually on a schedule, or via a keeper if you're comfortable with one.

## Runway sizing

Pick the window you want to never run below — typically 2–8 weeks of expected outflows.

```
floor   = weekly_outflow × runway_weeks
ceiling = floor × 2
target  = floor × 1.5
```

- **floor**: triggers topup from warm.
- **ceiling**: triggers sweep to warm.
- **target**: where topups and sweeps aim to land — reduces tx churn at the edges.

## Sweep mechanics

Two reasonable implementations:

- **Manual weekly review.** Check the cash-flow wallet's balance on a fixed day. Sweep/topup if out of band. Simple, no custody risk beyond what you already have.
- **Keeper bot with a read-only oracle.** A small script (running on the same infra as `fg-crypt-ingest`) watches the balance. **It does not hold keys** — it emits an alert, and you sign the rebalance with the warm wallet's hardware device.

Avoid: keeper bots that hold signing keys for any wallet. The operational convenience is not worth the new attack surface.

## Chain choice

Use a chain where:

- Transfer cost is negligible relative to the typical inflow/outflow size (sub-0.1% ideally).
- The stablecoin(s) you actually use are liquid natively, not just via bridges.

For most people this is an L2 (Base, Arbitrum) or a low-fee L1 (Solana, Tron for USDT specifically), not Ethereum mainnet.

## What this wallet is *not* for

- Holding yield positions. Move yield-bearing balances to warm.
- Long-term savings. The cash-flow wallet is a buffer, not a vault.
- Trading. Opening a position from the cash-flow wallet breaks the accounting — every tx stops being a known line item.
