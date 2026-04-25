---
title: "Key management"
description: "Seed phrase storage, passphrases, multi-sig, and inheritance."
weight: 30
---

Keys are the whole product. Every wallet tier is one seed leak away from zero.

## Seed phrase storage

- **Two copies, two locations.** One at home (safe / fireproof), one off-site (safe deposit box, trusted family member's safe). Never both in the same building.
- **Metal, not paper.** Steel plates (Cryptosteel, Billfodl, or DIY stamped washers) survive fire and flood. Paper does not.
- **No photos. No cloud. No password manager.** The moment a seed exists in a digital channel, assume it will be leaked.

## BIP-39 passphrase ("25th word")

A passphrase creates a second wallet from the same seed, effectively invisible to anyone who finds the 24 words alone.

- Use one on **cold** and **warm**. Skip on hot — operational friction outweighs benefit for a small daily-spend balance.
- Store the passphrase **separately from the seed**. If both live together, the passphrase adds nothing.
- Memorize it if you can. If not, split it: half written down at one location, half at another.

## Multi-sig (for larger stacks)

When cold holdings grow past "I could lose this but survive," multi-sig becomes the right answer.

- **2-of-3 is the sweet spot** for individuals. Keys on three different hardware wallets, ideally different vendors, different geographies.
- **Sparrow / Nunchuk / Specter** for Bitcoin. **Safe (Gnosis Safe)** for EVM chains.
- Practice a recovery **before** you need one. An untested backup is a belief, not a backup.

## Inheritance

If you are hit by a bus tomorrow, can the people you care about recover these funds?

- Write a **recovery doc** — not a seed phrase, but instructions: "there is a Ledger in the safe, here is where the passphrase note lives, here is the address of the lawyer who knows the next step." Update it yearly.
- Name an **executor who can follow instructions** but does not have the keys today. This is the whole point of multi-sig with a trusted third-party cosigner.
- For anything non-trivial, get an estate lawyer involved. Crypto-aware ones exist now.

## Operational hygiene

- **Verify receive addresses on the hardware screen**, not the host computer. Clipboard malware is real and cheap.
- **Test every new address with a tiny tx first.** Always. Even for wallets you've used a hundred times — an OS update can break a wallet integration.
- **Rotate hot-wallet keys** every 6–12 months, or after any sketchy signature. A fresh key costs 30 minutes; a drained wallet costs everything it held.
