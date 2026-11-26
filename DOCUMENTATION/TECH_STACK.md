# AERVYN: ECHOES OF TIME — Technology Stack & Architecture

This document provides a technical breakdown of the languages, frameworks, libraries, APIs, and tools powering **AERVYN: ECHOES OF TIME**.

---

## 1. High-Level Architectural Diagram
```
+-------------------------------------------------------------------+
|                        CLIENT LAYER (Browser)                     |
|                                                                   |
|   +-----------------------+     +-----------------------------+   |
|   |    React 19 SPA       |     |   Three.js & R3F 3D Engine  |   |
|   |  - Router & Layouts   |     |  - Character Controller     |   |
|   |  - Player Dashboard   |     |  - 4 Procedural Worlds      |   |
|   |  - 23-Module Admin    |     |  - Lighting & Shaders       |   |
|   |  - Social & Community |     |  - Web Audio Synthesizer    |   |
|   +-----------+-----------+     +--------------+--------------+   |
|               |                                |                  |
|               +---------------+----------------+                  |
|                               | Axios (Bearer Tokens)             |
+-------------------------------|-----------------------------------+
                                | HTTPS REST API
+-------------------------------v-----------------------------------+
|                        SERVER LAYER (Backend)                     |
|                                                                   |
|   +-----------------------------------------------------------+   |
|   |                   Laravel 12 REST API                     |   |
|   |  - Middleware: CORS, Sanctum, Throttle, AdminRole         |   |
|   |  - Controllers: Auth, GameState, Social, Admin, Inquiries |   |
|   |  - Services: AchievementEngine, ActivityLogger            |   |
|   +-----------------------------+-----------------------------+   |
|                                 | Eloquent ORM                    |
+---------------------------------|---------------------------------+
                                  |
+---------------------------------v---------------------------------+
|                        DATA LAYER (MySQL 8.0)                     |
|                                                                   |
|   - users, password_reset_tokens, personal_access_tokens          |
|   - game_progress, inventory, achievements, user_achievements     |
|   - friends, friend_requests, player_challenges                   |
|   - user_reports, user_suspensions, activity_logs, buyer_inquiries|
+-------------------------------------------------------------------+
```

---

## 2. Frontend Technologies
| Component | Technology | Version | Purpose |
|---|---|---|---|
| **Core Framework** | React | 19.x | UI state management and component lifecycle |
| **Build Tool** | Vite | 8.x | High-speed ESM bundling and zero-latency HMR |
| **Routing** | React Router DOM | 6.x | Single-page client navigation and route guards |
| **3D Rendering** | Three.js | 0.170+ | WebGL 2.0 rendering scene graph |
| **Three.js React Bindings** | React Three Fiber | 8.x | Declarative 3D scene construction |
| **3D Utilities** | @react-three/drei | 9.x | OrbitControls, Html overlays, and 3D helpers |
| **Animations** | GSAP | 3.x | UI transitions, portal vortex sweeps, cinematic fades |
| **Iconography** | Lucide React | 0.400+ | Cohesive cybernetic and gaming icons |
| **HTTP Client** | Axios | 1.7+ | API requests with automated token interception |
| **Audio** | Web Audio API | Native | Procedural sound generation without audio files |

---

## 3. Backend Technologies
| Component | Technology | Version | Purpose |
|---|---|---|---|
| **Core Framework** | Laravel | 12.x | REST API architecture, routing, and controllers |
| **Language** | PHP | 8.2+ | Modern server-side execution |
| **Authentication** | Laravel Sanctum | 4.x | Token-based SPA and mobile authorization |
| **Relational Database** | MySQL | 8.0+ | Persistent transactional player data storage |
| **ORM** | Eloquent ORM | 12.x | Model relationships and query abstraction |
| **Testing Engine** | PHPUnit | 11.x | Automated feature and end-to-end testing |
| **Security Middleware** | Fruitcake CORS, Throttle | Native | Rate-limiting and cross-origin protection |

---

## 4. Why This Architecture Was Chosen
1. **Zero External 3D File Bloat:** By using procedural geometry and Web Audio synthesis, the entire game engine loads in under 2 megabytes gzipped.
2. **High Security Standards:** All save states, mission progress, achievements, and administration operations are strictly validated server-side.
3. **No Proprietary Lock-In:** Standard React and Laravel stacks can be hosted on AWS, DigitalOcean, Hetzner, Linode, or any private Linux server.
