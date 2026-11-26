# AERVYN: ECHOES OF TIME — Commercial Handover & Technical Transfer Manual
**Version:** 1.0.0 Commercial Release  
**Audience:** Buyer Engineering Leads, System Architects, DevOps Engineers, and Product Managers

---

## 1. Product Overview & Architecture
**AERVYN: ECHOES OF TIME** is an original, commercially viable 3D action-adventure and puzzle game engineered entirely for modern web browsers. It combines real-time WebGL rendering with a robust relational backend to deliver high-performance, single-player campaigns without requiring downloads or client emulators.

- **Frontend:** React 19 single-page application bundled with Vite 8.
- **3D Engine:** Three.js (v0.187) via React Three Fiber & Drei.
- **Backend API:** Laravel 12 on PHP 8.2+ with Sanctum token-based authentication.
- **Database:** MySQL 8.0+ (14 relational tables, InnoDB engine).
- **Audio Engine:** 100% procedural Web Audio API synthesizer.

---

## 2. Commercial System Deliverables
The commercial source transfer package includes:
1. `backend/`: Complete Laravel 12 application with controllers, models, migrations, seeders, and PHPUnit test suite.
2. `frontend/`: Complete React 19 SPA source tree with 3D game scenes, player portal, 23-module admin panel, and white-label management.
3. `deployment/`: Production server configuration templates for Nginx, Apache, Systemd, and Supervisor.
4. `scripts/`: Operational shell and batch scripts for installation, backups, restorations, and deployments.
5. `documentation/`: Exhaustive 18-document engineering, database, and operational library.

---

## 3. White-Label & Reskin Architecture
The project provides a clean separation between **Core Game Systems** and **Commercial Branding**:

### Default State (Official AERVYN Identity)
When `white_label_enabled` is `false`, the platform strictly renders the official title *AERVYN: ECHOES OF TIME*, the original brand logo (`/assets/aervyn-logo.png`), and the default cyan/purple visual theme.

### White-Label Mode
When enabled via Admin Panel (`/admin/branding`), enterprise buyers can safely customize:
- Product title & marketing tagline
- Browser `<title>` and meta description
- Custom brand logo and favicon (safely validated image uploads)
- Publisher name, support email, website URL, and footer copyright text
- Primary, secondary, and accent color hex codes (injected into CSS root variables)

### Controlled Reskin Boundaries
The white-label architecture guarantees that branding changes **never alter**:
- Procedural 3D scene geometry, collision meshes, or physics
- Mission step validation or storyline logic
- Checkpoint persistence and save-state schemas
- User roles, permissions, or security boundaries

---

## 4. Setup, Deployment & Administrative Access

### Initial Administrator Access
- **Admin Login Route:** `/admin/login`
- **Default Account:** Created via database seeders or `php artisan db:seed`.
- **Credential Security:** Change the administrator password immediately via `/admin/change-password` upon initial login.

### Player Experience
- Players register at `/register` or sign in at `/login`.
- Campaign progression auto-saves after every milestone and checkpoint to MySQL.
- Sandboxed buyer evaluation mode at `/demo` allows zero-friction 3-minute trials without writing to production player databases.

---

## 5. Security & Verification Summary
- **Sanctum Token Guards:** All player and administrative endpoints require verified Bearer tokens.
- **Authorization Enforcement:** Non-admin users are strictly blocked (`403 Forbidden`) from administrative and branding endpoints at the server level.
- **Rate Limiting:** Public authentication and inquiry endpoints are throttled (`throttle:auth`).
- **File Upload Protection:** Strict MIME type and extension validation preventing executable or malicious file execution.
- **Test Integrity:** 59 automated PHPUnit tests (1,161 assertions) pass with 100% success rate.
