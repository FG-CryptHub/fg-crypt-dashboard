---
title: "Wallet suite architecture"
description: "Tiering wallets by purpose and risk — hot, warm, cold — so that a compromise of one tier doesn't drain the others."
weight: 10
---

A wallet suite is a small set of wallets, each with a **single clear purpose** and a **matching risk profile**. You never want your daily-driver DeFi wallet holding your retirement stack, and you never want to move cold-storage funds to claim a $12 airdrop.

## The three tiers

### Hot — browser extension, daily use

- **What it holds:** small balance, sized to a few weeks of activity.
- **Use cases:** DeFi, minting, signing transactions with unknown contracts.
- **Assumption:** this key *will* eventually be compromised. Plan accordingly.
- **Hardware:** none required. MetaMask / Rabby / Phantom are fine.

### Warm — mobile or hardware-backed, weekly use

- **What it holds:** working balance — enough to top up the hot wallet and pay for larger, deliberate moves.
- **Use cases:** sending to known counterparties, bridging, CEX deposits/withdrawals, staking with well-understood protocols.
- **Hardware:** hardware wallet (Ledger / Trezor / Keystone) or a passphrase-protected mobile wallet.

### Cold — hardware wallet, rarely touched

- **What it holds:** the bulk of the stack.
- **Use cases:** long-term holding. Signs transactions maybe 1–4 times a year.
- **Hardware:** dedicated hardware wallet, ideally one that has **never connected to a dapp**. Consider a second hardware wallet model from a different vendor for defense-in-depth.

## Hard rules

1. **One seed per tier.** Never reuse a seed across hot and cold. A seed leak in the hot tier must not reach cold funds.
2. **Addresses flow one way.** Hot receives from warm; warm receives from cold. Cold almost never receives, and never directly from an exchange deposit.
3. **No token approvals from cold.** Cold signs transfers, period. Approvals and contract interactions happen from hot/warm.
4. **Label every address.** A wallet without a labelled, documented purpose becomes a dumping ground and then a risk.

## Sizing

A reasonable starting split:

| Tier | % of total | Replenish from | Signing device |
| --- | --- | --- | --- |
| Hot | 1–5% | Warm | Software |
| Warm | 10–20% | Cold | Hardware |
| Cold | 75–90% | (inflows only) | Hardware, offline-leaning |

Rebalance when a tier drifts outside its band — not on a fixed schedule.
