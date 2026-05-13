# Tycoon Club Website — Product Requirements Document

| | |
| --- | --- |
| **Project** | Compliance-first rebuild of `tycoonclub.io` |
| **Repository** | [github.com/GODKILLR/CJCtycoonclubwebsite](https://github.com/GODKILLR/CJCtycoonclubwebsite) |
| **Live preview** | `cj-ctycoonclubwebsite.vercel.app` |
| **Status** | Design-review stage — 4 themes shipped, awaiting counsel sign-off and stakeholder selection |
| **Document version** | 1.0 — May 2026 |

---

## 1. Background

The previous public-facing Tycoon Club website (`tycoonclub.io`) carried significant regulatory exposure. Key claims and structural elements included:

- "Get Your FREE Membership" — a deceptive frame for what was effectively a paid-tier referral program.
- "$258,026.57 USDT Distributed" jackpot ticker, "Lifetime Earning", and "sustainable passive income" positioning.
- Multi-tier referral structure ("Alliances", "1-Star/2-Star/.../Legendary Tycoon" tiers with **1%, 5%, 10% recurring USDT income** based on the activity of recruited members).
- Achievement system tied directly to the count of recruited buddies.
- No risk disclosure, no jurisdictional gating, no KYC notice, no operating-entity transparency.

In aggregate this framing resembles an unregistered securities offering and a multi-level marketing structure — both of which attract enforcement risk in most major jurisdictions (US: SEC + FTC; EU: ESMA + national consumer protection; UAE: SCA; Singapore: MAS). The SEC's 2022 enforcement action against the Forsage smart-contract pyramid ($300M+ ponzi/pyramid charges) is the most directly analogous precedent in the same category.

**Decision (Q1 2026):** rebuild the public website from scratch on a compliance-first basis, before any new market campaign is approved.

---

## 2. Problem Statement

We need a public Tycoon Club website that:

1. Can withstand a legal-and-compliance review without redaction of marketing claims.
2. Does not rely on, promise, or imply guaranteed / passive / unlimited income.
3. Removes the multi-tier referral compensation structure entirely.
4. Gates qualified product information behind an application / eligibility step.
5. Provides a single, deployable brand experience that the stakeholder team can choose from a set of clearly differentiated visual options.

The brief from leadership: *"Don't tell people what they can earn. Tell people what we are, what we are not, and who can apply. Let counsel say yes before we ship a single growth campaign."*

---

## 3. Goals & Non-Goals

### 3.1 Goals (in scope)

- **Compliance-first messaging** — every page is built around what the product is and isn't, with risk and eligibility surfaced before any product detail.
- **Information-request form gate** — users cannot self-enrol; they request an information packet, subject to acknowledgements and a jurisdictional check.
- **Restricted-jurisdiction handling** — the form refuses to submit from countries on the configured restricted list.
- **Four parallel visual themes** — same compliance backbone, four distinct design languages, so stakeholders can choose without re-doing copy.
- **Theme picker** — a single landing page that lets stakeholders preview and compare all four versions side-by-side.
- **Static-deployable** — no backend or build pipeline; deployable to any static host (Vercel, Netlify, GitHub Pages, S3+CloudFront).
- **Mobile-responsive and accessibility-aware** — works on phones, respects `prefers-reduced-motion`, semantic HTML.

### 3.2 Non-goals (deferred)

- Real membership onboarding or payment flow. The form is an information request, not an enrolment.
- A live contest engine, leaderboard, wallet connection, or NFT marketplace.
- KYC vendor integration. The form will store submissions client-side until a counsel-approved backend is wired up.
- Multi-language support. English-only for v1.
- A member portal or logged-in experience.
- Analytics / tracking pixels. To be added post-counsel-review with explicit cookie consent.

---

## 4. Target Users

| Audience | Use case |
| --- | --- |
| Prospective member | Lands from a search/referral, evaluates what Tycoon Club is, submits the information request. |
| Stakeholder / brand reviewer | Compares the four themes to choose the brand direction. |
| Legal counsel | Reviews the public-facing copy and the form acknowledgements before launch sign-off. |
| Compliance officer | Validates the restricted-jurisdictions list and the risk-notice content. |
| Existing referrer | Optionally includes their referral code in the form (one-time, capped — see §7). |

---

## 5. Functional Requirements

### 5.1 Pages (per version)

Every theme version ships the same four pages:

| Path | Purpose |
| --- | --- |
| `/index.html` | Landing — compliant positioning, "what we are / are not", member experience, referral framing, public notice. |
| `/access.html` | Information-request form with acknowledgements and jurisdiction check. Post-submit reveals plain-language product summary. |
| `/team.html` | Operating team roster (currently "Coming Soon" placeholders pending verifiable-identity policy). |
| `/compliance.html` | 10-section risk notice, eligibility, restricted jurisdictions, terms summary, privacy. |

### 5.2 Information-request form (FR-01)

The form on `/access.html` is the load-bearing piece. Requirements:

- **Required fields:** full name, email, country of residence.
- **Optional fields:** referrer code/name, free-text note.
- **Five mandatory acknowledgements** (submit button disabled until all five are checked):
  1. 18+ or local age of majority.
  2. Understands Tycoon Club is *not* an investment, securities offering, fund, yield product, or MLM.
  3. Understands participation involves risk including loss of entry fees.
  4. Understands membership is subject to KYC and jurisdictional review.
  5. Accepts the Compliance Notice.
- **Restricted-jurisdiction gate:** if the selected country is on the restricted list (`US, CN, KP, IR, SY, CU` in v1), the form refuses submission and surfaces a "not available in your jurisdiction" notice with a deep-link to the Compliance § 6 section.
- **Success state:** the form swaps to a plain-English description of "what Tycoon Club really is" and "what it is not", with three next-step bullets explaining the post-form workflow (information packet, KYC invitation, membership offer with full terms).
- **No payment, no enrolment, no contest entry** is offered through the form. This is documented in copy directly above the submit button.

### 5.3 Theme picker (FR-02)

A single page at `/tycoon-club-themes/` that:

- Renders four preview tiles, each styled in its own theme's actual palette and fonts so the visual choice is immediate.
- Each tile carries: a swatch row of the theme's palette, the theme name, a 1-sentence positioning blurb, an "Enter →" button that opens the full site in a new tab, and a "Preview Inline" toggle that lazy-loads the site in an iframe inside the card.
- A comparison table at the bottom summarising what's identical (compliance content, form behaviour) and what differs (fonts, palette, layout, feel).

### 5.4 Root landing (FR-03)

A small redirect page at `/` that immediately routes to `/tycoon-club-themes/` via three layers (meta-refresh, JS `location.replace`, visible link fallback) so any client gets through.

---

## 6. Non-Functional Requirements

| Category | Requirement |
| --- | --- |
| **Compliance copy** | Every page must avoid the words *guaranteed*, *passive*, *unlimited*, *lifetime*, *risk-free* in any income context. The Compliance Notice explicitly flags these as red-flag language. |
| **Mobile** | All breakpoints from 320px upward must be usable. Mobile nav menu, single-column form, responsive grid collapses. |
| **Accessibility** | Semantic HTML, sufficient colour contrast for body copy, `prefers-reduced-motion` disables decorative animations (V02 gold dust, V04 hex orb float). 44×44px minimum tap targets for the mobile nav. |
| **Performance** | No build step, no JS framework, no images larger than necessary. Each page loads in under ~50KB of CSS+JS. Google Fonts is the only external dependency. |
| **Privacy** | No analytics, tracking pixels or third-party cookies in v1. Form submissions stay client-side until a counsel-reviewed backend lands. |
| **No dependency lock-in** | Pure HTML/CSS/JS; portable to any static host. |

---

## 7. Compliance backbone (identical across all four versions)

This section captures what must not change regardless of the chosen visual theme.

### 7.1 Positioning

> Tycoon Club is a private members community for skill-based competitive gaming and digital entertainment. Membership is by application, subject to identity verification and jurisdictional review. We are not an investment scheme and do not offer guaranteed, "passive" or "unlimited" income.

Every landing-page hero leads with that frame.

### 7.2 "What we are / what we are not" dual block

Visible on every landing page above the fold (after the hero). Two columns:

**Tycoon Club is:**
- A members community for skill-based gaming and digital entertainment.
- An access platform for tournaments and leagues with published, transparent rules.
- Contests with prize pools funded from defined entry fees and sponsorships.
- Application-based with KYC, eligibility checks and jurisdictional review.

**Tycoon Club is not:**
- An investment, fund, securities offering, derivative or yield product.
- A source of guaranteed, "passive" or "unlimited" income.
- A multi-level marketing or pyramid structure paying ongoing income from others' activity.
- Available to residents of restricted jurisdictions or persons under 18.

### 7.3 Referral programme framing

The old site's tiered commission structure is **removed entirely**. The replacement is a one-time, capped community credit per *KYC-verified* referral. No tiers, no recurring percentages, no "alliances", no income claims tied to referral activity.

### 7.4 Risk Notice / Compliance Ledger

Ten numbered sections on `/compliance.html`, deep-linked from every footer:

1. **Not an investment** — explicit denial of securities, contracts, funds, yield products.
2. **No guaranteed returns** — flags "guaranteed/passive/unlimited/lifetime/risk-free" as red-flag language.
3. **Risk Notice** — entry fees at risk, digital asset volatility, past performance disclaimer.
4. **Community Growth Programme** — one-time capped credit, not MLM.
5. **Eligibility & KYC** — identity verification, sanctions/PEP screening, jurisdictional review, 18+.
6. **Restricted Jurisdictions** — `US, CN, KP, IR, SY, CU` plus any comprehensive-sanctions country. List may be updated without notice.
7. **Terms Summary** — full ToS governs contest rules, anti-cheat, dispute resolution, voiding.
8. **Privacy** — data minimisation, withdrawal rights via `compliance@tycoonclub.example`.
9. **Marketing & Communications** — no influencer income claims; unauthorised promotions to be reported.
10. **Acknowledgement** — using the site constitutes acceptance.

### 7.5 Acknowledgements & jurisdictional block

The five-checkbox gate and the restricted-jurisdiction block in §5.2 are mandatory, present on every version, and identical in copy.

---

## 8. Solution overview — four themes, one backbone

We shipped four visually distinct versions, each carrying the same content from §7. Stakeholders can compare them via the theme picker and choose one (or compose a hybrid) before launch.

| | V01 CJC-aligned | V02 Editorial | V03 Fintech | V04 Web3 |
| --- | --- | --- | --- | --- |
| **Inspiration** | CJC Race website (sibling site) | "The Tycoon Brief" newsletter | Premium crypto-exchange affiliate hub (lime accents, bento layout) | Smart-contract / Web3 affiliate sites (cyan + violet neon, hex motifs) |
| **Display font** | Orbitron | Bodoni Moda *(italic)* | Inter (bold) | Space Grotesk |
| **Body font** | Rajdhani | Inter Tight | Inter | Inter |
| **Mono / labels** | — | JetBrains Mono | IBM Plex Mono | Space Mono |
| **Background** | `hsl(220 20% 6%)` | `#0A0E14` | `#0A0B0F` | `#07081A` |
| **Accent** | Bright orange-gold `hsl(36 90% 55%)` | Antique gold `#C9A961` + crimson `#B33A3A` for warnings | Lime green `#C5F84F` + blue `#3E80FF` | Cyan `#00E0FF` → violet `#7B5BFF` → pink `#FF5BB8` gradient |
| **Signature layout** | Glass-card with backdrop blur, gold-gradient buttons | Hairline-bordered cells, roman-numeral section tags, animated gold-dust | Bento grid (6-col) with mixed `col-2/3/4` cells, big stat numerals, pill buttons | Hex-shaped icon chips and avatars, animated SVG hex orbs in the hero, neon glow on cards |
| **Feel** | Gaming-forward, premium | Editorial / luxury broadsheet | Premium fintech / exchange | Crypto-native / Web3 |
| **Folder** | `tycoon-club/` | `tycoon-club-v2/` | `tycoon-club-v3/` | `tycoon-club-v4/` |

### 8.1 Vocabulary variants per theme

Some labels were shifted to match each theme's voice. These are stylistic and carry no compliance weight — they can be reverted to a single canonical set before launch:

| Concept | V01 / V03 / V04 | V02 |
| --- | --- | --- |
| Form CTA | "Request Access" | "Begin Your Petition" |
| Team page title | "Team" / "Meet the operating team" | "The Operating Office" |
| Compliance page title | "Compliance Notice" | "Compliance Ledger" |

### 8.2 Atmospheric / decorative elements

| Element | Where | Purpose | Reduced-motion |
| --- | --- | --- | --- |
| Glass-card backdrop blur | V01 nav, V01 cards | Premium-gaming feel | n/a (static) |
| Gold-dust radial-gradient particles, animated drift | V02 body | Editorial / heirloom feel | Disabled |
| Conic-gradient orb, floating stat cards | V03 hero | Fintech polish | n/a (static) |
| SVG hex orbs, float animation | V04 hero | Web3 / smart-contract vibe | Disabled |
| Dot-grid backdrop | V04 body | Crypto-native texture | n/a (static) |

---

## 9. Information architecture

```
/
├── /tycoon-club-themes/      Theme picker (preview, comparison table, deep-links)
├── /tycoon-club/             V01 ─┐
│   ├── /access.html                │
│   ├── /team.html                  ├─ Same four pages, same content, four skins
│   └── /compliance.html            │
├── /tycoon-club-v2/          V02 ─┤
├── /tycoon-club-v3/          V03 ─┤
└── /tycoon-club-v4/          V04 ─┘
```

Each version is self-contained: its own `assets/styles.css` and `assets/script.js`. Picking one for launch is a delete-three-folders operation.

---

## 10. Tech stack & deployment

| Layer | Choice | Rationale |
| --- | --- | --- |
| Markup | Plain HTML5 | No framework lock-in, fastest TTFB, easiest for counsel to redline. |
| Styling | Hand-rolled CSS (one file per version) | Each theme is a self-contained stylesheet; no shared design tokens across versions to avoid accidental cross-pollination. |
| Scripts | Shared `script.js` (~60 LOC) per version | Mobile-nav toggle, form acknowledgement-gating, restricted-jurisdiction block, `localStorage` submission persistence. |
| Fonts | Google Fonts (Orbitron, Rajdhani, Bodoni Moda, Inter Tight, Inter, Space Grotesk, JetBrains Mono, IBM Plex Mono, Space Mono) | Preconnect hints in every `<head>`. |
| Build | None | Static files; deployable with `python -m http.server`. |
| Hosting | Vercel (auto-deploy on push to `main`) | Configured via `vercel.json` with `trailingSlash: true` so directory index pages keep relative asset paths. |
| Repo | GitHub `GODKILLR/CJCtycoonclubwebsite` | Single `main` branch, conventional commits. |

### 10.1 Local preview

```bash
git clone https://github.com/GODKILLR/CJCtycoonclubwebsite
cd CJCtycoonclubwebsite
python -m http.server 5175
# open http://localhost:5175/
```

### 10.2 Vercel configuration

```json
{ "trailingSlash": true }
```

`trailingSlash: true` is load-bearing — without it, `/tycoon-club-v3` serves `index.html` but the browser resolves relative `assets/styles.css` against `/`, breaking every directory index. With it on, Vercel redirects to `/tycoon-club-v3/` before serving and paths resolve correctly.

---

## 11. Acceptance criteria

A version is ready for launch when:

1. **Counsel sign-off** on the Compliance Notice, the form acknowledgements, and the marketing & communications clause.
2. **Restricted-jurisdictions list** is the legally-final list, not the v1 illustrative set.
3. **Operating entity** disclosure replaces placeholder copy (name, registration number, registered address).
4. **`compliance@tycoonclub.example`** is replaced with the real compliance mailbox and is monitored.
5. **Form submission backend** is wired up — POST to a counsel-reviewed endpoint or vendor (Pipedream / HubSpot / Formspree / custom). The five-checkbox client-side gate stays as documented consent.
6. **Manual QA** of mobile breakpoints (320px, 375px, 768px, 1280px) on the chosen theme.
7. **Accessibility pass:** colour contrast (WCAG AA for body copy), keyboard navigation through the form, `prefers-reduced-motion` verification.

---

## 12. Open questions / pre-launch checklist

| # | Question | Owner | Status |
| --- | --- | --- | --- |
| 1 | Final operating entity name, registration number, registered address. | Founders + counsel | Open |
| 2 | Final restricted-jurisdictions list and sanctions-screening posture. | Counsel + compliance | Open |
| 3 | Referral programme: confirm the one-time-credit cap and the eligibility definition. If commercial requirements change the model, the marketing **must** be reviewed before reintroduction. | Founders + counsel | Open |
| 4 | Privacy / data-controller entity and full Privacy Notice. | Counsel | Open |
| 5 | Whether any contest formats trigger gambling-licence requirements in target markets. | Counsel | Open |
| 6 | Backend handover — which vendor receives form submissions and what is the data-retention policy? | Engineering + compliance | Open |
| 7 | Verifiable-identity policy for the Team page — when do we publish names, photos and LinkedIn links? | Founders | Open |
| 8 | Final theme selection. | Brand + founders | **Pending stakeholder review** |

---

## 13. Future work (post-v1)

- Real backend for form intake + handoff to KYC vendor (e.g. Sumsub, Onfido, Persona).
- Member portal with logged-in experience, contest entry, leaderboard.
- Verified team profiles with on-chain identity attestations.
- Multi-language (priority: Arabic, Spanish, Portuguese, Mandarin if reopened).
- Analytics with explicit cookie consent (priority: Plausible or similar privacy-respecting tool).
- Press / media kit and a dedicated newsroom (the existing newsletter format can be ported).
- Compliance change log on `/compliance.html` so amendments are versioned.

---

## 14. Decision log

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-05 | Rebuild from scratch rather than redact the existing site | The old structure (tiered referrals, achievement system) was load-bearing — fixing copy alone wouldn't address the underlying MLM-shaped product. |
| 2026-05 | Ship four parallel themes instead of one | Stakeholders had not agreed a visual direction, and the prior site's casino aesthetic was a contributing factor in regulatory risk. Parallel themes let leadership choose without re-doing content. |
| 2026-05 | Pure static site, no framework | Counsel can redline HTML/CSS directly; no build step, no runtime dependencies, lowest possible launch risk. |
| 2026-05 | Form submissions to `localStorage` only in v1 | We did not want to wire a real intake endpoint before counsel had reviewed the form acknowledgements. Wiring happens after sign-off. |
| 2026-05 | Restricted-jurisdiction list (`US/CN/KP/IR/SY/CU`) is illustrative | The final list is counsel's call; we surfaced a defensible starting point so the UX could be built end-to-end. |
| 2026-05 | Drop the third-party brand name from the V03 theme label (renamed to "Fintech") | Naming a theme after a third-party brand is needlessly confusing and could imply affiliation. |
