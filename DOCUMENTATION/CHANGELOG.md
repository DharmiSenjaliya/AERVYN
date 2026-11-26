# AERVYN: ECHOES OF TIME
## MASTER CHANGELOG & VERSION HISTORY

All notable changes to the *AERVYN: ECHOES OF TIME* codebase are documented herein.

---

## [Version 1.0.0] — 2026-11-26 (Commercial Master Handover Release)

### Commercial Packaging & Handover Architecture (Prompt 11 & 12)
- **Centralized White-Label & Reskin Architecture:**
  - Built `BrandingController` and `AdminBrandingController` with database persistence in `game_settings`.
  - Added optional white-label customization of product name, tagline, company identity, logo, favicon, and CSS color variables (`--color-cyan`, `--color-purple`, `--color-gold`).
  - Added dedicated Admin Management page (`/admin/branding`) featuring real-time previews (Header, Login, Dashboard, Loading, Menu, Footer).
  - Enforced safe `RESET TO AERVYN DEFAULT` action that restores the official AERVYN brand identity without modifying player accounts or database tables.
- **Dynamic Feature Flags System:**
  - Centralized toggles for Demo Mode, Social Hub, Leaderboard, Friends, Challenges, Achievements, Buyer Inquiry, Product Showcase, White Label, Analytics, and Landing Page.
- **Commercial Showcase & Buyer Demo Mode:**
  - Public Commercial Landing Page (`/`) with 4-world previews, features grid, what's included inventory, realistic system specs, and inquiry form.
  - Sandboxed Buyer Demo Mode (`/demo`) and Completion Screen (`/demo/complete`) with isolated in-memory evaluation milestones and zero database contamination.
  - Commercial Product Specifications Page (`/product`).
  - Buyer Inquiries Pipeline (`POST /api/inquiries`) and Admin Triage CRM (`/admin/inquiries`).
- **DevOps & Turnkey Handover Assets:**
  - Created production deployment templates for Nginx (`deployment/nginx/`), Apache (`deployment/apache/`), Systemd, and Supervisor.
  - Created operational automation scripts (`scripts/install-windows.bat`, `install-linux.sh`, `backup-db.bat`, `backup-db.sh`, `restore-db.bat`, `restore-db.sh`, `deploy.bat`, `deploy.sh`).
  - Created clean environment templates (`backend/.env.example` and `frontend/.env.example`).
  - Expanded comprehensive documentation suite to 18 operational and architectural manuals.

### Security & Hardening
- Implemented rate limiting (`throttle:auth` 5–10 req/min, `throttle:api` 60–120 req/min) on public endpoints.
- Enforced strict MIME type inspection (`png`, `jpg`, `webp`, `svg`, `ico`) and filename regex sanitization on media and branding uploads.
- Protected the official AERVYN brand asset (`aervyn-logo.png`) against administrative deletion.
- Added normalized error boundary (`ErrorBoundary.jsx`) intercepting uncaught runtime/3D exceptions without technical stack trace leaks.
- Enhanced API interceptor with normalized `userFriendlyMessage` handling for 401, 403, 422, 429, 500, and network timeout scenarios.

### Quality Assurance & Automated Testing
- Expanded PHPUnit test suite to **59 automated tests (1,161 assertions)** with 100% pass rate.
- Verified Vite 8 production build (2,890 modules transformed, 0 errors, built in 1.28s).

---

## [Prompt 9 / Pre-1.0.0] — 2026-11-26
- Added Online Social Hub (`/social`) with live unread alert polling.
- Implemented Player Search (`/social/search`) with case-insensitive debounced lookups and public profile dossiers.
- Implemented bidirectional Friendship system (request, accept, decline, cancel, remove).
- Implemented Player Blocking system with automated mutual friendship severance and invitation purging.
- Created asynchronous Player Challenge arena (`courtyard_sprint`, `quantum_harvest`, `phase_bridge_reflex`, `chrono_rift_trial`) with server-side telemetry verification.
- Added Social & Friends Leaderboard with dedicated "Friends Only" view.
- Added 6-control Player Privacy settings page (`/social/privacy`).
- Added Staff Moderation suite (`/admin/social`) with conduct report triage and player social suspension tools.

---

## [Prompt 8] — 2026-11-26
- Created comprehensive Player Dashboard (`/player/dashboard`) featuring live XP gauges, active world cards, and recent achievements.
- Implemented Player Profile customization (`/player/profile`) with 6 avatar hologram presets and bio editor.
- Built Gameplay Statistics breakdown (`/player/statistics`) tracking puzzles, collectibles, and boss victories.
- Implemented Achievements showcase (`/player/achievements`) and Global Leaderboards (`/player/leaderboard`).

---

## [Prompt 7] — 2026-11-26
- Developed 13-section professional Administrative Dashboard (`/admin/*`).
- Integrated studio overview KPIs, player ban/suspension controls, world catalog editor, feedback triage queue, and media library.

---

## [Prompt 6] — 2026-11-26
- Designed and built World 4: The Last Timeline (The Zero Horizon).
- Created Continuum Synchronization puzzle and Nexus Decision room.
- Orchestrated Dual Narrative Endings: Ending A (The Prime Timeline Weaver) and Ending B (The Shattered Continuum).
