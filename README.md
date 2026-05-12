# CJC Tycoon Club Website

A compliance-first rebuild of the Tycoon Club website. The previous live site at
`tycoonclub.io` marketed "free lifetime memberships", "unlimited passive income",
"alliances" and tiered referral commissions — language that carries serious
regulatory exposure (securities / MLM / consumer-protection). This repo replaces
that framing with a private members community for skill-based competitive gaming,
gates real product information behind an information-request form, and surfaces
risk and eligibility disclosures front-and-centre.

The site ships in **four parallel visual themes**, all driving the same compliance
content and the same access-form behaviour. The theme picker lets stakeholders
compare them side-by-side.

## Structure

```
.
├── tycoon-club-themes/      # Theme picker — preview & enter any of the 4 themes
├── tycoon-club/             # V01 · CJC-aligned (Orbitron, bright gold, gaming)
├── tycoon-club-v2/          # V02 · Editorial (Bodoni italic, antique gold, broadsheet)
├── tycoon-club-v3/          # V03 · Fintech (Inter, lime green, bento grid)
└── tycoon-club-v4/          # V04 · Web3 (Space Grotesk, cyan + violet, hex motifs)
```

Each version contains the same four pages:

- `index.html` — landing page with compliant positioning, "what we are / are not", member experience, referral programme framing
- `access.html` — the gated information-request form (5 mandatory acknowledgements, restricted-jurisdiction block)
- `team.html` — operating team roster
- `compliance.html` — risk notice, eligibility, restricted jurisdictions, terms summary, privacy

Pure static HTML/CSS/JS, no build step.

## Preview locally

From the repo root:

```bash
python -m http.server 5175
```

Then open:

- Theme picker — http://localhost:5175/tycoon-club-themes/
- Version 01 — http://localhost:5175/tycoon-club/
- Version 02 — http://localhost:5175/tycoon-club-v2/
- Version 03 — http://localhost:5175/tycoon-club-v3/
- Version 04 — http://localhost:5175/tycoon-club-v4/

## What changed vs. the old site

| Removed (old `tycoonclub.io`)                       | Replaced with                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------- |
| "Get Your FREE Membership"                          | "Request Access" application form                                   |
| "$258,026.57 USDT Distributed" jackpot ticker       | Removed entirely; no historical-payout vanity numbers               |
| "Sustainable passive income / Lifetime Earning"     | Skill-based contests with published rules, no income claims         |
| "Alliances" + tiered referral percentages (1/5/10%) | One-time, capped community credit per KYC-verified referral         |
| Achievement tiers tied to recruited buddies         | Removed; no MLM-style structure                                     |
| No risk disclosure, no jurisdictional gating        | Explicit Risk Notice, Restricted Jurisdictions list, KYC at intake  |

## Access-form behaviour

`access.html` collects: name, email, country of residence, optional referrer,
optional note, and **five mandatory acknowledgements**:

1. 18+ (or local age of majority)
2. Understands Tycoon Club is not an investment / MLM
3. Understands participation involves risk
4. Understands membership is subject to KYC and jurisdictional review
5. Accepts the Compliance Notice

Submit is disabled until all five are ticked. Selecting any restricted
jurisdiction (US, CN, KP, IR, SY, CU) triggers the "not available in your
jurisdiction" block and prevents submission. On successful submission, the form
swaps to a plain-English summary of what Tycoon Club actually is.

The handler in `assets/script.js` currently stores submissions in `localStorage`
only — wire it to a backend / KYC vendor before going live.

## Things to confirm with counsel before launch

1. Operating-entity name, registration number and registered address (currently
   placeholder copy on the compliance page).
2. The exact restricted-jurisdiction list — should reflect your chosen licensing
   posture and any sanctions-screening regime you rely on.
3. Referral-programme wording. Copy intentionally frames it as a one-time,
   capped credit per KYC-verified referral. If commercial requirements change
   that, the marketing **must** be reviewed before the structure is reintroduced.
4. Privacy / data-handling commitments and the controller entity.
5. Any gambling / gaming licence(s) required for the contest format(s) in each
   target jurisdiction.

## Theme reference

| Theme    | Display font   | Body font     | Accent                | Layout signature                       |
| -------- | -------------- | ------------- | --------------------- | -------------------------------------- |
| V01 CJC  | Orbitron       | Rajdhani      | Bright orange-gold    | Glass-card, backdrop blur, gaming feel |
| V02 Edit | Bodoni Moda    | Inter Tight   | Antique gold + crimson| Hairline cells, roman numerals, dust   |
| V03 Fin  | Inter          | Inter         | Lime green            | Bento grid, pill buttons, big numerals |
| V04 Web3 | Space Grotesk  | Inter         | Cyan + violet gradient| Hex orbs, neon glow, dot grid backdrop |

All four share the same `assets/script.js` form-validation + restricted-jurisdiction logic.
