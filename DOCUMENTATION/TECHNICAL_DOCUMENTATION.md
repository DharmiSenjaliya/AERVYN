# AERVYN: ECHOES OF TIME
## TECHNICAL ARCHITECTURE & SYSTEMS MANUAL

**Product:** AERVYN: ECHOES OF TIME  
**Version:** 1.0.0 Commercial Release  
**Tech Stack:** React 19 + Three.js + React Three Fiber + Drei + GSAP | Laravel 12 + MySQL + Laravel Sanctum  

---

## 1. System Architecture Overview

```text
+---------------------------------------------------------------------------------------+
|                                    CLIENT (BROWSER)                                   |
|                                                                                       |
|  +--------------------+  +----------------------+  +-------------------------------+  |
|  |   3D Game Engine   |  |   Player Dashboard   |  |     Administrative Portal     |  |
|  | - Canvas / R3F     |  | - Profile & Lore     |  | - 13 Management Sections      |  |
|  | - Orbit Camera     |  | - Achievements & XP  |  | - Telemetry & Analytics       |  |
|  | - Web Audio API    |  | - Social Hub & Arena |  | - Moderation & Audit Logs     |  |
|  +---------+----------+  +----------+-----------+  +---------------+---------------+  |
|            |                        |                              |                  |
|            +------------------------+------------------------------+                  |
|                                     |                                                 |
|                             Axios Central API                                         |
|                       (Bearer Token / Sanctum Guard)                                  |
+-------------------------------------|-------------------------------------------------+
                                      | HTTPS / REST JSON
+-------------------------------------v-------------------------------------------------+
|                                    BACKEND (LARAVEL 12)                               |
|                                                                                       |
|  +--------------------+  +----------------------+  +-------------------------------+  |
|  |  Routing & Guards  |  |   Domain Services    |  |     Data Persistence Layer    |  |
|  | - auth:sanctum     |  | - ProgressionService |  | - Eloquent Models             |  |
|  | - admin middleware |  | - ChallengeService   |  | - MySQL 8 InnoDB Tables       |  |
|  | - throttle:auth    |  | - ActivityService    |  | - Foreign Keys & Cascades     |  |
|  +--------------------+  +----------------------+  +-------------------------------+  |
+---------------------------------------------------------------------------------------+
```

---

## 2. Frontend Engineering

### Technology & Dependencies
- **React 19 (`react`, `react-dom`):** Modern functional component architecture utilizing hooks (`useState`, `useEffect`, `useRef`, `useCallback`).
- **React Three Fiber (`@react-three/fiber`):** Declarative WebGL renderer connecting React components directly to Three.js scene graphs.
- **Three.js (`three`):** Hardware-accelerated 3D graphics library managing geometries, materials, lighting, frustum culling, and shadow maps.
- **Drei (`@react-three/drei`):** High-performance utilities (`Stars`, `PerspectiveCamera`, `Html`).
- **GSAP (`gsap`):** Smooth timeline and camera transition tweens.
- **Lucide React (`lucide-react`):** Clean icon system for UI controls and dashboards.

### Reactive State Management (`GameState.js`)
The game engine uses a singleton reactive store pattern (`GameStateManager`):
- `subscribe(listener)`: Subscribes components to state changes.
- `notify()`: Dispatches updates to active listeners without triggering unnecessary root re-renders.
- Isolated sub-states:
  - `player`: `[x, y, z]` coordinates, rotation, health, chronoEnergy, movement flags.
  - `mission`: Active step, total steps, description, completed objectives list.
  - `inventory`: Collected key items, fragments, cores, shards.
  - `settings`: Graphics quality, audio volumes, camera sensitivity.

### 3D Scene Composition
1. **Scene Lifecycles:** Each world scene (`LostKingdomScene`, `BrokenPresentScene`, `FracturedFutureScene`, `LastTimelineScene`) is wrapped in `<Suspense fallback={<LoadingScreen />}>`.
2. **Dynamic Level of Detail & Graphics Scaling (`useGraphicsSettings.js`):**
   - Canvas device pixel ratio (DPR) throttled to `0.8` on low devices and `[1, 2]` on high.
   - Shadow map resolution dynamically switches between `512`, `1024`, and `2048`.
   - Starfield particle count scales between `1000` and `3500`.
