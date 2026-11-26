# AERVYN: ECHOES OF TIME
## Buyer Demo Room Operations & Evaluation Manual
**Document Version:** 1.0.0 Commercial Release  
**Route:** `/buyer-demo`  
**Classification:** Confidential Commercial Handover & B2B Sales Specification  
**Target Audience:** Prospective Publishers, Gaming Portal Operators, Technical Due Diligence Teams

---

## 1. Executive Summary

The **Interactive Buyer Demo Room** (`/buyer-demo`) provides an enterprise-tier B2B evaluation environment where prospective commercial buyers explore *AERVYN: ECHOES OF TIME* without requiring client downloads, app store wrappers, or production database accounts.

It combines real implemented product features, a 16-section guided interactive tour, live WebGL hardware compatibility diagnostics, sandboxed 3D gameplay exploration, safe read-only player and admin demonstrations, client-side white-label simulation, and direct commercial quote generation.

---

## 2. Architecture & Public Entry Workflow

```text
Visitor arrives at /buyer-demo
       │
       ├────────────────────────────────────────┐
       ▼                                        ▼
[Public Explorer Mode]              [Private Token Validated]
- General evaluation access         - High-entropy cryptographic token
- Full access to 16 tour sections   - Verified company name & evaluator tier
- In-memory 3D sandbox slice        - Priority commercial triage status
       │                                        │
       └───────────────────┬────────────────────┘
                           ▼
                  [Interactive Hub]
       ┌───────────────────┼────────────────────┐
       ▼                   ▼                    ▼
[Guided Tour]      [Feature Showcases]   [Requirements Checker]
(16 sequential     - 4 Worlds            - WebGL 2.0 active
 sections with      - Player Portal       - GPU detection
 presentation       - Admin Ops           - Spatial audio
 mode & shortcuts)  - White-label         - 60 FPS target
                           │
                           ▼
                 [Commercial Inquiry]
                 - Package A: Source Buyout
                 - Package B: Customization
                 - Package C: White-Label
```

---

## 3. Key Modules of the Buyer Demo Room

### 1. Requirements & Browser Compatibility Checker
- Evaluates the evaluator's browser for **WebGL 2.0**, Canvas 2D, display pixel density (DPR), touch availability, and **Web Audio API** spatial synthesis.
- Explains what is evaluated without scraping or storing invasive hardware identifiers.

### 2. The 4 Dynamic Story Worlds
- In-depth lore, visual atmosphere highlights, and mission parameters for **World 1 (The Lost Kingdom)**, **World 2 (The Broken Present)**, **World 3 (The Fractured Future)**, and **Final Chapter (The Last Timeline)**.

### 3. Read-Only Player System Showcase
- Sample operative profile (`Operative_Echo7`), level progression, XP curve calculations, 16 unlocked/locked achievement medals, inventory items, and competitive speedrun rankings.
- Permanently tagged with the required disclaimer banner: `DEMO DATA — NOT LIVE PLAYER STATISTICS`.

### 4. Enterprise Admin Suite Showcase
- Safe least-privilege preview of studio KPIs, player account moderation queues, world publishing controls, lead CRM pipelines, and theme presets.
- Permanently tagged with the required disclaimer banner: `ADMIN DEMONSTRATION MODE — NO LIVE PRODUCTION MODIFICATIONS`.

### 5. Interactive White-Label & Reskin Simulator
- Real-time client-side preview of custom game titles, publishing company names, primary/secondary/accent color palettes, and copyright text.
- Changes update DOM styles immediately without touching backend configurations, with a one-click button to pre-fill the inquiry form.

### 6. Zero-PII Walkthrough Telemetry & Feedback
- Tracks evaluator section views and completion milestones using random session IDs.
- Evaluators can submit a 1–5 star rating with feedback notes.
