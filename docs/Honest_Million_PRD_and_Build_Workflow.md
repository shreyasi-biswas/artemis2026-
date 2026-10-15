# The Honest Million: PRD and Build Workflow

Artemis 2026 · Problem Statement 1 · Team of 3 · Working document

---

## 1. Summary

**Product type:** A mobile-first, calm goal-planning companion for first-time investors. It is a decision coach, not a trading app.

**One line:** A calm, one-decision-at-a-time experience that measures every choice in years to the goal, shows outcomes as honest ranges rather than promises, and lets the user rehearse a bad year before it happens.

**The user:** Aarav, 19, second-year college student. About ₹8,000 a month from pocket money and a part-time gig. Has never invested. Wants to become a millionaire.

**Goal (confirmed on the goal screen):** ₹10,00,000 (10 lakh). Switchable to ₹1 crore.

---

## 2. Problem

Aarav does not lack options. He has too many he cannot evaluate, and nobody has told him that some years lose money.

The product must help him:

1. **Make sense of the options.** Understand how they differ and which matter for someone like him.
2. **Narrow down to a plan.** Choose a mix and amounts, and see how each choice changes time to goal.
3. **Manage it over time.** See what he holds and how it is doing, without a dashboard of competing numbers.
4. **Feel that not every year is good.** Experience a decline, understand what it does to his plan, and still believe in it.

**Core tension (from the brief):** show too much and Aarav freezes; hide too much and the product decides for him.

---

## 3. Goals and non-goals

**Goals**
- A complete, working demo of all four jobs on a phone-sized screen.
- Every number is either computed by one engine or clearly labelled as illustrative.
- A user can explain their plan in two sentences and stay calm through a simulated fall.

**Non-goals**
- Real trading, KYC, payments, real market data, accounts, backend.
- Gamification, streaks, leaderboards, stock tips, live tickers.
- More than two charts.

---

## 4. Design principles (settle every argument with these)

1. **One decision per screen.** Never ask him to compare more than he can hold in his head.
2. **Time is the currency.** Express every choice as "adds 8 months" or "saves 1 year", not as percentages.
3. **Ranges, not promises.** Show a likely path with a realistic band. A single confident number is dishonest.
4. **The product suggests, he decides.** Offer a sensible default with a reason. Never pre-select a "right" answer. Always let him change it.
5. **Plain words first, jargon on tap.** "Lock-in" becomes "money you can't touch for 5 years."
6. **Calm, not clever.** No confetti, streaks, flashing red or green, tickers.
7. **Rehearse the bad year.** Losses are shown before they happen, then again when they happen.
8. **Honest by default.** Every projection carries the disclaimer. No "will", no "guaranteed", no "ahead of schedule" unless the engine supports it as a range.

---

## 5. Persona insights that shape the design

- **₹8,000 is income, not investable money.** He can realistically invest ₹1,000 to ₹3,000. Help him find his number without shaming a small one.
- **₹10 lakh is the Indian "million."** Confirm it on the goal screen.
- **Inflation shrinks the goal.** Offer a "in today's money" toggle.
- **Small amounts work, given time, but slowly.** Illustrative arithmetic (monthly SIP, ₹10 lakh target, monthly compounding): at 12% a year, ₹1,000 takes about 20 years, ₹2,000 about 15 years, ₹3,000 about 12 years. At a more cautious 9%, ₹2,000 takes about 17 years. Deliver this gently, including the uncomfortable part that it is slow.
- **His biggest risk is the first bad year, not the wrong fund.** Put design effort where drop-out risk is.

---

## 6. Scope

### Must have (the demo spine)
- Welcome and goal (₹10 lakh, with "today's money" toggle)
- Monthly amount and split
- Options as a card stack (five roles)
- Plan builder with live time-to-goal range and delta chips
- Home with one hero sentence and three rows
- Decline event with plan impact and three choices
- Simulation engine (client-side, unit-tested)
- Disclaimer on every projection screen

### Should have
- Rehearse-a-bad-year screen with the Reality Strip
- Letter to future self (written in onboarding, returned in the decline)
- Time-travel control (demo jumps)
- Step-up option (raise the monthly amount yearly)

### Could have
- Hinglish toggle for key screens
- Monthly check-in ritual
- Shareable plan summary card

**Cut order if time runs short:** Hinglish → check-in → step-up → time-travel polish → letter. Never cut the spine.

---

## 7. Screens and flow

