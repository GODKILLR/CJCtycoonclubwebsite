# Tycoon Club — Editorial Theme (v2)

A second, parallel theme for the compliant Tycoon Club site. The first version
(`../tycoon-club/`) borrowed the CJC Race look — bright orange-gold, Orbitron
display, gaming feel. This version borrows the **Tycoon Brief newsletter** look
— antique gold, Bodoni Moda italics, JetBrains Mono labels, crimson accents,
gold-dust drift, hairline borders. It reads like a private members' broadsheet
rather than a casino site.

## Why two themes

Same compliance content, same form behaviour, two distinct visual languages so
you can pick whichever lands better with counsel and the brand team:

- [`../tycoon-club/`](../tycoon-club/) — CJC-aligned (gaming, bright gold).
- `./` (this folder) — **newsletter-aligned (editorial, antique gold)**.

## Structure

```
tycoon-club-v2/
├── index.html         # Editorial masthead, numbered sections, public notice
├── access.html        # "Membership Petition" form
├── team.html          # "The Operating Office" roster
├── compliance.html    # "Compliance Ledger" — 10 numbered roman sections
└── assets/
    ├── styles.css     # Editorial theme tokens
    └── script.js      # Same form + jurisdiction-block logic as v1
```

Static site, no build step. Preview locally:

```bash
# from inside tycoon-club-v2/
python -m http.server 5174
# then open http://localhost:5174
```

## Theme tokens

Lifted verbatim from `../tycoon club newsletter/index.html`:

| Token            | Value     | Used for                              |
| ---------------- | --------- | ------------------------------------- |
| `--bg`           | `#0A0E14` | Page background                       |
| `--bg-deeper`    | `#050810` | Outer body / footer                   |
| `--card`         | `#11161F` | Form / quote cards                    |
| `--gold`         | `#C9A961` | Primary accent — antique, not orange  |
| `--gold-bright`  | `#E5C77A` | Hover / shimmer                       |
| `--gold-deep`    | `#8B7340` | Numbering, deep accent                |
| `--crimson`      | `#B33A3A` | Public-notice / warning left-border   |
| `--text`         | `#EFEAE0` | Warm cream foreground                 |
| `--text-soft`    | `#C8C2B5` | Body copy                             |
| Display font     | `Bodoni Moda`     | Italic display, gold `em` accents |
| Body font        | `Inter Tight`     | Body copy                         |
| Mono font        | `JetBrains Mono`  | Tags, labels, numbering           |

The body has a subtle drifting gold-dust layer (animated via `body::before`)
that's automatically disabled when `prefers-reduced-motion: reduce`.

## Language tweaks vs. v1

The editorial theme drives some terminology shifts on the surface — the
compliance substance is unchanged:

| v1 (CJC theme)         | v2 (editorial theme)        |
| ---------------------- | --------------------------- |
| Request Access form    | **Membership Petition**     |
| Team                   | **The Operating Office**    |
| Compliance Notice      | **Compliance Ledger**       |
| Achievement tiers UI   | Numbered roman sections     |

If you'd rather keep terminology consistent between the two versions, just
revert the labels — none of them carry compliance weight, they're styling
choices to match the newsletter voice.

## Wiring to a backend

Identical to v1. Replace the `form.addEventListener("submit", ...)` body in
`assets/script.js` with a `fetch()` call to your application-intake endpoint.
The five-checkbox client gate and restricted-jurisdiction block stay as-is.
