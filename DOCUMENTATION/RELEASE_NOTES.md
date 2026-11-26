# AERVYN: ECHOES OF TIME — Release Notes & Version History

---

## Version 1.0.0 — Commercial Production Release
**Release Date:** November 2026  
**Status:** Commercial Master Release (Ready for Buyout & Licensing)

### Highlights
- **Turnkey Commercial Packaging:** Public commercial showcase, buyer demo evaluation mode, and automated lead capture system.
- **Complete Single-Player Campaign:** All 4 worlds connected chronologically with story cutscenes, 10+ missions, and dual branching endings.
- **Enterprise Operations Suite:** 23-module administrative control panel with live analytics, player management, and commercial inquiry CRM.
- **100% Royalty-Free Runtime Assets:** Fully procedural Three.js 3D world geometry and Web Audio API synthesized soundscapes.
- **Full Automated Test Coverage:** 54 PHPUnit feature and integration tests with over 1,000 assertions passed.

---

### Detailed Changelog by Subsystem

#### 1. Commercial Packaging & Public Showcase
- Added responsive **Commercial Landing Page (`/`)** with official logo, cinematic hero, 4 worlds showcase, features matrix, what's included inventory, and system requirements.
- Implemented **Buyer Demo Mode (`/demo`)** — an isolated evaluation slice of World 1 with progress tracking HUD, runic dial puzzle, and portal activation, strictly segregated from player saves.
- Added **Demo Completion Screen (`/demo/complete`)** showcasing full commercial game capabilities and direct licensing next steps.
- Created **Commercial Product Specification Page (`/product`)** with complete deliverable inventory and architectural diagrams.
- Implemented **Commercial Inquiry Pipeline:**
  - Database migration and `buyer_inquiries` table.
  - Rate-limited `POST /api/inquiries` endpoint.
  - Admin triage module (`/admin/inquiries`) with status filtering and internal CRM notes.

#### 2. 3D Game Engine & World Progression
- **World 1 (The Lost Kingdom):** Ancient stone temple, foliage, rune dial pedestal puzzle, and Keystone acquisition.
- **World 2 (The Broken Present):** Dilapidated metropolis, electrified hazards, circuit fuse box puzzle, and subterranean tunnels.
- **World 3 (The Fractured Future):** Cyber citadel, patrol security drones, laser defense grids, and quantum frequency alignment puzzle.
- **Final Chapter (The Last Timeline):** Celestial convergence arena, multi-phase boss fight against **The Chronarch**, dynamic attack telegraphs, temporal shielding, and dual branching endings.

#### 3. Player Experience & Social Layer
- **Player Gaming Dashboard (`/player/dashboard`):** Real-time XP tracking, player level progression, completed worlds, and active missions.
- **Achievements System:** 10+ unlockable achievements synced to MySQL with tier badges and completion timestamps.
- **Online Social Hub (`/social`):** Player discovery search, mutual friend requests, async time-trial challenges, and social leaderboards.
- **Granular Privacy:** Player configuration for public, friends-only, or private profile and stats visibility.

#### 4. Security & Quality Assurance
- **Sanctum Authentication:** Secure token-based session handling.
- **Rate Limiting:** Auth throttling (`5 req/min`) and API request throttling (`60 req/min`).
- **CORS Hardening:** Configured for stateful domains.
- **Error Boundaries:** Global React error boundary with user-friendly recovery and audio crash resilience.
- **54 Automated Tests:** Comprehensive PHPUnit test suite covering authentication, game saves, achievements, social interactions, admin permissions, and commercial inquiries.