1. **Welcome.** "What would a million change for you?" Three tappable answers, plus free text.
2. **Goal.** "₹10,00,000. That's 10 lakh." Toggle to ₹1 crore. Toggle to "in today's money."
3. **Your number.** A bar showing ₹8,000 split into *keep for yourself*, *emergency cushion*, *invest*. Default ₹2,000 with the reason shown. "Starting with ₹1,000 counts."
4. **Letter to future self.** Prompt: "What will you tell yourself when it falls?" Suggestions available.
5. **Feel check.** "Your ₹10,000 becomes ₹8,000 in a month. What do you do?" Three neutral answers. Sets the starting mix. No wrong answers.
6. **Meet the options.** Card stack, five roles, one at a time, progress dots.
7. **Build your plan.** Sliders, live hero range, delta chips, Journey Line (Chart 1), guardrail notes.
8. **Rehearse a bad year.** Guided fall and recovery on the Journey Line. Reality Strip (Chart 2).
9. **Home.** Hero sentence, three or four role rows, one action.
10. **Holding detail.** Tap a row for history and the Journey Line.
11. **Decline event.** Calm full-screen moment, plan impact, three choices, letter from past self.
12. **Recovery view.** Gentle fast-forward with "the past doesn't guarantee the future."

---

## 8. Functional requirements

### Job 1: Options
- Five roles, not dozens of products:

| Role | Examples | Plain-language promise |
| --- | --- | --- |
| Safety net | Savings account, liquid fund | Always there, grows very slowly |
| Steady | Fixed deposit, PPF, government bonds | Predictable, some locked in |
| Growth | Nifty 50 index fund | Best long-run growth, can drop hard |
| Hedge | Gold | Moves on its own rhythm, can sit flat for years |
| Not for you yet | Stock picking, crypto, intraday, F&O | Why we leave these out, one honest line each |

- SIP is explained as "a way of investing monthly", not as a product.
- Each card shows four things in this order: growth range over 10 years; worst realistic year; when you can get money out; yearly cost in ₹ per ₹10,000.
- Each card ends with "Why this matters for someone like you."
- Jargon is underlined; tap for a one-sentence definition.

### Job 2: Plan builder
- Suggested starter mix with a one-line reason. He can accept or move sliders.
- Hero shows time to goal as a range with a middle estimate: "About 15 years. Could be 13 to 18."
- Each slider change shows a delta chip ("+1 yr 4 mo", "−8 months") that fades after a moment.
- Chart 1, Journey Line: one line from today to the goal, shaded realistic band, dot at goal. No numeric axes.
- Guardrails are gentle notes, never blocking errors: money locked in that he may need; suggest a cushion first; never allocate more than he said he can spare.
- Costs in ₹ per year.

### Job 3: Manage over time
- Hero: "On track. About 14 years to go." Status is computed against the plan band (ahead, on track, a little behind).
- Holdings by role, each with amount and one calm status word.
- One action only: "Your ₹2,000 for October is done."
- Rule: only one number at full visual weight on screen.

### Job 4: Bad year
- **Rehearse:** plan shown during a fall, with paper loss vs real loss explained in one sentence each.
- **Decline event:** "Markets have fallen. Here's what that means for you." No red alarm styling.
  - One sentence on what happened, plus a comparison to a past Indian fall (verify figures before quoting).
  - Plan impact: "Goal moves from 14 years to 15 years 2 months."
  - What you own now: "The same ₹2,000 now buys more units."
  - Three choices, each showing its effect in years: keep going, pause, withdraw. Equal visual weight. No choice shamed or blocked.
  - Letter from past self at the bottom.
- **Acceptance test:** after the event, a tester can say in their own words what happened to the plan and why staying invested is reasonable, and does not feel pressured either way.

---

## 9. Simulation engine (spec)

Pure TypeScript, in `src/engine/`, with unit tests. Keep it simple and transparent.

**Assumptions (illustrative, shown on a "How we estimate" sheet):**

| Role | Expected annual return (base) | Annual volatility (for band) | Worst realistic year |
| --- | --- | --- | --- |
| Safety net | 3% | 0.5% | about 0% |
| Steady | 7% | 3% | about −2% |
| Growth (index) | 10% | 18% | about −30% |
| Hedge (gold) | 8% | 15% | about −15% |

Use a cautious base case (9–10% for the index). Do not use 12% as the headline.

**Functions:**
- `futureValue(monthlyAmount, annualReturn, months)`: deterministic path, monthly compounding, monthly rate = annual / 12.
- `monthsToGoal(plan, goal)`: iterate month by month until the balance reaches the goal (cap at 600 months).
- `scenarioBand(plan, goal)`: 500 to 1,000 seeded random paths (use a fixed seed, for example mulberry32, so the demo is repeatable). Return the 10th, 50th, and 90th percentile times to goal. The 50th percentile must match `monthsToGoal` within one month, or the difference must be explained.
- `applyShock(plan, shockPct, atMonth)`: applies a one-time drop to growth holdings, then the recovery path.
- `inflationAdjust(goal, years, inflationRate)`: "today's money" version of the goal. Use 5–6% as the illustrative rate and label it.

