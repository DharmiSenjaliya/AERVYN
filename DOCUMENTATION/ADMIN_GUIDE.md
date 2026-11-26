# AERVYN: ECHOES OF TIME
## STUDIO ADMINISTRATOR & GAME OPERATIONS MANUAL

**Audience:** Game Operations, Community Managers, QA Leads, Studio Executives  
**Access Route:** `/admin/login` -> `/admin/dashboard`  
**Required Role:** `admin`  

---

## 1. Authentication & Security

1. **Accessing the Administrative Portal:**
   - Navigate to `/admin/login`.
   - Enter verified studio administrator credentials.
   - The system validates credentials, issues an administrative Sanctum token, and verifies that `is_banned = 0` and `role = 'admin'`.
2. **Session Protection:**
   - Administrative sessions are protected by Sanctum guards.
   - Non-admin players attempting to call `/api/admin/*` are immediately blocked with `403 Forbidden`.
   - All administrative actions (user bans, report updates, maintenance toggles, media uploads) are recorded in `admin_activity_logs`.

---

## 2. Admin Panel Modules & Capabilities

### 1. Dashboard Overview (`/admin/dashboard`)
- **Key Metrics:**
  - Total registered players, new players today, weekly growth.
  - Active game sessions, total worlds completed, campaign completion rate.
  - Ending distribution: Real-time pie chart of Ending A (The Weaver) vs. Ending B (The Fracture).
- **World Breakdown:** Shows active player count and completed players per world.

### 2. Player Management (`/admin/players`)
- Search players by callsign or email.
- Review operative stats: Level, XP, current world, registration date, last login.
- **Actions:**
  - View detailed player dossier and save history.
  - Toggle Account Status (`Active` / `Suspended` / `Banned`).

### 3. Game Worlds & Levels (`/admin/worlds`)
- Edit world titles, epoch lore descriptions, and active status.
- Upload official cover art thumbnails directly to the media library.

### 4. Mission & Story Content (`/admin/missions`)
- Review step-by-step mission objectives across all 4 worlds.
- Update mission titles, step goals, and completion requirements.

### 5. Collectibles & Inventory Monitor (`/admin/collectibles`)
- Monitor distribution of key items (Fragments, Quantum Cores, Chrono Shards, Epoch Keystones).

### 6. Analytics & Telemetry (`/admin/analytics`)
- Deep telemetry insights:
  - Average playtime per world.
  - Device pixel ratio (DPR) hardware distribution.
  - Popularity metrics of dual endings.

### 7. Support & Feedback Triage (`/admin/feedback`)
- Review tickets submitted via the in-game feedback form.
- Filter by category (`bug`, `feedback`, `suggestion`) and status (`new`, `in_progress`, `resolved`).
- Record internal staff resolution notes.

### 8. Media & Asset Management (`/admin/assets`)
- Upload promotional banners, character avatars, and world thumbnails.
- Strict MIME type verification (`image/jpeg`, `image/png`, `image/webp`) with a 2MB cap.
- *Protected Asset:* `aervyn-logo.png` is permanently write-protected against administrative deletion.

### 9. Social Moderation & Conduct Queue (`/admin/social`)
- **Overview Metrics:** Total friendships, active challenges, open reports, suspended accounts.
- **Player Conduct Triage:**
  - Review reported players, reporting operative, category (`harassment`, `cheating`, `inappropriate_name`, `spam`), and narrative reason.
  - Actions: Mark report as `Reviewing`, `Resolved`, or `Rejected`.
  - Record internal investigative verdict notes.
- **Social Suspension Tool:**
  - Temporarily suspend a disruptive player's social permissions (disabling challenges and friend requests) without terminating their offline campaign save progress.
