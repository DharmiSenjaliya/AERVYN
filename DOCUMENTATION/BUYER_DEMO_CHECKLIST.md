# AERVYN: ECHOES OF TIME
## Buyer Demo & Technical Due Diligence Checklist
**Document Version:** 1.0.0 Commercial Release  
**Target Audience:** Sales Engineers, Product Managers, Account Executives, and Prospective Technical Evaluators

---

## 1. Pre-Demo Preparation (5 Minutes Before Call)

- [ ] **Verify Server Status:**
  - Backend running: `php artisan serve --port=8000` or Nginx reverse proxy responding.
  - Frontend compiled and active: `http://localhost:5173` or production URL.
  - Database connectivity verified: MySQL `aervyn_db` accessible.
- [ ] **Check Clean Browser Profile:**
  - Use Google Chrome or Firefox with hardware acceleration enabled.
  - Close background tabs consuming excessive GPU memory.
  - Test audio output: ensure volume is enabled (Web Audio synthesized effects will sound).
- [ ] **Verify Admin Access:**
  - Login credentials ready for `/admin/login` (`admin@aervyn.com` / `AdminPass123!`).
  - Open `/admin/inquiries` in a background tab to demonstrate real-time lead capture.

---

## 2. Walkthrough Sequence & Scripted Milestones

### Phase 1: Commercial Landing Page & Executive Pitch (3 Minutes)
- [ ] **Navigate to Landing Page (`/`):**
  - Highlight the official logo and master tagline: *"CHANGE THE PAST. SURVIVE THE PRESENT. DISCOVER THE FUTURE."*
  - Demonstrate browser-native 3D execution: explain that zero downloads, Steam installations, or plugins are required.
  - Show the 4 CTAs: `PLAY DEMO`, `EXPLORE PRODUCT`, `REQUEST A QUOTE`, `BUYER PRESENTATION MODE`.
  - Scroll through the 4 Worlds Showcase (World 1, World 2, World 3, Final Chapter).
  - Open the Screenshot Gallery: click an image to demonstrate high-resolution Lightbox modal rendering.
  - Show the Package Deliverables Matrix and transparent B2B FAQ.

### Phase 2: Interactive Buyer Presentation Deck (`/presentation`) (4 Minutes)
- [ ] **Launch Guided 15-Slide Presentation:**
  - Demonstrate slide navigation (Next, Previous, slide indicator dots, Skip to End).
  - Highlight Key Slide Topics:
    - *Slide 1:* Executive Overview & Zero Installation advantage.
    - *Slide 3:* The 4 Timeline Worlds and visual distinction.
    - *Slide 6:* 3D Engine Architecture (React 19 + Three.js + 60 FPS).
    - *Slide 8:* 23-Module Enterprise Admin Suite.
    - *Slide 11:* Package Tiers A, B, and C with 100% royalty-free ownership.
    - *Slide 14:* White-Label dynamic theming preview.

### Phase 3: Interactive 3D Buyer Demo (`/demo`) (5 Minutes)
- [ ] **Launch Live Sandbox Demo:**
  - Note: Emphasize to the buyer that this mode is strictly sandboxed in memory and does not affect production player saves.
  - **Milestone 1 — 3D Locomotion & Camera:**
    - Use `WASD` to navigate the ancient temple courtyard.
    - Hold `Shift` to sprint; press `Spacebar` to jump across stone steps.
    - Orbit the camera using the mouse to demonstrate smooth Three.js third-person tracking.
  - **Milestone 2 — Interaction & Puzzle Solving:**
    - Approach the glowing golden Chrono Fragment and press `[E]` to collect it.
    - Walk to the central runic stone pedestal and press `[E]` to open the alignment dial interface.
    - Click "Rotate 45°" until the runic indicator reaches 180° alignment.
    - Hear the synthesized harmonic chime as the gateway portal awakens with dynamic particles.
  - **Milestone 3 — Spacetime Portal Warp:**
    - Step through the portal into the completion screen (`/demo/complete`).
    - Point out that the demo completion telemetry was logged automatically to the admin CRM.

### Phase 4: Enterprise Admin Suite & Lead CRM (`/admin`) (4 Minutes)
- [ ] **Navigate to Admin Portal:**
  - Open `/admin/dashboard` to show live KPI cards, player metrics, and session timelines.
  - Open `/admin/inquiries` (Lead CRM):
    - Show the **Buyer Demo Conversion Funnel** card: confirm that the demo session was tracked in real time.
    - Demonstrate lead triage: open an inquiry, change priority to `urgent`, schedule a `follow_up_date`, and add CRM notes.
    - Click **Export CSV** to demonstrate safe, non-sensitive prospect data extraction.
  - Open `/admin/branding` (White-Label Suite):
    - Demonstrate live color adjustments (e.g., change accent color from cyan to emerald or gold).
    - Click "Reset to AERVYN Default" to demonstrate fail-safe rollback.
  - Open `/admin/product-content` (Marketing CMS):
    - Show how landing page titles, taglines, and package descriptions can be updated without touching source code.

### Phase 5: Technical Due Diligence & Code Review (3 Minutes)
- [ ] **Review Codebase Quality:**
  - Show clean separation between `frontend/` (React 19) and `backend/` (Laravel 12).
  - Show test coverage: run `php artisan test` in terminal to demonstrate 59 passing tests (1,171+ assertions).
  - Show production build: run `npm run build` in `frontend/` to demonstrate 0 errors in under 1.5 seconds.
  - Point to `DOCUMENTATION/` directory containing 27 detailed architectural and operational manuals.

---

## 3. Post-Demo Follow-Up Checklist

- [ ] **Send Product Brochure Link:** Email prospect `https://aervyn-game.com/brochure` or provide PDF.
- [ ] **Update CRM Lead Status:** In `/admin/inquiries`, mark lead as `demo_sent` or `negotiation`.
- [ ] **Log Action Items:** Enter specific buyer customization requests in `follow_up_notes`.
- [ ] **Schedule SLA Follow-up:** Set calendar reminder for follow-up within 24 hours.