**Checks before demo:**
- Unit test: `futureValue` against a hand-calculated example.
- Unit test: ₹2,000/month at 9%, ₹10 lakh goal, about 17 years (see section 5).
- Unit test: the same inputs always produce the same band (seed fixed).
- Every number on screen comes from these functions. No hardcoded multipliers.

---

## 10. Design system

**Feel:** a patient friend, not a broker. Warm, quiet, spacious.

**Colour tokens**
- `--bg`: #FAF8F5 (warm paper)
- `--surface`: #FFFFFF
- `--ink`: #18181B (primary text)
- `--ink-soft`: #57534E (secondary text, minimum contrast AA)
- `--accent`: #0F766E (deep teal, the only accent)
- `--accent-soft`: #CCFBF1 (chip background)
- `--amber`: #B45309 (dip and caution, text plus icon, never alone)
- `--band`: teal at 15% opacity (realistic range fill)

No red. Gains and losses are shown with text and icons ("↑ up", "↓ down"), never colour alone.

**Type**
- Display: Fraunces (serif, for hero sentences and large numerals).
- Body: Plus Jakarta Sans or system sans.
- Body minimum 16px. Hero 28–36px. Chip and caption 13–14px.
- Indian number format everywhere: ₹10,00,000.

**Spacing and layout**
- Design for 390px width. Desktop shows a phone-sized frame centred on warm paper.
- 8px spacing grid. 24px screen padding. Tap targets 44px minimum.
- One primary button per screen, full width at the bottom.

**Components**
- **Hero sentence:** one line, large serif, the only big thing on the home screen.
- **Delta chip:** small pill with a ↑ or ↓ icon and text ("+1 yr 4 mo"). Neutral colour.
- **Range band:** soft translucent fill around the Journey Line, never a hard edge.
- **Card stack:** one card visible, progress dots on top, swipe or Next button.
- **Jargon tap:** dotted underline, opens a bottom sheet with one sentence.
- **Mix bar:** one horizontal stacked bar of ₹ amounts, sliders below. The bar is the only visualisation on the builder besides the Journey Line.
- **Letter card:** paper-textured card, handwriting-style quote in serif italic, dated.

**Motion**
- Only the Journey Line animates, and only when the plan changes (400–600ms ease-out).
- The decline screen fades the background to a muted warm tone over 800ms. No shake, no flash.
- Respect `prefers-reduced-motion`: switch to instant state changes.

**Two charts only**
- **Chart 1, Journey Line:** one line from "You, now" to "You, at goal", with a dot at the goal and a shaded band for the realistic range.
- **Chart 2, Reality Strip:** about 20 small blocks, one per year of the index. Up years and down years. No axes, one glance.

---

## 11. Copy and tone

- "This will take about 15 years. That's slow, and it's real."
- "A fall is not a loss until you sell."
- "Starting with ₹1,000 counts."
- "We didn't show him more. We showed him what matters."

Avoid: "will", "guaranteed", "boost", "ahead of schedule" (unless as a range), "secret", "smart money", "easy".

Every screen with a projection carries: **"Educational simulation. Returns are illustrative assumptions, not predictions or investment advice."**

---

## 12. Accessibility

- Body 16px minimum, strong contrast (AA), tap targets 44px.
- Sliders have visible labels and accessible names, with keyboard support.
- Tabs or steps announce their current state to screen readers.
- Gains and losses use text and icons, not colour alone.
- Reduced-motion support.
- Indian number formatting and class-8 reading level.

---

## 13. Tech stack and repo structure

**Stack:** React + Vite + TypeScript, Tailwind CSS, Zustand (state, saved to localStorage), hand-rolled SVG for the two charts, Framer Motion used sparingly, Vitest for engine tests. Deploy to Vercel or Netlify.

```
honest-million/
  src/
    engine/            # pure TS: futureValue, monthsToGoal, scenarioBand, applyShock, inflationAdjust
      engine.test.ts
    data/              # roles.json, options.json, copy.json, assumptions.json
    store/             # Zustand store (plan, goal, letter, sim state)
    components/        # Hero, DeltaChip, JourneyLine, RealityStrip, CardStack, MixBar, LetterCard, Disclaimer
    screens/           # Welcome, Goal, YourNumber, Letter, FeelCheck, Options, Builder, Rehearse, Home, Holding, Decline, Recovery
    styles/            # tokens.css
    App.tsx
  README.md            # how to run, how we estimate, disclaimer
```

