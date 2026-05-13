# Tycoon Club — Compliance-First Website

A new, legally compliant landing site that replaces the previous `tycoonclub.io`
build. The old site marketed "free lifetime memberships", "unlimited passive
income", "alliances" and tiered referral commissions — all of which carry serious
regulatory exposure (securities/MLM/consumer-protection). This rebuild reframes
Tycoon Club as a **private members community for skill-based competitive gaming**,
gates real product information behind an information-request form, and surfaces
risk and eligibility disclosures front-and-centre.

## Structure

```
tycoon-club/
├── index.html         # Compliant landing page
├── access.html        # Application form (gates the real info packet)
├── team.html          # Team page (modelled on the CJC team page)
├── compliance.html    # Risk notice + restricted jurisdictions + terms summary
└── assets/
    ├── styles.css     # Shared dark/gold styling
    └── script.js      # Mobile nav + form validation + restricted-jurisdiction block
```

Static site, no build step. To preview locally:

```bash
# from inside tycoon-club/
python -m http.server 5173
# then open http://localhost:5173
```

## What changed vs. the old site

| Removed (from the old `tycoonclub.io`)               | Replaced with                                                         |
| ----------------------------------------------------- | --------------------------------------------------------------------- |
| "Get Your FREE Membership"                            | "Request Access" application form                                     |
| "Total USDT Distributed: $258,026.57" jackpot ticker  | Removed entirely; no historical-payout vanity numbers                 |
| "Sustainable passive income / Lifetime Earning"       | Skill-based contests with published rules, no income claims           |
| "Alliances" + tiered referral percentages (1/5/10%)   | Removed; the public website makes no referral-compensation claims     |
| Achievement tiers tied to recruited buddies           | Removed; replaced with neutral "Member Privileges" framing            |
| No risk disclosure, no jurisdictional gating          | Explicit Risk Notice, Restricted Jurisdictions list, KYC requirement  |

## Access form behaviour

`access.html` collects: name, email, country of residence, optional note, and
five mandatory acknowledgements (age 18+, not-an-investment, risk understood,
KYC subject, accepts Compliance Notice).

- The submit button is disabled until **all five checkboxes** are ticked.
- Selecting a country on the restricted list (US, CN, KP, IR, SY, CU) triggers
  the "not available in your jurisdiction" block and prevents submission.
- On successful submission the form is replaced with the real plain-English
  description of what Tycoon Club is (and isn't), and next steps.

The current handler stores the request in `localStorage` only — wire it to your
chosen backend / KYC vendor before going live (`form.addEventListener` in
`assets/script.js`).

## Wiring to a backend

Replace the body of the `form.addEventListener("submit", ...)` handler in
`assets/script.js` with a `fetch()` call to your application-intake endpoint
(or to a forms vendor such as Formspree, Pipedream, HubSpot, etc.). Keep the
client-side acknowledgement gating — it's a soft control, but it documents
informed consent before the request leaves the browser.

## Things to confirm with counsel before going live

1. Operating entity name, registration number and registered address (currently
   placeholder copy on the compliance page).
2. The exact restricted-jurisdiction list — this should reflect your chosen
   licensing posture and any sanctions screening you rely on.
3. Whether to reintroduce any reference to a referral programme on the public
   site. The current copy is intentionally silent on referral compensation; any
   reintroduction (positive or negative) must be reviewed against the actual
   operational model before going live.
4. Privacy / data-handling commitments and the controller entity.
5. Any gambling / gaming licence(s) required for the contest format(s) you
   intend to operate, in each target jurisdiction.

## Notes for the design team

The aesthetic intentionally tones down the "casino" cues of the prior site
(falling cash, fire/jackpot imagery, "$X distributed" tickers). It uses a
restrained dark-navy + gold palette to keep the premium feel without making
income or wealth implications. If team identity is to be revealed publicly,
update `team.html` with real names, roles and (ideally) LinkedIn links.