3. **Third-Person Orbit Camera (`ThirdPersonCamera.jsx`):**
   - Lerps behind `targetRef` with spherical coordinate smoothing.
   - Respects mouse delta on desktop and touch drag delta on mobile.
   - Automatic pitch clamping prevents gimbal flip.

### Procedural Web Audio Engine (`AudioSystem.js`)
Zero external `.mp3` dependencies:
- Web Audio API `AudioContext` initializes on first user gesture.
- Pink/white noise buffers create realistic wind and atmospheric drone.
- Biquad bandpass filters and gain envelopes generate footsteps, jumps, crystal chimes, puzzle chimes, and combat hits.
- Mute state and volume levels persist to `localStorage`.

---

## 3. Backend Architecture

### Technology & Architecture
- **Laravel 12.x:** Modern PHP 8.2+ framework utilizing route grouping, controller action isolation, and Eloquent ORM.
- **Laravel Sanctum:** Lightweight token-based API authentication issuing Bearer tokens stored in client `localStorage` under `aervyn_token`.
- **Database Schema:** 18 normalized tables with foreign key constraints, composite unique indexes, and cascading deletes.

### Core Domain Services
1. **`PlayerProgressionService`:**
   - Defines mathematical XP thresholds and ranks:
     - Level 1: Novice Explorer (0 XP)
     - Level 2: Chrono Initiate (500 XP)
     - Level 3: Rift Walker (1,250 XP)
     - Level 4: Epoch Seeker (2,250 XP)
     - Level 5: Time Weaver (3,500 XP)
     - Level 6: Continuum Master (5,000 XP)
     - Level 7: Singularity Adept (7,000 XP)
     - Level 8: Singularity Master (10,000+ XP)
   - Handles level-up triggers and progression percentage calculations.
2. **`ChallengeValidationService`:**
   - Validates telemetry submissions against template limits.
   - Automatically determines winner (`better: 'lower'` for speedruns, `'higher'` for scores).
   - Awards XP through `PlayerProgressionService::awardXp()`.
3. **`SocialNotificationService`:**
   - Dispatches in-game notification records with 10-minute duplicate suppression.
4. **`SocialActivityService`:**
   - Broadcasts public events (achievements, world completions, challenge wins) while enforcing player privacy rules.

---

## 4. Security & Hardening Protocols

1. **Authentication Security:**
   - Passwords hashed using Bcrypt with 12 rounds.
   - Sanctum tokens validated on every authenticated route.
   - Tokens strictly stripped from public profile responses.
2. **Authorization Guards:**
   - `admin` middleware enforces `$user->isAdmin()` check; ordinary players receive 403 Forbidden.
   - Suspended accounts (`is_active = false` or `is_banned = true`) are immediately rejected.
   - Socially suspended accounts (`is_social_suspended = true`) are barred from friend requests and challenges while preserving single-player access.
3. **Anti-Cheat Validation:**
   - Step verification: `completeWorld` requires `$progress->current_step >= $minStep` (returns 422 if unfulfilled).
   - Server-enforced XP: Client cannot submit XP values; all XP increments occur on backend via verified game completions or challenges.
   - Mass-assignment protection: `level`, `xp`, `role`, and `is_banned` are excluded from user-editable fillable attributes.
4. **Rate Limiting:**
   - Public auth endpoints (`/api/auth/*`): Throttled to 10 requests per minute per IP.
   - General API endpoints (`/api/*`): Throttled to 120 requests per minute per user/IP.
5. **Safe File Uploads:**
   - Strictly validated MIME types: `image/jpeg`, `image/png`, `image/webp`.
   - Max file size: 2MB.
   - Filenames sanitized with regex `preg_replace('/[^a-zA-Z0-9_\.-]/', '_', ...)`.
   - Brand asset deletion protection: `aervyn-logo.png` cannot be removed.
