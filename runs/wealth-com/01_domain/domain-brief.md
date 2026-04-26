# Wealth.com Clone — Domain Brief
**Run:** RUN-WEALTHCOM-001
**Date:** 2026-04-25
**Status:** complete (10 of 10 sections)

## Section Index
1. US Estate & Gift Tax Landscape
2. Trust Strategies
3. Core Estate Documents
4. IRS Forms & State Equivalents
5. Advisor Regulatory Environment
6. Competitor Landscape
7. Integration Ecosystem Context
8. AI/LLM Patterns for Document Extraction
9. Security/Compliance Baseline
10. Wealth.com Market Context + GAPS

---

## Section 1: US Estate & Gift Tax Landscape (2025-2026)

### Federal Exemption — 2025 Baseline
- **2025 federal estate & gift tax exemption:** $13.99 million per individual (~$27.98 million per married couple), inflation-adjusted from $13.61M in 2024. ([IRS — What's New: Estate and Gift Tax](https://www.irs.gov/businesses/small-businesses-self-employed/whats-new-estate-and-gift-tax); [Morgan Lewis: IRS Announces Increased Gift and Estate Tax Exemption Amounts for 2025](https://www.morganlewis.com/pubs/2024/10/irs-announces-increased-gift-and-estate-tax-exemption-amounts-for-2025))
- **Top federal estate tax rate:** 40% (confirmed; unchanged by OBBBA). ([Spencer Fane — GST overview](https://www.spencerfane.com/insight/generation-skipping-what-an-overview-of-the-gst-tax-and-strategies-to-mitigate-exposure/))
- **Annual gift exclusion:** $19,000/recipient in 2025 and 2026 (per OBBBA, indexed). ([Kiplinger — Gift Tax Exclusion 2026](https://www.kiplinger.com/taxes/gift-tax-exclusion))

### TCJA Sunset Status — What Actually Happened
- The TCJA had been scheduled to sunset Jan 1, 2026, halving the exemption to roughly $7M (indexed). ([Mercer Advisors — Estate Tax Exemption 2026 Changes](https://www.merceradvisors.com/insights/trust-estate/estate-tax-exemption-2026-changes-still-need-2025-planning/))
- **One Big Beautiful Bill Act (OBBBA), signed July 4, 2025**, REPEALED the sunset and made a higher exemption permanent. ([Arnold & Porter advisory on OBBBA](https://www.arnoldporter.com/en/perspectives/advisories/2025/07/increases-to-the-federal-estate-and-gift-tax-exemption-under-the-obbba); [Frankfurt Kurnit — 2025-2026 OBBBA Update](https://fkks.com/news/2025-2026-estate-tax-planning-update-one-big-beautiful-bill-act))
- **2026 federal estate, gift & GST exemption:** $15 million per individual, $30M per married couple, effective Jan 1, 2026; indexed for inflation starting 2027 (using 2025 base). ([Miller Canfield — OBBBA: Exemption Increases to $15M](https://www.millercanfield.com/resources-One-Big-Beautiful-Bill-Estate-Gift-Tax-Exclusion-Generation-Skipping-Transfer-Exemption-Increases-to-15-Million.html); [Kiplinger — 2026 Estate Tax Exemption](https://www.kiplinger.com/taxes/new-estate-tax-exemption-amount))
- "Use it or lose it" pressure that dominated 2024-mid 2025 planning is now relieved. **FLAG**: as of April 2026, no further legislation has rolled this back; verify quarterly.

### GST (Generation-Skipping Transfer) Tax — Mechanics
- GST is a flat 40% levied on transfers to "skip persons" (typically 2+ generations down, e.g., grandchildren) IN ADDITION to gift/estate tax. ([Fidelity — GSTT Explained](https://www.fidelity.com/viewpoints/wealth-management/insights/generation-skipping-transfer-tax))
- **2025 GST exemption:** $13.99M (matches estate). **2026 GST exemption:** $15M (matches OBBBA estate exemption). ([Spencer Fane — GST overview](https://www.spencerfane.com/insight/generation-skipping-what-an-overview-of-the-gst-tax-and-strategies-to-mitigate-exposure/))
- Three triggering events:
  1. **Direct skip** — transfer directly to a skip person (transferor pays).
  2. **Taxable distribution** — trust distribution to a skip person (recipient pays; tax-inclusive).
  3. **Taxable termination** — non-skip interest in trust ends, leaving only skip beneficiaries (trust pays).
- **Inclusion ratio (key formula):** `IR = 1 - (GST exemption allocated / value of transfer)`. Applicable rate = `IR × 40%`. A trust with IR = 0 is fully GST-exempt forever (key for dynasty trusts).
- Annual exclusion gifts (≤$19K to a grandchild) get auto IR=0 only for direct skips meeting §2642(c) requirements.

### DSUE Portability Between Spouses
- Surviving spouse can use the **D**eceased **S**pousal **U**nused **E**xclusion when the predeceased spouse's executor files a TIMELY Form 706 making the portability election. ([IRS Estate Tax FAQs](https://www.irs.gov/businesses/small-businesses-self-employed/frequently-asked-questions-on-estate-taxes); [NATP — DSUE primer](https://www.natptax.com/news-insights/blog/what-is-the-dsue-and-how-can-a-surviving-spouse-use-it/))
- Election made on **Form 706 Part 6, Section C** (compute DSUE portable to survivor), Section D (DSUE received from prior predeceased spouse). ([Form 706 Rev. Aug 2025 PDF](https://www.irs.gov/pub/irs-pdf/f706.pdf); [Instructions for Form 706 (Sept 2025)](https://www.irs.gov/instructions/i706))
- **Deadline:** 9 months after death, plus 6-month extension permissible. ([Larson, Brown & Ebert — common error](https://larsonbrown.law/2025/09/11/9803/))
- **Late portability relief:** Rev. Proc. 2022-32 lets non-required filers elect portability up to 5 years after death. ([Farrell Fritz on DSUE](https://www.farrellfritz.com/insights/tax-tracker/understanding-the-deceased-spouse-unused-exclusion-dsue-and-portability-elections/))
- Critical caveat: **DSUE is NOT indexed for inflation** — survivor inherits the dollar amount, not a percentage. GST exemption is also **NOT portable** between spouses (must be allocated during life or at first death).

### Step-Up in Basis at Death — IRC § 1014
- Inherited property's basis resets to FMV at date of death (or alternate valuation date). Eliminates appreciation-period capital gains for heirs. ([26 U.S.C. § 1014 (Cornell LII)](https://www.law.cornell.edu/uscode/text/26/1014); [Fidelity — Step-up in basis](https://www.fidelity.com/learning-center/personal-finance/what-is-step-up-in-basis))
- **Excluded:** "Income in respect of a decedent" (IRD) per §1014(c) — IRAs, 401(k)s, annuities, deferred comp, savings-bond interest, installment notes. No step-up. ([Greenleaf Trust — 1014(e) Limitation](https://greenleaftrust.com/missives/basis-step-up-on-death-the-irc-1014e-limitation/))
- **§1014(e) anti-gaming:** if appreciated property is gifted to the decedent within 1 year of death and returns to the donor at death, no step-up.
- **Community property (CA, WA, TX, AZ, NV, NM, ID, LA, WI):** double step-up — both halves of community property get FMV basis at first spouse's death. ([O'Neil Cannon — Wisconsin Double Step-Up](https://www.wilaw.com/tax-wealth-advisor-alert-understanding-the-step-up-in-tax-basis-a-summary-of-irc-code-section-1014-and-double-stepped-up-basis-for-marital-property-in-wisconsin/))
- **Carryover-basis trap:** assets in irrevocable grantor trusts may NOT get §1014 step-up unless includible in grantor's gross estate (Rev. Rul. 2023-2 confirmed).

### State Estate / Inheritance Tax Snapshot (2025) — 12 states + DC have estate tax; 5 states have inheritance tax
| State | Type | Exemption (2025) | Top Rate | Notes |
|---|---|---|---|---|
| Washington | Estate | $3.0M (up from $2.193M) | 35% (top, ≥$9M) — highest in US | Material 2025 reform raised both exemption and top rate. ([Tax Foundation 2025](https://taxfoundation.org/data/all/state/estate-inheritance-taxes/)) |
| Oregon | Estate | $1.0M | 16% top | Lowest exemption tier. ([JGL Law — 2025 thresholds](https://www.jgllaw.com/2025-state-estate-tax-exemption-thresholds/)) |
| Massachusetts | Estate | $2.0M | 16% top (5.6%–16%) | Cliff softened post-2023 reform. ([Partners Financial 2025 chart](https://www.partnersfinancial.com/insights/2025-state-estate-tax-and-inheritance-tax-chart/)) |
| New York | Estate | $7.16M | 16% top | "Cliff" if estate exceeds 105% of exemption — entire estate taxed. ([Tax Foundation 2025](https://taxfoundation.org/data/all/state/estate-inheritance-taxes/)) |
| Illinois | Estate | $4.0M | 16% top | No portability of exemption between spouses. |
| Minnesota | Estate | $3.0M | 16% top | Includes 3-year lookback for taxable gifts. |
| Maryland | Both | $5.0M (estate); 10% inheritance | 16% estate; 10% inheritance | Only US state with BOTH taxes. |
| Rhode Island | Estate | $1,802,431 | 16% top | One of lowest exemption thresholds. |
| Connecticut | Estate | $13.99M (matches federal) | 12% flat | Caps total tax at $15M. ([ACTEC State Death Tax Chart](https://www.actec.org/resources-for-wealth-planning-professionals/state-death-tax-chart/)) |
| Maine | Estate | $7.0M | 12% top | Indexed annually. |
| Hawaii | Estate | ~$5.49M | 20% top | Has portability. |
| DC | Estate | ~$4.873M | 16% top | |
| Inheritance-tax states | — | — | — | KY, NE, NJ, PA, MD (above) — class-based rates by relationship to decedent. ([ACTEC Chart](https://www.actec.org/resources-for-wealth-planning-professionals/state-death-tax-chart/)) |

- **2026 watch list:** WA, OR, MA cliffs and exemption levels are set legislatively; verify each January. Several states (e.g., Iowa fully phased out inheritance tax 2025) continue trimming.

### GAPS (Section 1)
- Exact 2026 state-by-state exemption amounts post-inflation indexing (most states publish in Q4/Q1).
- Whether any state legislature passes "decoupled" rates in 2026 reaction to OBBBA (sources speculate but none confirmed).
- 2026 IRS Rev. Proc. with formal indexed numbers (Rev. Proc. 2025-32-equivalent) — confirmed $15M but check official text for ancillary thresholds (§2032A, §6166, etc.).
- DSUE interaction with $15M new floor for surviving spouses of decedents who died pre-2026 — ambiguous treatment of "lock-in" of lower DSUE amount; further IRS guidance pending.

---

## Section 2: Trust Strategies — Mechanics, Use Cases, IRS Code, Key Formulas

### GRAT (Grantor Retained Annuity Trust) — IRC § 2702
- **Mechanic:** Grantor transfers appreciating assets to an irrevocable trust, retains a fixed annuity for a term (typically 2–10 years). At term end, remainder passes to beneficiaries (or further trust). ([Capital Tax — GRAT primer](https://www.capitaltax.com/grantor-retained-annuity-trust/the-ultimate-beginners-guide-to-grantor-retained-annuity-trusts-what-first-timers-need-to-know))
- **§ 2702 framework:** Retained interests in trust to family members are valued at zero unless they are a "qualified interest" — a fixed annuity (GRAT) or unitrust (GRUT). This forces the gift value to equal `(asset transferred − PV of retained annuity)`. ([NAEPC Journal — Walton GRAT](https://natlawreview.com/article/common-grat-facing-extinction-2025))
- **Walton (zeroed-out) GRAT:** *Walton v. Commissioner, 115 T.C. 589 (2000)* — Tax Court allowed valuing the retained annuity to include the term certain remaining if grantor dies, so the annuity's PV can equal the contribution → gift = $0. IRS acquiesced (AOD 2003-126). ([ThinkAdvisor — When Zero Has Value](https://www.thinkadvisor.com/2004/01/01/when-zero-has-value/?slreturn=20211112155818); [EJ Rosen Law — Zeroed-Out GRATs](https://ejrosenlaw.com/what-are-rolling-grats-what-is-a-zeroed-out-or-walton-grat/))
- **Key formula:** `Gift value = FMV transferred − PV(annuity, term, §7520 rate)`. Outperformance vs. §7520 rate passes tax-free.
- **§ 7520 rate:** 120% of the AFR mid-term rate, published monthly by IRS. Lower rate = better GRAT outcome (low hurdle to beat). ([Schwab — Estate Planning for Low Rates](https://www.schwab.com/learn/story/estate-planning-low-interest-rates))
- **When used:** transferring volatile/high-growth assets (pre-IPO stock, concentrated single stock, RSUs) without using exemption.
- **Risk:** if grantor dies during term, all assets snapped back into estate (mortality risk). "Rolling GRATs" (annual short-term GRATs) mitigate.
- **2026 watch:** "Common GRAT extinction" risk — both prior Greenbook proposals and Senate Finance drafts have proposed minimum 10-year term, minimum 25% remainder, etc. Status: **NOT enacted** as of OBBBA July 2025. ([NatLawReview — GRAT Extinction 2025](https://natlawreview.com/article/common-grat-facing-extinction-2025))

### SLAT (Spousal Lifetime Access Trust)
- **Mechanic:** One spouse (donor) gifts to an irrevocable trust for benefit of the other spouse (and often issue). Donor's exemption is consumed; assets removed from both spouses' estates if structured correctly. ([Schwab — SLAT Trusts](https://www.schwab.com/learn/story/slat-trusts-estate-planning-strategy-couples); [Fidelity — Protect Assets with a SLAT](https://www.fidelity.com/learning-center/wealth-management-insights/protect-assets-with-a-SLAT))
- **Grantor trust status:** SLATs are typically grantor trusts — donor pays income tax on trust income, further reducing donor's estate (effectively a tax-free additional gift). ([Commerce Trust — Understanding SLATs](https://www.commercetrustcompany.com/research-and-insights/articles/understanding-spousal-lifetime-access-trusts))
- **Reciprocal Trust Doctrine:** *U.S. v. Estate of Grace, 395 U.S. 316 (1969)* — if both spouses create substantially identical SLATs, IRS uncrosses them, defeating the strategy. Mitigants: stagger funding, different trustees, different beneficiary classes, different powers of appointment, different asset mix. ([Braverman Law — Reciprocal-Trust Traps](https://www.braverman-law.com/blog/reciprocal-trust-traps-in-slat-planning/))
- **Risk:** divorce or death of beneficiary spouse cuts off donor's indirect access. Floating spouse provisions and trust protectors help.
- **When used:** married couple wanting to lock in current $13.99M / $15M exemption while retaining indirect access to capital.

### ILIT (Irrevocable Life Insurance Trust) — Crummey withdrawal rights
- **Mechanic:** Trust owns life insurance policy; death benefit proceeds escape decedent's gross estate (vs. IRC § 2042 if decedent owns policy). ([Commerce Trust — ILITs](https://www.commercetrustcompany.com/research-and-insights/articles/understanding-irrevocable-life-insurance-trusts))
- **Premium funding via Crummey letters:** *Crummey v. Commissioner, 397 F.2d 82 (9th Cir. 1968)* — gifts to a trust are "present interest" (qualifying for annual exclusion) only if a beneficiary has temporary withdrawal right (typically 30 days). Trustee mails written Crummey notice annually. ([Bay Legal — Crummey Letter](https://baylegal.com/what-is-a-crummey-letter-and-why-is-it-used-with-ilits/); [Adler & Adler — ILIT and Crummey Powers](https://www.adlerandadler.com/blog/the-irrevocable-life-insurance-trust-and-crummey-powers/))
- **Annual exclusion (2025/2026):** $19,000 per beneficiary × number of beneficiaries with Crummey rights = max premium fundable without using lifetime exemption.
- **Three-year lookback (§ 2035):** if grantor transfers an existing policy to ILIT and dies within 3 years, proceeds yanked back into estate. Best practice: ILIT acquires new policy.
- **When used:** large death-benefit policies for estate liquidity, ILIT is also key for second-to-die planning (survivorship policies).

### CLAT (Charitable Lead Annuity Trust)
- **Mechanic:** trust pays a fixed annuity to a charity for a term; remainder passes to non-charitable beneficiaries (heirs). Donor gets immediate charitable deduction (if grantor CLAT) for PV of charitable lead. ([Greenleaf Trust — CLATs](https://greenleaftrust.com/missives/charitable-lead-annuity-trusts/))
- **Two flavors:** Grantor CLAT (donor gets income tax deduction up front but is taxed on trust income during term) vs. Non-grantor CLAT (no upfront deduction; trust deducts charitable payouts).
- **Zeroed-out CLAT:** Like a GRAT, can be structured so PV of charitable annuity = contribution → gift = 0. Outperformance vs. §7520 rate passes tax-free to heirs.
- **GST trap:** § 26.2642-3 — CLAT cannot allocate GST exemption efficiently up-front; allocation is computed at the END of the charitable term using "adjusted GST exemption" which inflates exemption at §7520 rate but is wiped out if assets outperform. **Practical implication: CLATs are POOR vehicles for GST planning** — use CLUTs (unitrusts) instead if dynasty objective. ([26 CFR § 26.2642-3 (Cornell)](https://www.law.cornell.edu/cfr/text/26/26.2642-3); [Tax Adviser — Planning with CLTs](https://www.thetaxadviser.com/issues/2021/dec/planning-charitable-lead-trusts/))

### Dynasty Trust + GST exemption mechanics
- **Mechanic:** long-duration irrevocable trust (multi-generational) funded with GST-exempt assets up to GST exemption. Inclusion ratio = 0 forever. ([Trust & Will — Dynasty Trusts](https://trustandwill.com/learn/dynasty-trust))
- **Rule Against Perpetuities (RAP) jurisdictions:**
  - **South Dakota** — abolished RAP in 1983 (first state); no state income tax, no capital gains, no estate tax. ([SD Trust Company — SD Dynasty Trust](https://sdtrustco.com/why-south-dakota/dynasty-trust/))
  - **Delaware** — no RAP for personal property in trust (real estate capped at 110 years). DE also has Asset Protection Trust statutes. ([Robins Kaplan — SD Dynasty 101](https://www.robinskaplan.com/newsroom/insights/trust-and-estate-law-south-dakota-dynasty-trusts-101))
  - **Nevada** — 365-year cap. ([Aaron Hall — Dynasty Trust State RAP Exception](https://aaronhall.com/dynasty-trust-state-rule-against-perpetuities-exception/))
  - **Alaska** — 1,000-year cap.
  - Others: WY, TN, NH, MO permit perpetual or near-perpetual.
- **Funding (2026):** $15M per donor × spouse = $30M per couple of GST-exempt seed capital, plus any leveraged techniques layered on top (e.g., sale to dynasty IDGT).
- **When used:** ultra-HNW families targeting multi-generational wealth transfer.

### Revocable Living Trust (RLT)
- **Mechanic:** Grantor creates trust during life, retains all powers (revoke/amend, serve as trustee, full beneficial use). Probate-avoidance vehicle, NOT a tax vehicle. ([Manz Law — RLT and Probate](https://www.manzlawfirm.com/can-you-avoid-probate-using-a-revocable-living-trust/))
- **Tax treatment:** treated as grantor's own assets for income, gift, and estate tax. No removal from gross estate. SSN of grantor used (no separate EIN).
- **Probate avoidance:** Only assets re-titled into the trust avoid probate. Common failure mode: client signs trust but forgets to fund it. ([Snyder Law — RLT and Probate](https://www.snyderlawpc.com/will-my-revocable-living-trust-avoid-probate-it-depends/))
- **Pour-over will:** companion document directing untitled assets into the trust at death; those assets STILL go through probate first. ([Trust & Will — Pour-Over Will](https://trustandwill.com/learn/pour-over-will))
- **At grantor's death:** RLT becomes irrevocable; trustee handles administration without probate court involvement.

### IDGT (Intentionally Defective Grantor Trust) — sale to IDGT mechanics
- **"Defective":** trust is intentionally drafted to trigger grantor-trust rules (IRC §§ 671–679) for INCOME tax (grantor pays tax on trust income, making "tax-free gifts" to beneficiaries) BUT excluded from gross estate for ESTATE/GIFT tax. ([Cohen & Co — Trusts & Taxes 101: IDGTs](https://www.cohenco.com/knowledge-center/insights/february-2025/trusts-taxes-101-intentionally-defective-grantor-trusts))
- **Sale-to-IDGT mechanic:**
  1. Grantor seeds trust with ~10% of intended sale value (the "seed gift").
  2. Grantor sells appreciating asset (e.g., closely held business stock, often valuation-discounted) to IDGT in exchange for installment promissory note bearing AFR interest. ([RSM — Sales to IDGTs Q&A](https://rsmus.com/insights/services/business-tax/sales-to-intentionally-defective-grantor-trusts-explained.html))
  3. Sale is NOT recognized for income tax (transactions between grantor and grantor trust are disregarded — *Rev. Rul. 85-13*).
  4. Asset appreciation above AFR passes to beneficiaries free of gift/estate tax. ([Greenleaf Trust — Sales to IDGTs](https://greenleaftrust.com/missives/sales-to-intentionally-defective-trusts/))
- **Key formula:** Wealth transferred = `FMV(asset growth at term) − Note balance + accrued interest (paid back at AFR)`.
- **Vs. GRAT:** IDGT has no mortality risk if structured correctly; better for GST allocation; but no statutory blessing (relies on private letter rulings).
- **2026 risk:** OBBBA did not enact prior proposed grantor-trust crackdown. **FLAG**: monitor SECURE Act 3.0 / future Greenbooks.

### QPRT — Qualified Personal Residence Trust (IRC § 2702(a)(3)(A)(ii))
- **Mechanic:** transfer primary or vacation residence to irrevocable trust; grantor retains right to live in home for term of years (5–15 typical). At term end, residence passes to remainder beneficiaries; grantor pays fair-market rent if continuing to occupy. ([Comiter Singer — Common Trusts](https://www.comitersinger.com/blog/common-types-of-trusts-which-one-is-right-for-you/))
- **Gift value:** FMV − PV of retained occupancy interest (computed using §7520 rate; HIGHER rate = lower gift = better outcome — opposite of GRAT).
- **Mortality risk:** death during term = full FMV in estate.

### CRT / CRUT — Charitable Remainder Trusts (IRC § 664)
- **Mechanic:** flip of CLAT — pays income to non-charitable beneficiaries for term/life, remainder to charity.
- **CRAT (annuity):** fixed dollar amount, ≥5%, ≤50%, must satisfy "10% remainder test" (PV remainder ≥10% initial FMV).
- **CRUT (unitrust):** % of trust assets revalued annually; same 5–50% / 10% remainder constraints.
- **Tax treatment:** trust is income-tax exempt; donor gets charitable deduction for PV of remainder; appreciated asset can be sold inside trust without gain recognition. ([Comiter Singer — CRTs](https://www.comitersinger.com/blog/common-types-of-trusts-which-one-is-right-for-you/))

### Marital / Bypass / QTIP / Credit Shelter Trusts
- **Bypass / Credit Shelter (B Trust):** funded at first spouse's death with amount up to remaining federal exemption. Income/discretionary principal to surviving spouse, but assets BYPASS surviving spouse's estate. ([Private Trust — Bypass Trust](https://theprivatetrustcompany.com/bypass-trust-also-called-b-trust-or-credit-shelter-trust/))
- **Marital Trust (A Trust):** unlimited marital deduction; assets DO end up in surviving spouse's estate.
- **QTIP (Qualified Terminable Interest Property) — IRC § 2056(b)(7):** marital deduction available even though surviving spouse only gets income (and limited principal access). Decedent decides ultimate remainder beneficiaries (typical for second marriages). Assets includible in survivor's estate. ([Beyond Counsel — QTIP vs Marital](https://beyondcounsel.io/credit-shelter-trusts-qtip-trust-vs-marital-gift-trust/))
- **A/B/C planning:** combines all three to maximize both exemptions and control. With portability + DSUE, formula-funded bypass trusts have lost some traction post-2010 but remain critical for state-tax decoupling, asset protection, and remarriage scenarios.

### GAPS (Section 2)
- §7520 rate trajectory for 2026 — depends on Treasury auctions; need to monitor monthly publication.
- Whether any "anti-GRAT" / "anti-grantor-trust" provisions surface in late-2026 Greenbook (Biden-era Greenbooks repeatedly proposed; not enacted).
- State-by-state asset protection trust rankings (DE, NV, SD, WY) — not all states recognize self-settled spendthrift trusts.
- Specific Crummey notice requirements vary by court (5th/9th Cir. tension on hanging powers).

---

## Section 3: Core Estate Documents

### Last Will & Testament / Pour-Over Will
- **Function:** directs disposition of probate assets at death, names personal representative/executor, names guardian for minor children, can establish testamentary trusts.
- **Requirements (general):** testator capacity (≥18, sound mind), signed in presence of witnesses (typically 2), written. **State variance**: holographic wills permitted in ~25 states; nuncupative (oral) wills extremely limited; self-proving affidavit (notarized) standard in most. Louisiana follows civil-law (Napoleonic) requirements distinct from common-law states.
- **Pour-over will:** companion to a revocable living trust — transfers any non-titled assets into the trust at death. Those assets STILL pass through probate; trust terms then control distribution. ([Trust & Will — Pour-Over Will](https://trustandwill.com/learn/pour-over-will); [FreeWill — Pour-Over Will](https://www.freewill.com/learn/what-is-a-pour-over-will-with-a-living-trust))
- **2025 e-will status:** Uniform Electronic Wills Act adopted in ~12 states (e.g., FL, NV, CO, IL, ND, AZ, UT, WA, IN, ID, OK). RON (Remote Online Notarization) acceptance varies. **FLAG state-by-state.**

### Revocable Living Trust (covered Section 2; document role)
- Functions as the "operating system" for estate plan; the will becomes a fallback/clean-up instrument. Funded via re-titling deeds, brokerage account changes, beneficiary updates.

### Financial Power of Attorney (Durable POA)
- **Function:** authorizes "agent" / "attorney-in-fact" to manage principal's financial affairs. **Durable** = survives incapacity (default for most modern POAs; absent that word it terminates at incapacity). Terminates at death — executor takes over. ([Pierce Law — POA Series](https://piercelaw.com/news/estate-planning-qa-series/what-documents-do-we-need-besides-a-will-to-handle-health-care-decisions-and-financial-powers-of-attorney/))
- **Springing vs immediate:** "springing" POAs activate only on incapacity (often requires physician certification — friction). "Immediate" POAs are effective on signing.
- **Uniform Power of Attorney Act (UPOAA):** adopted in ~30 states; standardizes hot-powers (gift, change beneficiary), notice obligations, third-party reliance.
- **State variance:** notary required everywhere; some states (NY, FL) require specific statutory form language; banks frequently demand recent (≤6 mo) execution and refuse stale POAs absent statute.

### Advance Health Care Directive / Living Will / Healthcare POA
- **Function:** combined or separate documents that (a) state end-of-life treatment preferences (Living Will) and (b) appoint a healthcare proxy/agent (Healthcare POA, durable). ([Mayo Clinic — Living Wills](https://www.mayoclinic.org/healthy-lifestyle/consumer-health/in-depth/living-wills/art-20046303); [NIA — Advance Care Planning](https://www.nia.nih.gov/health/advance-care-planning/advance-care-planning-advance-directives-health-care))
- **Witness/notary variance:** Iowa, Kansas, Missouri, Montana, North Carolina, West Virginia REQUIRE notarization. Most others: 2 witnesses (often disqualified relatives/care providers). ([Anthem EAP — State Requirements](https://www.anthemeap.com/hd/find-legal-support/resources/elder-law/articles/state-specific-requirements-for-advance-directives))
- **Massachusetts:** Has NO living will statute — recognizes Healthcare Proxy only; written wishes are persuasive evidence but not legally binding. Similar partial recognition in MI. ([Everplans — State-by-State](https://www.everplans.com/articles/state-by-state-advance-directive-forms))
- **Uniform Health-Care Decisions Act (1993):** Adopted by only 7 states (AK, DE, HI, ME, MS, NM, WY). Most states have their own statutory form. ([ABA Bifocal — Portability of ADs](https://www.americanbar.org/groups/law_aging/publications/bifocal/vol_38/issue_1_october2016/advance-directives-across-state-lines/))
- **Portability:** legally a state document; reciprocity is by state statute. Best practice: execute in state of residence AND any state of frequent presence. ([CaringInfo — By State](https://www.caringinfo.org/planning/advance-directives/by-state/))

### HIPAA Authorization
- **Function:** waives federal Privacy Rule (45 CFR §164.508) restrictions so named individuals can receive Protected Health Information. Without it, even a named healthcare agent may face friction obtaining records. ([Frank Kraft — HIPAA vs HC POA](https://frankkraft.com/what-is-the-difference-between-a-hipaa-authorization-and-a-healthcare-power-of-attorney/); [Arnold Smith Law — Why include HIPAA Release](https://www.arnoldsmithlaw.com/why-you-should-include-a-hipaa-release-in-your-estate-plan.html))
- **Required elements (45 CFR §164.508(c)):** specific PHI described, recipients named, purpose stated, expiration date/event, signature, notice of revocation right, statement of redisclosure risk.
- **Practical product implication:** modern estate plan packages always bundle HIPAA Authorization + Healthcare POA + Living Will (often "Advance Directive" container). Tech platforms must support either combined or separate document delivery per state.

### Guardianship Designation for Minors
- **Function:** parental nomination of personal guardian (custody/care of person) and property guardian (assets) — **distinct roles**, can be same or different individuals.
- **Where stated:** typically inside the will; most states also accept standalone "Designation of Guardian" instruments effective during temporary parental incapacity. CA, FL, etc. have specific forms.
- **Court override:** the court ultimately appoints, but parental designation is given great weight. Some states (CA Probate §1500-1502) allow joint guardian designation by both parents.
- **Asset management:** UTMA/UGMA accounts, custodial accounts, or testamentary trusts replace need for property guardian. ([Sand Hill Global — Optimal Beneficiary Designations](https://www.sandhillglobaladvisors.com/blog/an-optimal-approach-to-beneficiary-designations-and-your-children/))

### Beneficiary Designations (TOD/POD, retirement accounts)
- **Mechanism:** non-probate transfer at death directly to named beneficiary. Trumps will for that asset.
- **TOD (Transfer on Death):** brokerage accounts, securities, real estate (in TOD-deed states — ~30 states + DC).
- **POD (Payable on Death):** bank accounts, CDs.
- **Caveats:**
  - If primary AND contingent both predecease, asset reverts to probate. ([Greenleaf Trust — PODs/TODs Good, Bad, Ugly](https://greenleaftrust.com/missives/pods-and-tods-the-good-the-bad-and-the-ugly/))
  - Naming a minor causes guardianship proceedings — prefer testamentary trust or UTMA custodian. ([Eagle Claw — TOD Designations](https://www.eagleclawcapital.com/info-resources/transfer-on-death-designations.html))
  - Ex-spouses: most states have automatic-revocation statutes for divorce, but federal-preempted plans (ERISA 401(k)/pensions) follow plan terms — *Egelhoff v. Egelhoff*, 532 U.S. 141.
- **Retirement accounts (IRA, 401(k)):**
  - **SECURE Act (2019)** + **SECURE 2.0 (2022)**: most non-spouse beneficiaries must drain inherited account within **10 years** (ending hereditary "stretch IRA" except for "eligible designated beneficiaries" — surviving spouse, minor child of decedent until 21, disabled/chronically ill, beneficiary <10 years younger than decedent). ([Phillips Lytle — SECURE Act Updates 2025](https://phillipslytle.com/one-big-beautiful-bill-act-2025-secure-act-updates-and-beneficiary-designations-in-estate-plans/))
  - 2024 IRS final regs clarified annual RMDs WITHIN 10-year window are required if decedent had begun RMDs.
  - Conduit vs. accumulation trusts as IRA beneficiaries: significant restructuring required post-SECURE.
  - Age of majority for SECURE Act minor child = **21** (per 2024 IRS clarification).

### Disposition of Remains / Funeral Instructions
- Standalone document (or part of will/healthcare directive) directing burial/cremation/donation. Some states require specific designation of "agent for disposition" separate from healthcare proxy (e.g., NC General Statutes §90-210.124).

### Letter of Intent / Letter of Wishes
- Non-binding ancillary document. Critical for special-needs planning, family business succession context, and conveying values to trustees of long-duration trusts.

### Digital Asset Authorization (RUFADAA)
- **Revised Uniform Fiduciary Access to Digital Assets Act** — enacted in ~46 states. Permits fiduciaries to access decedent's email, cloud storage, social media per the user's terms-of-service "online tool" or, failing that, a will/POA grant. Terms-of-service "online tool" (e.g., Google Inactive Account Manager, Apple Legacy Contact) overrides the will.

### State-by-state Variance Flags
- Will execution: holographic OK in CA, TX, AR, NC; not OK in NY, FL, OH.
- POA: hot-powers must be initialed in some UPOAA states.
- AD/Living Will: notarization required in 6 states (above); MA has no LW recognition.
- Property regimes: 9 community property states change marital deduction and step-up math.
- Probate thresholds: small-estate affidavit limits range from $10K (e.g., MS) to $184,500 (CA in 2025). ([Bryan Fagan — DIY RLT 2025](https://www.bryanfagan.com/2025/07/diy-free-revocable-living-trust-pros-and-cons/))
- TOD deeds: not available in NY, FL, MA, GA, etc.
- Self-proving affidavit: not honored in DC and a few others.

### GAPS (Section 3)
- Comprehensive 50-state matrix for each document's witness/notary/format requirements — heavy-lift artifact required for production system.
- Current RUFADAA adoption status post-2025 (final 4 holdouts).
- e-Wills/RON state acceptance map for 2026.
- POA recognition by major banks/brokerages (Schwab, Fidelity, BofA each have idiosyncratic forms).
- Whether MA enacts living will statute in 2026 session (perennial bill).

---

## Section 4: IRS Forms & State Equivalents

### Federal Forms

| Form | Purpose | Triggering Threshold (2025) | Due |
|---|---|---|---|
| **Form 706** | United States Estate (and GST) Tax Return | Gross estate + adjusted taxable gifts > $13.99M (2025) / $15M (2026); OR any size if portability election. ([IRS — About Form 706](https://www.irs.gov/forms-pubs/about-form-706); [Form 706 Rev. Aug 2025](https://www.irs.gov/pub/irs-pdf/f706.pdf); [Instructions Sept 2025](https://www.irs.gov/instructions/i706)) | 9 months after death; 6-mo extension via Form 4768 |
| **Form 706-NA** | Estate of Nonresident Non-citizen | Gross US-situs assets > $60K | 9 months |
| **Form 706-GS(D)** | GST Distribution Return (recipient) | Taxable distributions from a trust | April 15 of year after distribution |
| **Form 706-GS(T)** | GST Termination Return (trustee) | Taxable terminations | April 15 |
| **Form 709** | US Gift (and GST) Tax Return | Gifts > annual exclusion ($19K/donee 2025/2026); split-gift elections; allocations of GST exemption. ([Form 709 2025 Instructions](https://www.irs.gov/instructions/i709)) | April 15 of year after gift |
| **Form 709-NA** | Gift Return (nonresident non-citizen) | Same triggers | April 15 |
| **Form 1041** | US Income Tax Return for Estates and Trusts | Gross income ≥ $600 (estate) or any taxable income (trust); also used for split-interest trusts. ([Form 1041 2025 Instructions](https://www.irs.gov/instructions/i1041)) | April 15 (calendar year) |
| **Form 1041-A** | US Information Return Trust Accumulation of Charitable Amounts | Trust required to accumulate income for charity | April 15 |
| **Form 5227** | Split-Interest Trust Information Return | CRT, CLT, pooled income funds | April 15 |
| **Form 8971 + Sch A** | Information Regarding Beneficiaries Acquiring Property from Decedent (consistent basis reporting) | Estates required to file Form 706 (since 2016 — IRC §6035) ([IRS — Estate Tax Forms](https://www.irs.gov/businesses/small-businesses-self-employed/forms-and-publications-estate-and-gift-tax)) | 30 days after Form 706 filed |
| **Form 1040** | Individual income tax return | Standard | April 15 |
| **Form 1040-X** | Amended individual return | — | Within 3 yrs |
| **Form W-2** | Wage & Tax Statement (employer-issued) | — | Jan 31 to employee |
| **1099 series** (1099-DIV, -INT, -B, -R, -MISC, -NEC, -K) | Information returns for various income types | Various ($600 threshold for many; $10 for 1099-INT) | Jan 31/Feb 15 to recipient |
| **Form SS-4** | EIN for trust/estate | When obtaining EIN | As needed |
| **Form 56** | Notice of Fiduciary Relationship | Executor/trustee assumes role | When relationship begins |

### Form 706 — Notable Schedules
- **Schedule A** – Real Estate
- **Schedule B** – Stocks & Bonds
- **Schedule D** – Insurance on Decedent's Life (where ILIT analysis matters)
- **Schedule E** – Jointly Owned Property
- **Schedule G** – Transfers During Life (§§ 2035–2038)
- **Schedule M** – Marital Deduction (QTIP election here)
- **Schedule O** – Charitable Bequests
- **Schedule R / R-1** – GST Tax computation (R-1 for trustee filings)
- **Part 6** – Portability of DSUE (Sections C, D)

### Form 709 — Notable Areas
- **Schedule A Part 1** – Gifts subject to gift tax only
- **Part 2** – Direct Skips (also subject to GST)
- **Part 3** – Indirect Skips (GST trusts triggering automatic allocation under §2632(c))
- **Schedule C** – DSUE allocation from prior deceased spouse
- **Schedule D** – GST exemption computation

### DSUE Filing Mechanics
- Form 706 Part 6, Section A: portability election (check box).
- Section B: DSUE computation = `(Basic Exclusion + DSUE from prior deceased spouse) − cumulative taxable estate − cumulative taxable gifts`.
- Section C: amount portable to surviving spouse.
- Section D: DSUE received from previously deceased spouse(s) — only ONE prior spouse's DSUE applies (last-deceased rule).
- Late portability relief: Rev. Proc. 2022-32 (5-year window for estates under filing threshold).

### State Equivalents (selected)
| State | Form | Threshold | Notes |
|---|---|---|---|
| **New York** | **ET-706** + Federal 706 attached | $7.16M (2025) | "Cliff" — exemption disappears if estate > 105% threshold. Due 9 months. ([NY DTF — ET-706](https://www.tax.ny.gov/pdf/current_forms/et/et706_fill_in.pdf); [Instructions](https://www.tax.ny.gov/pdf/current_forms/et/et706i.pdf)) |
| **Massachusetts** | **M-706** | $2.0M (post-Oct 2023) | Deaths on/after 1/1/2023; new instructions for deaths on/after 1/1/2025. ([Mass.gov — DOR Estate Tax](https://www.mass.gov/info-details/dor-estate-tax-forms-and-instructions); [M-706 Instructions](https://www.mass.gov/doc/form-m-706-instructions-for-dates-of-death-on-or-after-8125/download)) |
| **Washington** | "Washington State Estate and Transfer Tax Return" (XLSM/upload template) | $2.193M (pre-7/1/2025); $3M after | No federal-style form number; uploadable workbook to WA DOR. ([WA DOR — Estate Tax Forms](https://dor.wa.gov/forms-publications/forms-subject/estate-tax-filing-options-and-forms); [WA DOR — Estate Tax Tables](https://dor.wa.gov/taxes-rates/other-taxes/estate-tax-tables)) |
| **Connecticut** | CT-706/709 | $13.99M (2025; matches federal) | Single form covers both estate & gift; gift tax is unique among states. |
| **Oregon** | OR-706 | $1.0M | Top rate 16%. |
| **Maine** | Form 706ME | $7.0M | Indexed annually. |
| **Maryland** | MET-1 + MET-1 ADJ | $5.0M estate; inheritance tax separate (inheritance: 10% non-lineal) | Only state with both. |
| **Illinois** | Form 700 | $4.0M | No portability between spouses. |
| **Minnesota** | M706 | $3.0M | Includes 3-year gift lookback. |
| **Rhode Island** | RI-706 | $1.802M | |
| **Hawaii** | M-6 | ~$5.49M | |
| **DC** | D-76 | ~$4.873M | |
| **Vermont** | EST-191 | $5M | |

### Inheritance Tax States (different from estate tax)
- **Pennsylvania, New Jersey, Kentucky, Nebraska, Maryland** — tax beneficiaries based on relationship class (Class A spouse/lineal often 0%, Class C non-relative 15%+).
- Iowa fully phased out 2025.

### State Income Tax Returns for Trusts
- Most states with income tax require fiduciary returns (e.g., NY IT-205, CA Form 541, FL no income tax). State-specific apportionment for non-grantor trusts is highly variable (resident-trust rules differ → *Kaestner* (2019) limited NC's reach but state regimes still inconsistent).

### GAPS (Section 4)
- Updated 2026 versions of state forms (most published Q1 of next year).
- Unique state filing portals (paper vs. e-file vs. proprietary upload templates).
- Inheritance tax form numbers and class-rate matrices for PA, NJ, KY, NE.
- 706 e-file: not currently available; only paper or via tax software.
- State 1099-K and information return obligations vary state-to-state.

---

## Section 5: Advisor Regulatory Environment

### SEC Investment Adviser (RIA) Fiduciary Standard
- **Source:** Investment Advisers Act of 1940, § 206 (anti-fraud); SEC interpretation IA-5248 (June 2019) — RIAs owe a federal fiduciary duty consisting of duty of care and duty of loyalty. ([SEC Staff Bulletin — Standards of Conduct: Care Obligations](https://www.sec.gov/about/divisions-offices/division-trading-markets/broker-dealers/staff-bulletin-standards-conduct-broker-dealers-investment-advisers-care-obligations); [SEC Staff Bulletin — Conflicts of Interest](https://www.sec.gov/about/divisions-offices/division-trading-markets/broker-dealers/staff-bulletin-standards-conduct-broker-dealers-investment-advisers-conflicts-interest))
- **Federal RIAs:** AUM ≥ $100M (Dodd-Frank threshold); register on Form ADV with SEC; Parts 1, 2A (brochure), 2B (brochure supplement), and Form CRS for retail.
- **State RIAs:** AUM < $100M generally state-registered; mid-size advisers ($25M–$100M) split based on home state.
- **Key Form ADV updates 2024-2025:** SEC's IA-6383 enhanced disclosure requirements for private fund advisers; SEC Marketing Rule (206(4)-1, eff. Nov 2022) governs all advertisements/testimonials including AI-generated content.
- **Custody Rule (206(4)-2):** if RIA has custody of client assets, must use qualified custodian and obtain annual surprise exam; pending replacement "Safeguarding Rule" (proposed Feb 2023, status uncertain as of 2026).

### Regulation Best Interest (Reg BI) — Broker-Dealers
- **Source:** SEC Rule 15l-1 under Exchange Act, eff. June 30, 2020. ([Comply — What is Reg BI](https://www.comply.com/resource/what-is-reg-bi-a-guide-for-broker-dealers/); [Greenspring — Fiduciaries vs. BDs](https://greenspringadvisors.com/insight/fiduciary-vs-broker-dealer/))
- **Applies to:** broker-dealer recommendations to RETAIL customers about securities transactions and account types.
- **Four component obligations:**
  1. **Disclosure** — Form CRS (Customer Relationship Summary) at/before recommendation.
  2. **Care** — reasonable diligence/care/skill (per-investor and series of recommendations).
  3. **Conflict of Interest** — written policies/procedures, and ELIMINATE certain sales contests/quotas/non-cash comp on specific products. ([InnReg — Reg BI Compliance](https://www.innreg.com/blog/reg-bi-fiduciary-standard-compliance-rias-and-broker-dealers))
  4. **Compliance** — written supervisory procedures.
- **NOT a fiduciary standard** — Reg BI requires "best interest" but BDs do NOT owe ongoing duty of care after sale absent ongoing relationship. ([Family Wealth Report — Unintended Consequences of Reg BI](https://www.familywealthreport.com/article.php/Unintended-Consequences-of-Regulation-BI))
- **Form CRS required for both RIAs and BDs** — 2-page (BD/IA) or 4-page (dual) summary, mandatory delivery and machine-readable filing.

### Dual Registration / Hybrid Models
- Many advisors hold both Series 7/Series 65 and operate under both standards depending on capacity (commission product vs. fee-based advisory). Disclosure of capacity is critical.
- DOL fiduciary "Retirement Security Rule" (April 2024) was vacated by Texas federal courts (July 2024); DOL appeal status — partially abandoned by 2025 administration. **FLAG**: pre-2016 PTE 84-24/2020-02 framework remains in force.

### CFP Board Fiduciary Standard
- **Code & Standards (eff. Oct 1, 2019; revised 2023):** A CFP® professional must act as a fiduciary "at all times" when providing financial advice (not just investment advice). ([CFP Board — Code of Ethics](https://www.cfp.net/ethics/code-of-ethics-and-standards-of-conduct); [Kitces — Fiduciary At All Times](https://www.kitces.com/blog/fiduciary-at-all-times-cfp-professional-loyalty-care-financial-planning-advice/))
- **Three duties:** Loyalty (place client interests above self/firm), Care (prudent professional standard), Follow Client Instructions.
- **15 enumerated duties:** include Integrity, Competence, Diligence, Disclosure of Material Conflicts, Confidentiality, Documentation, etc. ([Kitces — 15 Fiduciary Duties](https://www.kitces.com/blog/the-15-fiduciary-duties-to-clients-that-cfp-professionals-must-comply-with/))
- **Enforcement:** CFP Board's Disciplinary and Ethics Commission; sanctions range from private censure to revocation.

### FINRA Roles (Broker-Dealer)
- **FINRA** is the SRO for BDs; supervises ~3,300 firms and ~620,000 registered persons. ([FINRA — Broker-Dealer Registration](https://www.finra.org/registration-exams-ce/broker-dealers))
- **Two principal classes:**
  - **Registered Representatives:** sales/trading/investment banking. Series 7 (general securities), Series 6 (mutual funds/var. insurance), Series 79 (IB), Series 22 (DPP), etc.
  - **Principals:** supervisory. Series 24 (general principal), Series 27 (FINOP — Financial & Operations Principal), Series 26, Series 4 (options principal), Series 51 (muni securities). ([InnReg — How to Register with FINRA](https://www.innreg.com/blog/how-to-register-with-finra))
- **State law overlay:** Series 63 (uniform agent), Series 65 (uniform IAR), Series 66 (combined 63+65).
- **Form U4 (individual) and Form BD (firm)** filed via FINRA Gateway / CRD.
- **FinCEN AML obligations** (BSA, OFAC) layer on top.

### Trust Company Chartering (State vs National)
- **State-chartered trust companies:** chartered by state banking departments; common in trust-friendly states (SD, NV, DE, WY). Can be limited-purpose or full-service. Powers vary by state statute (e.g., SD's "directed trust" enabling).
- **National Trust Banks:** OCC-chartered "uninsured national banks limited to the operations of a trust company" under National Bank Act and 12 USC § 27(a). ([OCC — Charters Q4 2025 Decisions](https://www.occ.gov/news-issuances/news-releases/2025/nr-occ-2025-125e.pdf))
- **2025 OCC activity:** Paxos converted; Fidelity Digital Assets converted; First National Digital Currency Bank chartered. As of Sept 30, 2025, OCC-supervised uninsured national trust banks held $6.8T AUA (incl. $1.6T custody + $5.2T fiduciary). ([OCC — Bulletin 2026-1a](https://www.occ.treas.gov/news-issuances/bulletins/2026/bulletin-2026-1a.pdf))
- **2026 NPRM:** OCC proposed clarifying rule on national trust bank non-fiduciary activities (CD #1365, #1367 issued Feb 2026). ([OCC — CD 1365](https://www.occ.gov/topics/charters-and-licensing/interpretations-and-decisions/2026/cd1365.pdf))
- **For wealth platforms:** to act as trustee/custodian directly, need trust company charter OR partnership with chartered trustee (Wealth.com partners with Bryn Mawr / others; not itself a chartered fiduciary).

### Unauthorized Practice of Law (UPL) — The Critical Boundary
- **Definition:** providing legal advice/services without bar admission. Each state's bar/courts define, regulate, and prosecute. ([Cal Bar — UPL](https://www.calbar.ca.gov/public/concerns-about-attorney/avoid-legal-services-fraud/unauthorized-practice-law); [Vanilla — UPL Glossary](https://www.justvanilla.com/estate-planning-glossary/unauthorized-practice-of-law-upl))
- **Activities that constitute UPL:**
  - Drafting or selecting legal documents for a specific person's situation.
  - Advising on legal rights/obligations.
  - Recommending specific provisions or strategies based on client facts.
  - Holding self out as authorized to give legal advice.
- **Permitted (non-UPL):**
  - General education / "scrivener" services (typing what client dictates).
  - Pure factual data entry.
  - General software template tools — under *LegalZoom* line of cases — typically OK if disclaimers and no individualized advice.
- **Wealth-tech specific risk:** auto-recommending "you should put X into a SLAT" based on client profile may cross UPL line in many states unless attorney is in the loop. ([EncoreEstate — Avoid UPL: 3 Steps](https://blog.encorestateplans.com/avoid-unauthorized-practice-law); [David Kinder — UPL is Closer Than You Think](https://www.davidkinderfinancial.com/post/psa-for-financial-advisors-the-unauthorized-practice-of-law-is-closer-than-you-think))
- **Mitigation patterns:**
  - Position as "diagnostic" / "summarization" tool, not advice.
  - Always route document drafting through licensed attorneys (referral network).
  - Heavy disclaimers; have client engage their own counsel for execution.
  - "Education only" framing for AI summaries.

### Tax Advice vs Legal Advice Line
- **Circular 230** governs practice before IRS — CPAs, EAs, attorneys, RTRPs (the latter category was struck down in *Loving v. IRS*, 2014).
- Tax-return prep itself is not UPL but giving advice on legal IMPLICATIONS of structures often is.
- Cross-border situations: foreign-asset reporting (FBAR FinCEN 114, Form 8938) typically tax — not legal — advice when limited to compliance.

### State-by-State Insurance License
- Producers selling life insurance, annuities, LTC must hold state insurance licenses (resident + non-resident). NAIC manages NIPR (National Insurance Producer Registry).

### Privacy / Reg S-P
- SEC Reg S-P (Privacy of Consumer Financial Information) was substantially amended May 2024 — RIAs and BDs must adopt incident response programs, notify affected individuals within 30 days, and have policies for vendor oversight. Compliance dates phased through Dec 2025 / June 2026.

### GAPS (Section 5)
- Status of DOL Retirement Security Rule appeal in 2026 — vacated mid-2024; further enforcement posture under current admin unclear.
- Exact list of states where AI estate-planning recommendations have been deemed UPL (no comprehensive enforcement-action map).
- Whether SEC Safeguarding Rule will replace Custody Rule and on what timeline (proposed Feb 2023).
- State-by-state UPL rules treatment of LegalZoom-style services post-recent rulings (active litigation ongoing).

---

## Section 6: Competitor Landscape

Estate-planning tech is rapidly bifurcating into (a) advisor-tech (Wealth.com, Vanilla, Luminary, FP Alpha) and (b) consumer DTC (Trust & Will, LegalZoom, Notarize) — with overlap and bundles emerging. Per **Kitces 2025 AdvisorTech Study**, the top three estate-document-prep platforms by advisor adoption/satisfaction are EncorEstate Plans, Trust & Will, and Wealth.com. ([EncorEstate — 2025 Kitces Study](https://blog.encorestateplans.com/top-estate-planning-software-rias-2025-kitces-advisortech-study); [Vanilla — Kitces 2024 Productivity Study](https://www.justvanilla.com/blog/kitces-2024-advisor-productivity-study))

### Vanilla
Advisor-facing estate planning visualization, modeling, and document storage platform. Provides "estate diagrams," tax projections (federal/state), beneficiary review, document repository. Focus on advisor-led conversations rather than direct doc generation; partners with estate attorneys / firms for drafting. Marketed extensively to RIA channel. Founded 2019 (Steve Lockshin pedigree). Per Kitces 2024 study, Vanilla and FP Alpha lead on usage. ([Vanilla homepage](https://www.justvanilla.com/))

### Holistiplan
Tax-planning software (not an estate doc generator) with auto-extracts from 1040s, surfaces multi-year scenarios, Roth conversion / RMD / Medicare surcharges. Holistiplan launched ADAPT estate-planning module in 2024. Holistiplan recently doubled prices, prompting competitor migration. ([Holistiplan — Estate Planning Software Comparison](https://www.holistiplan.com/resources/articles/estate-planning-software-comparison/); [reframeRIA — Tax Planning Deep Dive](https://www.reframeria.com/guides/project-one-f5w4d-bd5m3-ht9fl-xsr4n))

### FP Alpha
AI-driven full-spectrum advanced planning across tax + estate + insurance + Medicare. Document upload → automated extraction → "Insights." Standalone Tax module ($13–15/case) launched Jan 2025; Estate module ~$179/case; Insurance ~$58/case. AI-extraction-first positioning competing directly with Wealth.com on document extraction. ([Kitces — Feb 2025 AdvisorTech](https://www.kitces.com/blog/the-latest-in-financial-advisortech-february-2025-news-fp-alpha-right-capital-holistiplan-tax-return-extraction/))

### Trust & Will
Largest consumer-DTC estate document platform; recently expanded an advisor channel. Drag-and-drop will/trust generation; notary services bundled. Top-3 advisor tool per Kitces 2025. Capital raised: $46M Series C (2022). ([Trust & Will](https://trustandwill.com/))

### EncorEstate Plans
Advisor-only document drafting + funding service (deed prep, county filing). Focused on the operational gap: actually FUNDING the trust (re-titling assets) which most platforms don't touch. Covers ~95% of US counties for deed services. Launched 2021. Top-rated in Kitces 2025 study. ([EncorEstate Plans](https://www.encorestateplans.com/); [EncorEstate — Wealth.com vs Luminary blog](https://blog.encorestateplans.com/wealth-com-vs-luminary))

### Luminary
"Family-office grade" trust & estate planning data platform. Goes deeper on visualization, what-if scenarios, projected outcomes, "estate tax alpha" tracking. Built for multi-family offices, large RIAs. Addepar integration; positions as more sophisticated than Wealth.com for $25M+ households. ([Luminary](https://www.withluminary.com/); [Luminary on Addepar Marketplace](https://integrations.addepar.com/product/luminary))

### Eve (Income Lab)
Income Lab is retirement-income/distribution planning, not estate planning per se — repeatedly #1 in Kitces retirement distribution category. **NOTE:** task brief mentions "Eve" — I cannot find a product named "Eve" associated with Income Lab. Possible task-brief reference confusion; FLAG for clarification. Income Lab's primary product is the Income Lab platform; integrations include eMoney, MoneyGuide, and others. ([Income Lab](https://incomelaboratory.com/))

### LegalZoom Estate
Largest consumer DTC online legal services brand. Estate Planning Bundle: Will, POA, healthcare directive — attorney-supported tier available. Acquired Earth Class Mail; expanded into business formation. Public company (NASDAQ: LZ). Direct-to-consumer competition for Wealth.com's downstream/sub-HNW. ([LegalZoom Estate Planning Bundle](https://www.legalzoom.com/personal/estate-planning/estate-planning-bundle.html))

### AdvicePay / eMoney
- **AdvicePay:** purpose-built billing/payment processor for financial planners (subscription billing, custody-rule-compliant for advice fees). Founded by Michael Kitces & Alan Moore. Used by RIAs to invoice non-AUM planning. Not an estate planner; ecosystem partner to PreciseFP / eMoney. ([WealthMgmt — PreciseFP integrates with AdvicePay](https://www.wealthmanagement.com/financial-technology/precisefp-integrates-with-advicepay))
- **eMoney:** Fidelity-owned (acquired 2015) financial planning platform; "eMX" interactive planning + client portal. Long-tenured incumbent; deeper goal-based planning than estate-document-specific. Roughly 100K+ advisor seats. ([eMoney Advisor](https://emoneyadvisor.com/))

### PreciseFP
Client onboarding, fact-finding, e-forms, data-gathering → pushes data downstream to eMoney/RightCapital. Owned by Docupace since 2021. Integrates with AdvicePay, Salesforce, multiple CRMs. Important for the BEGIN-WITH-CLIENT-INTAKE phase of estate planning workflow. ([PreciseFP — AdvicePay integration](https://precisefp.com/partners/advicepay/); [Kitces — June 2025 AdvisorTech](https://www.kitces.com/blog/the-latest-in-financial-advisortech-june-2025-news-finmate-ai-precise-fp-cfp-board-advice-pay-betterment-advisobob/))

### Other Notable
- **Asset-Map** — visual financial inventory + estate diagrams (Vanilla competitor on visualization).
- **RightCapital** — comprehensive planning incl. estate/tax modeling.
- **MoneyGuidePro (Envestnet)** — large-incumbent planning platform.
- **eState Planner / Wealth Planner** — competing visualization niches.

### Competitive Positioning Summary
| Platform | Audience | Core Value |
|---|---|---|
| Wealth.com | RIAs / wealth managers (HNW/UHNW) | Estate plan as data: AI extraction + visualization + doc drafting + estate tax modeling |
| Vanilla | RIAs (HNW) | Estate diagrams + advisor-led conversations |
| Luminary | Family offices / RIA enterprise | Deep modeling, what-if, multi-entity |
| FP Alpha | RIAs | AI-driven multi-discipline (tax + estate + insurance) |
| Holistiplan | RIAs | Tax-led; estate as add-on |
| EncorEstate | RIAs | Document drafting + funding (operational) |
| Trust & Will | DTC + RIA | Streamlined doc generation |
| LegalZoom | DTC (mass market) | Affordable doc bundles |

### GAPS (Section 6)
- Verified ARR / revenue / valuation numbers for private players (Vanilla, Luminary, EncorEstate, Trust & Will, FP Alpha) — most undisclosed.
- Specific confirmed identity of "Eve" product — likely task-brief misnomer.
- Recent funding rounds for Trust & Will (last public was $46M Series C in 2022).
- Sub-segment penetration data: how many of top 100 RIAs use which platforms.

---

## Section 7: Integration Ecosystem Context

### Account Aggregation: Plaid vs Yodlee
- **Plaid:** ~12,000 institutions; modern API, OAuth-first, strong DTC fintech adoption. Stronger for transactional banking + identity. Per-link pricing ($0.50–$2 per successful link, volume discounts at 10K+). ([SnapTrade — Plaid vs Yodlee 2025](https://snaptrade.com/blogs/plaid-vs-yodlee); [Sacra — Plaid Funding](https://sacra.com/c/plaid/))
- **Yodlee:** ~19,000 sources; deeper enrichment / categorization; enterprise-tier pricing ($5K–$50K+/mo subscription). Strong wealth-mgmt/advisor channel via parent. ([Yodlee — Wealth Aggregation](https://www.yodlee.com/wealth-management/wealth-aggregation); [Monetizely — Cost Comparison 2025](https://www.getmonetizely.com/articles/plaid-vs-yodlee-how-much-will-financial-data-apis-cost-your-fintech-in-2025))
- **2025 inflection:** **Yodlee was sold by Envestnet to Symphony Technology Group (STG) in 2025** as part of Envestnet's go-private deal. Independent direction now; investment in product expansion.
- **Choice for wealth-tech:** Yodlee for HNW (held-away assets, diverse account types, alternatives); Plaid for DTC sub-HNW. Many platforms run both.
- **Open Banking / 1033 Rule:** CFPB's Personal Financial Data Rights Rule (final Oct 2024) under Dodd-Frank §1033 — banks must give customers data access via standardized APIs. Phased-in compliance Apr 2026 (largest banks) through Apr 2030 (smallest). Will partially commoditize aggregation. **FLAG**: 2026 status of legal challenges to Rule.

### Portfolio Management / Performance: Addepar vs Black Diamond vs Orion vs eMoney
- **Addepar:** UHNW/family-office oriented; multi-asset (alternatives, illiquid, real estate). Closed **$230M Series G at $3.25B valuation in May 2025** (Vitruvian/WestCap co-led). ([RIABiz — $5T Milestone Story](https://riabiz.com/a/2025/8/9/orions-prideful-cementing-release-and-its-5-trillion-milestone-prompts-rivals-black-diamond-tamarac-addepar-advyzon-to-counter-with-performance-data-and-stories-of-triumph-and-momentum-of-their-own); [Contrary Research — Addepar Breakdown](https://research.contrary.com/company/addepar))
- **Black Diamond (SS&C):** ~8% RIA market share; strong client portal/UX; lacks native financial planning (integrates eMoney/RightCapital). ([Kubera — Addepar vs BD](https://www.kubera.com/blog/addepar-vs-black-diamond))
- **Orion:** ~14% RIA market share; OCIO/billing/rebalancing strength. Crossed $5T in assets reported on platform per Aug 2025 announcements. ([RIABiz](https://riabiz.com/a/2025/8/9/orions-prideful-cementing-release-and-its-5-trillion-milestone-prompts-rivals-black-diamond-tamarac-addepar-advyzon-to-counter-with-performance-data-and-stories-of-triumph-and-momentum-of-their-own))
- **Tamarac (Envestnet):** ~18% market share; market leader.
- **eMoney (Fidelity-owned):** financial planning + client portal; integrates with all major perf-reporting systems.
- **Integration patterns:** estate-tech platforms (Wealth.com, Vanilla, Luminary) typically pull positions/values via these systems' APIs to populate net-worth statements.

### CRM: Salesforce FSC vs Wealthbox vs Redtail
- **Redtail (Orion-owned):** market leader by RIA seat count; affordable; pre-built integrations to most custodians and planning tools. Strong for small-mid practices. ([Revisor Group — CRM Comparison 2026](https://revisorgroup.com/redtail-vs-wealthbox-vs-salesforce-which-crm-is-best-for-financial-advisors/))
- **Wealthbox:** #2; modern UI/UX; **$200M investment in 2025** to deepen integrations; popular with younger/independent RIAs. ([AltaStreet — 9 Best CRMs 2025](https://www.altastreet.com/9-best-crm-for-financial-advisors-expert-picks-for-2025/))
- **Salesforce Financial Services Cloud (FSC):** enterprise tier; ~$300/user/month. Heavy customization, integration ecosystem (AppExchange). Used by enterprise BDs / wirehouses / large RIAs. ([Vantagepoint — FSC vs Wealthbox vs Redtail](https://vantagepoint.io/blog/sf/the-complete-crm-showdown-salesforce-fsc-vs.-wealthbox-vs.-redtail-vs.-orion-vs.-practifi))
- **Practifi:** Salesforce-based vertical CRM purpose-built for advice firms.
- **Wealth-tech integration model:** estate platforms must integrate to all 3 majors via API + OAuth — bidirectional contact/household/note sync.

### Custodians: Schwab / Fidelity / Pershing — Integration Patterns
- **Schwab Advisor Services API:** delivered via Schwab OpenView Gateway (Performance Technologies, Inc.). Integration matrix posted publicly. Account/balance, trade submission, document upload supported. Daily file feeds + emerging real-time API. ([Schwab — API Integration Matrix](https://advisorservices.schwab.com/resource/api-sso-integration-matrix); [Schwab — API Integration page](https://advisorservices.schwab.com/managing-your-business/tech-integration/api-integration))
- **Fidelity Wealthscape:** API Portal launched 2018; broader access in 2024-25; positions/balances, holdings, trade submission.
- **Pershing (BNY Mellon):** NetX360+ API; ~200+ third-party integrations. Has been most aggressive on "Custody-as-a-Service" API approach. ([Pershing — API Strategy 2021 article](https://wealthtechtoday.com/2021/06/14/custody-as-a-service-how-pershing-is-going-all-in-on-api-based-data-strategy/))
- **Newer custodians:** Altruist (RIA-only fast-growing challenger), Apex, TradePMR — modern API-first stacks. ([Kitces — Small RIA Custodians](https://www.kitces.com/blog/ria-custodian-list-best-platforms-small-startup-ria-altruist-axos-tradepmr-eas-pershing-schwab/))
- **Multi-custodial pattern:** wealth platforms typically normalize positions via abstraction layer (or use perf-reporting platform like Addepar as the single integration point).

### E-Signature: DocuSign vs Adobe Sign
- **DocuSign:** market leader; ~70% market share (Yahoo Finance Digital Signature Market Report); broadest integrations (Salesforce, MS, ~hundreds). Knowledge-based authentication (KBA) supported. Eligible for ESIGN Act and UETA. ([DocuSign vs Adobe Sign](https://www.docusign.com/vs/docusign-vs-adobe-sign); [Yahoo — Digital Signature Market 2025](https://finance.yahoo.com/news/digital-signature-market-company-evaluation-095100649.html))
- **Adobe Sign / Acrobat Sign:** strongest in PDF-heavy workflows / Adobe ecosystem; competitive pricing ($9.99/mo individual; $24.99/user team). ([PandaDoc — Adobe vs DocuSign 2025](https://www.pandadoc.com/blog/adobe-sign-vs-docusign-comparison/))
- **Wealth-tech use cases:**
  - Engagement letters, IPS, Form ADV delivery acknowledgments.
  - Estate doc execution — most states still require **wet signatures or remote online notarization (RON)** for wills/trusts/POAs. RON adoption variable.
  - Notarize/Proof.com bridge the RON gap.
  - **MUST CHECK:** state-specific signature/notarization rules for each estate document type.

### Identity / SSO: Microsoft Entra B2B (formerly Azure AD)
- **Rebrand:** Azure AD B2C/B2B → **Microsoft Entra External ID**. Effective **May 1, 2025**, Azure AD B2C **no longer sold to new customers**. Existing tenants continue. ([Microsoft Learn — External ID Overview](https://learn.microsoft.com/en-us/entra/external-id/external-identities-overview); [Envision IT — End of Sale May 2025](https://envisionit.com/resources/articles/microsoft-to-end-sale-of-azure-ad-b2bb2c-on-may-1-2025-shifting-to-entra-id-external-identities))
- **B2B Collaboration:** invite external partners as guest users; SSO via federation (SAML 2.0 / OpenID Connect / OAuth 2.0). MFA, conditional access, lifecycle policies.
- **2025 update — guest sign-in redirect:** beginning July 2025, guests are redirected to their HOME tenant for credentials, simplifying multi-tenant sign-in. Rolled out through end of 2025.
- **Pricing:** core MAU-based; first 50K MAU free. Premium add-ons for risk-based access.
- **Wealth platform pattern:** advisor firm runs its own Entra/Okta tenant; clients invited via B2B collaboration OR connect directly to Wealth platform's CIAM tenant. SCIM provisioning common.
- **Alternatives:** Okta (Auth0 for CIAM), Ping Identity, ForgeRock (acquired by Thoma Bravo).

### Other Critical Integrations
- **Tax-data:** GruntWorx, SurePrep, FP Alpha (extraction); Holistiplan/Wealth.com/Vanilla consume normalized 1040 data.
- **Insurance illustration:** Winflex, iPipeline (annuity OPS).
- **Beneficiary mgmt:** RetireUp, RightCapital.
- **Document storage:** Box, OneDrive, Citrix ShareFile.
- **CIO/Risk:** Riskalyze (Nitrogen), Tolerisk, Andes Wealth.

### Integration Standards & Protocols
- **OAuth 2.0 + OpenID Connect** for advisor SSO and consumer auth.
- **REST + JSON** dominates; some legacy SOAP/XML at enterprise custodians.
- **FDX (Financial Data Exchange)** open API standard for consumer financial data — preferred by 1033 Rule. Major banks adopting.
- **OFX (Open Financial Exchange)** — older; still common at smaller banks.
- **SFTP daily-batch files** — still standard for custodian holdings files (Schwab/Fidelity nightly drops).

### GAPS (Section 7)
- Specific list of which custodians have full real-time vs. batch APIs in 2026.
- 1033 Rule implementation status for Tier 2 banks (effective dates 2027-2029).
- RON state-by-state matrix for estate documents specifically (different from notary RON in general).
- Wealth.com's actual integration partner list (likely Schwab via Yodlee, Fidelity, BD via direct API; unconfirmed).

---

## Section 8: AI/LLM Patterns for Document Extraction (2025/2026 SOTA)

### Layout-Aware OCR + LLM Stack
- **Donut (Document Understanding Transformer)** — OCR-free; image → seq2seq generates structured output directly. Works at high resolution (~1920p input). Released H2 2022; widely deployed for invoices/forms. ([Tejpal Kumawat — Donut OCR-Free](https://medium.com/@tejpal.abhyuday/donut-ocr-free-document-understanding-with-donut-9303e4e4e33a))
- **LayoutLMv3 (Microsoft)** — multimodal pretraining with text + layout (bbox) + image patches. Cross-attention between bounding boxes and tokens; masked image modeling. SOTA on FUNSD/CORD/RVL-CDIP for visually rich documents. Released May 2022. ([KUNGFU.AI — LayoutLMv3 explained](https://www.kungfu.ai/blog-post/engineering-explained-layoutlmv3-and-the-future-of-document-ai); [ThirdEye — OCR + LayoutLMv3](https://thirdeyedata.ai/ocr-and-layoutlmv3/))
- **Amazon Textract Layout API** — adds layout-block extraction (TITLE, HEADER, PARAGRAPH, TABLE, FIGURE, etc.) on top of OCR. Returns confidence + geometry. Good upstream for LLM ingestion. ([AWS — Textract Layout feature](https://aws.amazon.com/blogs/machine-learning/amazon-textracts-new-layout-feature-introduces-efficiencies-in-general-purpose-and-generative-ai-document-processing-tasks/))
- **Azure Document Intelligence (formerly Form Recognizer)** — equivalent enterprise offering with prebuilt + custom models.
- **Google Document AI** — Google Cloud equivalent.
- **Modern LLM-only path:** Claude Sonnet 4 / Sonnet 4.5 / Opus / GPT-4o native PDF/image input — accept the document directly, vision-language output. Strong on layout reasoning without separate OCR step but more expensive per page.
- **Hybrid pattern (typical 2025-2026 production):** Textract/Azure DI extracts text + layout blocks → JSON-ified evidence packet → Claude/GPT structured output call → application-level validation.
- **2025 trend — multimodal LLM-based VRDU**: per arXiv 2507.09861 survey, MLLMs increasingly outperform LayoutLM-style encoder-only models on complex documents but at higher cost; many systems still combine both. ([arXiv 2507.09861 — MLLM-based VRDU survey](https://arxiv.org/html/2507.09861v2))

### Hallucination Mitigation Stack
1. **Structured Output / JSON Schema enforcement**
   - OpenAI Structured Outputs (`response_format: json_schema`), Anthropic Tool Use with input_schema, Google function calling. Constrain output → eliminate format hallucinations.
   - For estate docs: schema like `{ "trust_type": enum, "grantor": string, "trustee": string, "beneficiaries": [...], "funding_date": date, "termination_event": ... }`. ([Maxim AI — LLM Hallucination Mitigation](https://www.getmaxim.ai/articles/llm-hallucination-detection-and-mitigation-best-techniques/))
2. **Citation grounding**
   - Require LLM to return verbatim quote + page number for every extracted field.
   - Anthropic Citations (built-in), Google Vertex grounding, custom RAG-with-quote patterns.
   - Allows downstream verifier to confirm the quote actually appears in source PDF.
3. **Confidence scoring**
   - Per-field confidence (0–1) — either model self-reported or computed from log-probabilities (when accessible).
   - Threshold-based human-in-loop review (e.g., < 0.85 → advisor reviews).
4. **Deterministic-calculation layer**
   - LLM extracts STRUCTURED FACTS only.
   - Calculations (estate tax, GST inclusion ratio, Crummey funding capacity, marital deduction) executed by deterministic Python/JS code with audit logs.
   - Eliminates math hallucinations entirely. This is the **most critical pattern** for high-stakes legal/financial AI.
5. **Multi-doc reasoning + cross-document validation**
   - Compare beneficiary names in trust vs. will vs. beneficiary designation forms.
   - Flag inconsistencies as "review items" rather than auto-resolving.
6. **Human-in-the-loop checkpoints**
   - Review queue for low-confidence or high-stakes extractions.
   - Audit trail of who reviewed what, when.
7. **Verification / chain-of-thought self-check**
   - After extraction, ask LLM "does this answer appear verbatim in the source?" before commit.
   - Multi-layered framework approach (MDPI 2025) integrates retrieval, verification, structured outputs, confidence, and human oversight as separate redundant defenses. ([MDPI Computers 2025 — Multi-Layered Framework for High-Stakes LLMs](https://www.mdpi.com/2073-431X/14/8/332))
8. **Targeted fine-tuning / domain adaptation**
   - Fine-tune small models (LayoutLMv3, mT5) on labeled estate-doc corpus for high-volume routine fields.
   - Reserve LLM for harder/longer documents.

### Multi-Document Reasoning
- Chunk + retrieve (RAG) for long trust documents (50-150 pages typical).
- Per-document summary → cross-document structured comparison.
- Knowledge-graph layer: entities (people, trusts, accounts) → relationships (trustee-of, beneficiary-of) → consistency queries.
- For executive summarization: tiered approach — extract facts → deterministic-rule-based diagnostic narratives → LLM rewrite for advisor-friendly tone with citations to source.

### Wealth.com — "1,000 deterministic calculations per estate"
- Per Wealth.com PR (April 2026), **Ester Intelligence** (their AI engine) ran "more than 1,000 deterministic calculations per estate distribution" in 2025. ([Wealth.com — $65M Series B Press](https://www.wealth.com/resources/press/wealth-com-raises-65-million-series-b-to-power-ai-future-of-wealth-management/); [Financial IT — Wealth.com Series B](https://financialit.net/news/fundraising-news/wealthcom-raises-65-million-series-b-power-ai-future-wealth-management))
- **Technical interpretation (verified by their public framing):**
  - LLM extracts structured facts from documents.
  - 1,000 deterministic computations/checks executed per estate, including:
    - Estate tax across federal + applicable state(s) under multiple "if X spouse dies first" scenarios.
    - GST inclusion ratio per trust.
    - Marital deduction optimization.
    - Multiple sunset/exemption-amount scenarios.
    - Cross-document consistency checks (beneficiary, trustee, age-cliff dates).
    - Funding-status checks (e.g., is the house actually titled in the trust?).
    - Document-completeness checks (HIPAA present? POA durable? Springing-trigger met?).
    - Beneficiary-designation alignment.
  - Each calculation produces a result + audit trail; LLM only used to NARRATE, not COMPUTE.
- This is the canonical "extract-then-compute-then-narrate" pattern that dominates production wealth-AI by 2025-2026.
- **Auditability claim:** "deterministic, auditable outputs in high-stakes advisory environments" — supports compliance, malpractice defense, advisor approval workflow.

### Specific Document Types & Extraction Patterns
- **Wills:** identify executor, witnesses, residuary clauses, specific bequests, guardianship designations.
- **Revocable trusts:** grantor, trustee succession, distribution standards (HEMS — health, education, maintenance, support), termination triggers.
- **Irrevocable trusts (SLATs, ILITs, GRATs, IDGTs):** trust type classification (often inferred from clauses, not labeled), funding events, GST elections.
- **Beneficiary designations:** TOD/POD forms — primary, contingent, share %s.
- **POAs:** durable vs. springing, agent powers (gift power, real estate, banking).
- **Tax returns:** 1040 (carried forward income types, AMT, charitable carryforwards), 709 (cumulative gift history → exemption used), 706 (DSUE elections).
- **Marriage/divorce decrees:** community property, alimony, QDRO references.

### Open-Source Toolchain (2025-2026)
- **OCR/parsing:** Tesseract, PaddleOCR, EasyOCR, Surya, Marker.
- **Layout:** LayoutLMv3, LayoutXLM, Donut, Pix2Struct, Nougat (academic PDFs).
- **Frameworks:** LangChain/LlamaIndex, Haystack, DSPy.
- **Vector stores:** pgvector, Pinecone, Weaviate, Chroma, Qdrant.
- **Eval:** Ragas, Phoenix, LangSmith, Maxim, OpenAI Evals.
- **2025 inflection:** open-source extraction models (Qwen-VL, InternVL, Llama-Vision) closing gap with proprietary on standardized benchmarks (DocVQA, MMMU). ([HuggingFace — Open-Source Structured Document OCR](https://huggingface.co/datasets/John6666/knowledge_base_md_for_rag_1/blob/main/open_source_structured_document_ocr_20251115.md))

### Surveys / Reference Reading
- arXiv 2510.24476 — Application-Oriented Hallucination Survey (RAG, Reasoning, Agentic). ([arXiv 2510.24476](https://arxiv.org/html/2510.24476v1))
- arXiv 2509.18970 — LLM Agents Hallucinations Survey. ([arXiv 2509.18970](https://arxiv.org/html/2509.18970v1))
- arXiv 2510.09722 — Layout-Aware Parsing + Efficient LLMs (resume case study, generalizable). ([arXiv 2510.09722](https://arxiv.org/html/2510.09722v1))

### GAPS (Section 8)
- Wealth.com's actual model selection (Claude vs GPT vs in-house fine-tune) is not publicly disclosed.
- Exact list of 1,000 calculations is internal to Wealth.com.
- Per-document accuracy benchmarks for estate-specific extraction (no public leaderboard equivalent to DocVQA for trusts).
- Cost economics — per-page or per-estate processing costs are not disclosed publicly across competitors.

---

## Section 9: Security/Compliance Baseline for Wealth-Mgmt Fintech

### SOC 2 Type II
- AICPA Trust Services Criteria (Security + optionally Availability, Confidentiality, Processing Integrity, Privacy).
- **Type II** examines OPERATING EFFECTIVENESS over a window — typically 6–12 months. Type I is point-in-time. ([ComplyJet — ISO 27001 vs SOC 2](https://www.complyjet.com/blog/iso-27001-vs-soc-2); [Sprinto — How to get SOC 2 for Fintech 2025](https://sprinto.com/blog/soc-2-for-fintech/))
- **Non-negotiable** for B2B/enterprise fintech serving RIAs, BDs, custodians.
- Annual renewal; gap reports / bridge letters in between.
- **Common controls:** access reviews, MFA, encryption (at-rest + in-transit), incident response plan, change management, vendor risk, employee training, BCP/DR, secure SDLC.

### ISO 27001 / 27701
- **ISO/IEC 27001:** ISMS (Information Security Management System) — risk-based management framework. Annex A controls (now ~93 controls in 2022 version: organizational, people, physical, technological).
- **ISO/IEC 27701:** Privacy Information Management System extension — operationalizes GDPR/CCPA requirements.
- Strong in EU/APAC; complement (not substitute) for SOC 2. ([Kyte — SOC 2 vs ISO 27001 2025](https://kyte.global/soc-2-vs-iso-27001-2025/))
- Other relevant: ISO 22301 (BCM), ISO 27017/27018 (cloud-specific).

### GLBA (Gramm-Leach-Bliley Act)
- Federal law for financial institutions (broadly defined — includes RIAs, BDs, banks, insurers).
- **Privacy Rule (Reg P / FTC Safeguards Rule):** initial + annual privacy notices; opt-out rights for sharing nonpublic personal information (NPI) with non-affiliated third parties.
- **Safeguards Rule (FTC, eff. amended June 2023):** written info-sec program, designated qualified individual, risk assessments, encryption, MFA, incident response, secure dev for systems handling consumer info.
- Federal preemption interaction with state laws — NPI subject to GLBA generally exempt from state laws but EXCEPTIONS exist (see below).

### State Privacy Laws — CCPA/CPRA, NY SHIELD/DFS, Texas, etc.
- **California CCPA (2020) + CPRA (eff. 2023):** The CPRA regulations finalized **July 2025** add cybersecurity audits, risk assessments, and ADMT (automated decisionmaking technology) rules effective **Jan 1, 2027**. ([nContracts — CPPA Rules 2025](https://www.ncontracts.com/nsight-blog/california-privacy-protection-agencys-cppa-rules))
- **GLBA "exemption" caveat:** CCPA/CPRA exempt NPI subject to GLBA — but NOT browsing/web/marketing data, NOT non-financial PII, and NOT ADMT decisions. ([OneTrust — Navigating CPRA as GLBA-compliant](https://www.onetrust.com/blog/navigating-the-cpra-as-a-glba-compliant-business/); [Capco — California ADMT for FIs](https://www.capco.com/intelligence/capco-intelligence/californias-new-automated-decision-making-technology-rules))
- **Montana (May 2025) + Connecticut (June 2025):** eliminated broad GLBA entity-level exemption — financial institutions now in scope of state privacy law. ([Orrick — Where is GLBA Entity-Level Exemption?](https://www.orrick.com/en/Insights/2025/07/Where-is-the-GLBA-Entity-Level-Exemption-Two-More-State-Privacy-Laws))
- **Texas TDPSA** (eff. July 2024) — has GLBA exemption but tighter scope.
- **Other live state laws (2025-2026):** VA (CDPA), CO (CPA), CT (CTDPA), UT, IA, IN, TN, MT, OR, DE, NJ, NH, KY, MN — patchwork.
- **Patchwork management** is a critical product-design concern.

### NY DFS Part 500 — Cybersecurity Regulation
- 23 NYCRR Part 500 — applies to all NYDFS-regulated entities (banks, insurers; many wealth platforms in scope via partners). ([NYDFS — Cybersecurity Resource Center](https://www.dfs.ny.gov/industry_guidance/cybersecurity); [Hogan Lovells — Final Set Nov 1, 2025](https://www.hoganlovells.com/en/publications/nydfs-final-set-of-cybersecurity-requirements-under-amended-part-500-take-effect-november-1-2025))
- **2023 amendments phased in 2024-2025:** key 2025 dates:
  - **May 1, 2025** (penultimate set) — § 500.7 access privileges / least privilege; § 500.14(a)(2) cybersecurity training; § 500.14(b) endpoint detection/response (EDR). ([Hogan Lovells — Penultimate May 1 2025](https://www.hoganlovells.com/en/publications/nydfs-penultimate-set-of-cybersecurity-requirements-under-amended-part-500-take-effect-may-1-2025))
  - **November 1, 2025** (final set) — § 500.12 expanded MFA (essentially universal for any system access); § 500.13 documented Asset Inventory Program with owner/location/classification/EOL/RTO. ([Steptoe — Final NYDFS Rules Take Effect](https://www.steptoe.com/en/news-publications/final-nydfs-cybersecurity-rules-take-effect-what-financial-services-companies-must-do-now.html); [Alston Privacy — Final Reqs](https://www.alstonprivacy.com/additional-cybersecurity-requirements-of-nydfs-part-500-take-effect-today/))
  - **First certification incorporating new requirements:** April 15, 2026 annual certification.
- **CISO requirement:** named in writing; annual report to board.
- **72-hour incident notice; 24-hour ransomware payment notice.**
- **Class A companies** (>$20M revenue + ~2,000 employees or >$1B revenue) face heightened independent audit + privileged access management.

### HIPAA Implications
- HCDs and HIPAA Authorizations contain **Protected Health Information (PHI)** — formally regulated under HIPAA (Privacy Rule, Security Rule, Breach Notification).
- A wealth platform storing HCDs likely is NOT a HIPAA "covered entity" itself (not a healthcare provider/payer/clearinghouse) — but **may still have BAA-equivalent obligations** when interacting with HIPAA-covered entities (e.g., hospitals receiving the directive).
- Best practice: design storage/transmission to HIPAA Security Rule technical safeguards even where not strictly required (encryption, access controls, audit logs).
- **CCPA / state privacy carve-outs** for HIPAA-regulated data narrower than for GLBA.

### Data Residency / Encryption / KMS / HSM / BYOK
- **Encryption at rest:** AES-256 (FIPS 140-2 / 140-3 validated modules). Database transparent data encryption (TDE) baseline; field-level for PII/PHI.
- **Encryption in transit:** TLS 1.2 minimum; TLS 1.3 preferred; mutual TLS for partner APIs.
- **KMS:** AWS KMS, Azure Key Vault, GCP KMS — all FIPS 140-2 validated. Customer-managed keys (CMK) preferred over service-managed.
- **HSM (Hardware Security Module):** AWS CloudHSM, Azure Dedicated HSM, GCP Cloud HSM. Required by some enterprise wealth-mgmt customers.
- **BYOK / HYOK:** Bring/Hold Your Own Keys — customer custody of master keys, common HNW client requirement (per family office RFPs).
- **Data residency:** US-only typical; some advisor firms with non-US clients require region pinning. Cross-border data transfer (EU SCCs / UK IDTA) for any EU clients.

### Pen Testing Cadence
- **Annual external network/app pen test** — minimum (SOC 2, NYDFS, FFIEC).
- **Continuous bug bounty** — common at scale (HackerOne, Bugcrowd).
- **Quarterly internal vulnerability scans + ad-hoc red team exercises.**
- **Pre-release SAST/DAST/SCA/IaC scans** in CI/CD.
- **Tabletop incident response exercises** annually (NYDFS encourages).

### Other Frameworks Worth Tracking
- **NIST CSF 2.0** (Feb 2024) — common reference for security programs.
- **PCI DSS v4.0** — only relevant if accepting card payments directly.
- **CCM (Cloud Controls Matrix), CSA STAR** — for cloud-vendor due diligence.
- **AICPA SOC for Cybersecurity / SOC 2+ HITRUST** — extended trust packages.
- **FedRAMP** — only relevant if selling to federal customers; likely not for wealth-tech.
- **SEC Cybersecurity Rule for RIAs/Funds (proposed Feb 2022, status uncertain 2026)** — would mandate written policies, incident reporting, annual review. **FLAG**.

### Operational Best Practices
- Zero-trust network architecture; SSO + MFA universal; IdP (Okta, Entra) for workforce.
- IAM least privilege via role mappings; just-in-time access (PAM tools — CyberArk, BeyondTrust).
- Endpoint MDM + EDR (CrowdStrike, SentinelOne).
- DLP for outbound data; CASB for SaaS.
- SIEM + SOC (Splunk/Sentinel/Datadog Security; outsourced MDR common at ≤500 employees).
- Backup/restore tested monthly; immutable backups for ransomware resilience.
- Tabletop + simulated phishing.

### GAPS (Section 9)
- SEC RIA Cybersecurity Rule final status as of April 2026 — proposed but not yet finalized through Q1 2026.
- Specific vendor compliance status of Wealth.com (whether SOC 2 Type II + ISO 27001 are advertised; check trust portal).
- Final rule text of NYDFS § 500.13(b) asset-inventory implementation guidance.
- Whether SEC Reg S-P amendments (May 2024) have generated 2026 enforcement actions to watch.
- HIPAA business associate vs not — fact-specific by transaction; no clear bright-line for estate-tech.

---

## Section 10: Wealth.com Market Context + GAPS Summary

### Series B Funding — Verified
- **Date:** April 16, 2026.
- **Amount:** $65 million (oversubscribed). ([Wealth.com — $65M Series B Press Release](https://www.wealth.com/resources/press/wealth-com-raises-65-million-series-b-to-power-ai-future-of-wealth-management/); [BusinessWire announcement](https://www.businesswire.com/news/home/20260416563869/en/Wealth.com-Raises-$65-Million-Series-B-to-Power-AI-Future-of-Wealth-Management); [InvestmentNews — Wealth.com $65M](https://www.investmentnews.com/fintech/wealthcom-raises-65m-series-b-as-ai-adoption-accelerates-across-firms/266175))
- **Lead investor:** **Charles Schwab** (the artifact reference is correct — Schwab led). ([Fintech Global — Wealth.com $65M Series B](https://fintech.global/2026/04/16/wealth-com-raises-65m-series-b-for-ai-wealth-planning/); [ThinkAdvisor — Wealth.com Adds Dynasty as Investor](https://www.thinkadvisor.com/2026/04/16/wealthcom-raises-65m-adds-dynasty-as-investor/))
- **New investors in this round:**
  - **Titanium Ventures** (formerly Telstra Ventures)
  - **Pruven Capital**
  - **The K Fund**
  - **Dynasty Financial Partners** (strategic — Dynasty is a major RIA platform)
- **Existing/returning investors participating:**
  - Charles Schwab (lead)
  - GV (Google Ventures)
  - Citi Ventures
  - 53 Stations
  - Anthos Capital
  - Alumni Ventures
- **NOT verified in public press**: Brewer Lane Ventures (mentioned in task brief but no source surfaces this name). FLAG: confirm or delete from artifact.

### Distribution / Channel Partnership Claims — Verified
| Partnership | Status | Source |
|---|---|---|
| **Advyzon** integration | Live since **Oct 2025** ("first estate planning platform to integrate with Advyzon" — 2,400+ advisors) | [Wealth.com — Advyzon integration](https://www.wealth.com/resources/press/wealth-com-becomes-first-estate-planning-platform-to-integrate-with-advyzon/) |
| **Osaic** (National Planning Institute) | **Sept 2025** — Family Office Suite licensed exclusively; 11,000 affiliated professionals | [Wealth.com — Osaic NPI partnership](https://www.wealth.com/resources/press/wealth-com-named-estate-planning-partner-by-osaics-national-planning-institute/) |
| **Indivisible Partners** | **Nov 2025** — exclusive estate planning provider | [BusinessWire — Indivisible/Wealth.com](https://www.businesswire.com/news/home/20251106184734/en/Wealth.com-Named-Exclusive-Estate-Planning-Provider-for-Indivisible-Partners) |
| **LPL Financial** | **Jan 2026** — strategic relationship, 32,000 advisors on LPL platform | Per investor coverage of Series B — multiple sources confirm |
| Total advisor reach | 50,000+ across major BDs + RIAs | [TechStartups — Wealth.com 50,000 advisors](https://techstartups.com/2026/04/16/wealth-com-raises-65m-to-bring-ai-powered-estate-and-tax-planning-to-50000-financial-advisors/) |
| Assets reach | $15T+ in client assets across customer firms | [Wealth.com Press](https://www.wealth.com/resources/press/wealth-com-raises-65-million-series-b-to-power-ai-future-of-wealth-management/) |

### "664% YoY Growth" Claim — Confirmed
- Multiple corroborating sources cite "664% year-over-year growth" attributed to AI tech + tax-planning launch reaching 1,000+ advisory firms in 2 months. ([Wealth.com Press](https://www.wealth.com/resources/press/wealth-com-raises-65-million-series-b-to-power-ai-future-of-wealth-management/); [Connect Money — Series B story](https://www.connectmoney.com/stories/wealth-com-raises-65m-series-b-to-scale-ai-driven-estate-tax-platform/))
- **CAVEAT:** likely refers to revenue OR seat-count growth from 2024 base; specific metric not disclosed. Self-reported. Treat as marketing claim, not audited.
- **Other public metrics from PR:**
  - 100,000+ estate documents processed (2025).
  - 1,000+ deterministic calculations per estate distribution.
  - 50,000+ advisors with platform access.
  - Three largest US broker-dealers approved Wealth.com (the LPL/Osaic/?? trio).

### Comparison to Artifacts Catalog
- **Artifacts said: Schwab led** → CONFIRMED ✅
- **Investor list:** broadly consistent with verified press, BUT artifact may have included **Brewer Lane Ventures** which I cannot verify in 2026 sources. May be an old (Series A) investor mistakenly carried forward.
- **Wealth.com's prior rounds for context (verify if needed):**
  - Series A in 2024 reportedly $30M (Schwab et al).
  - Seed earlier; founders Rafael Loureiro (CEO), others.

### Product Architecture (gleaned from public material)
- **Ester Intelligence** — proprietary LLM-augmented engine ("trained on estate planning, tax planning and advanced wealth scenarios"). Not a generic LLM wrapper — combines ML extraction + deterministic rules + auditable outputs.
- **Modules:** Estate Planning + Tax Planning (newer) + Family Office Suite (UHNW tier with multi-entity / multi-jurisdiction).
- **Integrations:** Advyzon, presumably Salesforce FSC, Wealthbox, Redtail, Schwab, Fidelity, Pershing — exact list to be verified on integrations page.

### Final Cumulative GAPS — Things Still Unknown / Need More Research

#### Legal / Regulatory
1. Final 2026 IRS guidance / Rev. Proc. with full set of inflation-adjusted thresholds for §2032A, §6166, and DSUE-related transitional rules following OBBBA.
2. State-by-state 50-state matrices for: estate tax exemptions 2026, will execution rules, POA forms, RON acceptance for estate docs, RUFADAA adoption, e-Will Act adoption, inheritance tax class structure (PA/NJ/KY/NE).
3. Status of SEC RIA Cybersecurity Rule (proposed Feb 2022; not finalized as of Q1 2026).
4. DOL Retirement Security Rule litigation final disposition.
5. SEC Safeguarding Rule replacement of Custody Rule timeline.
6. Comprehensive UPL enforcement-action map for AI estate tools (no public catalog).

#### Tax / Estate Planning Mechanics
7. Detailed §7520 rate trajectory 2026.
8. Treatment of pre-2026 DSUE under post-OBBBA $15M floor — IRS guidance pending.
9. Practical interaction of OBBBA SALT cap changes with state estate planning.
10. CFPB §1033 Personal Financial Data Rights Rule challenges (litigation status mid-2026).

#### Competitive Intelligence
11. Verified ARR/valuation for Vanilla, Luminary, FP Alpha, EncorEstate, Trust & Will.
12. Confirm "Eve" product identity — likely task-brief misnomer.
13. Wealth.com's actual pricing model (per-seat vs. per-advisory-firm vs. % of AUM tier).

#### Wealth.com Specifics
14. Wealth.com's official integration list (CRM, custodian, planning tools).
15. Wealth.com's compliance posture (SOC 2 Type II, ISO 27001, NYDFS) — check trust portal.
16. Identity of all three "largest broker-dealers" — likely LPL + Osaic + Cetera/Raymond James (one not yet confirmed).
17. Composition of the 1,000 deterministic calculations — internal IP.
18. Series A $ amount (uncorroborated above).
19. Whether Brewer Lane Ventures is or was an investor.
20. Wealth.com's ML model architecture — fine-tuned vs. prompted vs. proprietary base model.

#### Technical Implementation
21. Best-in-class extraction accuracy on estate-doc benchmarks (no public leaderboard).
22. Production cost/latency for full estate workflow (per estate).
23. State-specific drafting templates — vendor (e.g., NetDocs) or in-house.
24. Notarization integration (Notarize, Proof.com partnerships).

#### Market Sizing
25. Estimated TAM for advisor-tech estate planning niche (rough industry estimates vary $1-3B).
26. Estate planning gap among US households (commonly cited: <40% of adults have a will; UHNW penetration higher but documents often stale).

### Recommended Next-Phase Research Priorities (Top 5)
1. Build canonical 50-state matrix (estate tax + document execution + RON) — required before product MVP.
2. Verify Wealth.com's exact integration partner list and CRM SDKs.
3. Fully map UPL safe-harbor patterns by state with attorney consult.
4. Document deterministic-calculation list (proprietary or licensed taxonomy?).
5. SOC 2 Type II readiness scoping for clone build.

### GAPS (Section 10)
- Brewer Lane Ventures inclusion uncertain in 2026 cap table.
- "664%" denominator/numerator unspecified by Wealth.com.
- Full list of approved BDs not disclosed.
- "$15T" client assets figure is sum of customer-firm AUM, not Wealth.com's; do not conflate.

---

**Status:** COMPLETE (10 of 10 sections) — `domain-brief.md`