Put all copy in `copy.json` so the tone can be reviewed in one place.

---

## 14. Team workflow (3 people)

### Roles

| Person | Owns | Deliverables |
| --- | --- | --- |
| **A: Engine and data** | `src/engine`, `src/data`, store, tests | Engine functions, tests passing, assumptions sheet, Zustand store |
| **B: Flow and builder** | Welcome → Goal → Your number → Letter → Feel check → Options → Builder → Rehearse | Full onboarding path, card stack, plan builder with live Journey Line |
| **C: Home, decline, design, ship** | Design tokens, Home, Holding detail, Decline, Recovery, deploy, demo | Home, decline sequence, RealityStrip, deployed link, demo video |

Everyone writes copy and runs user tests.

### Git workflow
- `main` is always deployable. Work on `feat/<name>` branches, merge via pull request, at least one review.
- Commit small and often. Pull `main` at each milestone.
- Agree on the store shape and component props in the first hour, so A, B, and C can work in parallel.

### Timeline (work backwards from 3 PM)

Please confirm the deadline. I have assumed submission is **3 PM today** and that you have about 5–6 hours. Adjust the blocks if you have more or less.

| Block | Time | Work |
| --- | --- | --- |
| 1 | First 30 min | Read this doc together. Lock the goal (₹10 lakh), five roles, assumptions table, product name. Create repo, tokens file, store shape. |
| 2 | Next 60 min | A: engine functions and tests. B: welcome, goal, your number screens with dummy data. C: home and decline screens with dummy data. |
| 3 | Next 90 min | B: options card stack, plan builder wired to engine. C: decline event with hardcoded plan first, then wired. A: scenario band. |
| 4 | Next 60 min | **First end-to-end path merged** (welcome → builder → home → decline). Ugly is fine. |
| 5 | Next 60 min | Rehearse screen, Reality Strip, letter to future self, disclaimer on every projection screen. |
| 6 | Next 45 min | Polish: type sizes, spacing, reduced motion, jargon taps. Test with 2 people who look like Aarav. Fix the top three confusion points. |
| 7 | Last 30 min | Deploy, record backup demo video, rehearse 3-minute pitch. **Freeze. No new features.** |

**If time is tight:** protect the spine (Goal → Builder → Home → Decline). Cut everything in section 6's cut order.

### Daily check-ins (every 60–90 minutes)
- 5-minute stand-up: what's done, what's blocked, what's next.
- Anyone blocked for more than 15 minutes asks the team, not the clock.

---

## 15. Demo script (3 minutes)

1. **(20s) Problem:** "Aarav has ₹8,000 and a hundred options." Show him freezing on a list.
2. **(40s) Goal and options:** ₹10 lakh confirmed. Five roles, one card at a time.
3. **(50s) Plan builder:** drag a slider, watch "+1 year 4 months" appear. Show the range.
4. **(20s) Home:** one sentence, three rows.
5. **(50s) Decline:** time-travel to a fall. Calm screen, plan impact, three choices, his own letter.
6. **(10s) Close:** "We didn't show him more. We showed him what matters."

---

## 16. Acceptance criteria

- A new user finishes onboarding in about 4 minutes.
- They can explain their plan in two sentences.
- After the decline, they can say what happened to the plan and why they would keep going or why they would not, without feeling pressured.
- No screen shows a single confident projection. Every projection is a range with the disclaimer.
- No pre-selected "right answer" on any choice screen.
- Engine tests pass. Every number on screen traces to the engine or to labelled copy.

---

## 17. Risks

| Risk | Mitigation |
| --- | --- |
| Scope creep into charts and features | Two-chart rule and must-have list. Cut order fixed in advance. |
| Claims that are wrong or sound like advice | Disclaimer on every projection. Assumptions sheet. Verify any historical figure before quoting. |
| Looks like a generic fintech app | Time-as-currency, rehearsal, letter to future self. Protect these. |
| Engine bugs embarrass the demo | Fixed seed, tests, hand-checked example. |
| Running out of time | Protect the spine. Cut order in section 6. |
| Demo fails live | Deployed link, recorded video, local copy. |

---

## 18. Open questions (decide in block 1)

- Exact submission deadline and format (repo, video, deck): check the rules.
- Present on phone, laptop, or projector? This sets the frame and font sizes.
- Demo language: English first, with Hinglish only if time allows.
- Product name: keep "The Honest Million" or shorten it.
