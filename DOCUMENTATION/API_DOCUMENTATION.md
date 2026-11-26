# AERVYN: ECHOES OF TIME
## REST API SPECIFICATION & INTEGRATION GUIDE

**Version:** 1.0.0 Commercial Release  
**Base URL:** `http://127.0.0.1:8000/api` (Production: `https://api.aervyn.com/api`)  
**Authentication Scheme:** Bearer Token via Laravel Sanctum (`Authorization: Bearer <token>`)  
**Content-Type:** `application/json`  

---

## 1. Authentication Endpoints

### Register Player
- **POST** `/auth/register`
- **Rate Limit:** 10 req/min
- **Request Body:**
  ```json
  {
    "name": "ExplorerAlpha",
    "email": "explorer@aervyn.local",
    "password": "Password#2026",
    "password_confirmation": "Password#2026"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "status": "success",
    "message": "Player account registered successfully.",
    "token": "1|sanctum_token_string...",
    "user": {
      "id": 12,
      "name": "ExplorerAlpha",
      "email": "explorer@aervyn.local",
      "role": "player",
      "level": 1,
      "xp": 0
    }
  }
  ```

### Login Player / Admin
- **POST** `/auth/login`
- **Rate Limit:** 10 req/min
- **Request Body:**
  ```json
  {
    "email": "explorer@aervyn.local",
    "password": "Password#2026"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "token": "2|sanctum_token_string...",
    "user": { "id": 12, "name": "ExplorerAlpha", "role": "player" }
  }
  ```

### Logout
- **POST** `/auth/logout`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  { "status": "success", "message": "Successfully logged out." }
  ```

---

## 2. Game Engine & State Endpoints

### Get Active World State
- **GET** `/game/state?world={world_id}`
- **Headers:** `Authorization: Bearer <token>`
- **Parameters:** `world` (string: `world_1`, `world_2`, `world_3`, `world_final`)
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "progress": {
      "world_id": "world_1",
      "current_mission": "Awakening the Keystone",
      "current_step": 1,
      "completed_objectives": [],
      "inventory": [],
      "checkpoint_id": "start_courtyard",
      "checkpoint_position": { "x": 0, "y": 1, "z": 6 },
      "is_completed": false,
      "playtime_seconds": 0
    },
    "session_id": 45,
    "user": { "name": "ExplorerAlpha", "level": 1, "xp": 0 }
  }
  ```

### Save Progress & Checkpoints
- **POST** `/game/save`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "world_id": "world_1",
    "current_step": 5,
    "completed_objectives": ["collect_fragment_1", "collect_fragment_2"],
    "inventory": [{ "id": "fragment_1", "name": "Solar Fragment" }],
    "checkpoint_id": "pedestal_dais",
    "checkpoint_position": { "x": 0, "y": 1, "z": 0 },
    "playtime_increment": 30
  }
  ```
- **Response (200 OK):** Returns updated progress and any newly unlocked achievements.

### Complete World
- **POST** `/game/complete-world`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "world_id": "world_1",
    "ending_selected": null
  }
  ```
- **Server Rule:** Validates that `current_step` meets required milestone (e.g. step $\ge 9$ for World 1). Returns 422 if invalid.
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "message": "World 1: The Lost Kingdom restored! Timeline portal stabilized.",
    "xp_awarded": 500,
    "new_level": 2,
    "total_xp": 500,
    "progress": { "is_completed": true }
  }
  ```

### Campaign Aggregate Summary
- **GET** `/game/campaign-summary`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "summary": {
      "worlds_completed": ["world_1", "world_2", "world_3", "world_final"],
      "total_worlds": 4,
      "total_playtime_seconds": 12450,
      "ending_selected": "ending_a",
      "campaign_completed": true,
      "completion_percentage": 100,
      "story_journal_count": 8
    }
  }
  ```

---

## 3. Player Platform Endpoints

| Method | Path | Description | Access |
|---|---|---|---|
| `GET` | `/player/dashboard` | Aggregated dashboard telemetry (stats, achievements, world cards) | Authenticated |
| `GET` | `/player/profile` | Detailed profile with rank title, XP, and playtime | Authenticated |
| `PUT` | `/player/profile` | Update display name, avatar, bio (mass-assignment protected) | Authenticated |
| `POST` | `/player/change-password` | Update account password with current verification | Authenticated |
| `GET` | `/player/statistics` | Gameplay metrics breakdown (puzzles, collectibles, bosses) | Authenticated |
| `GET` | `/player/achievements` | Unlocked and locked achievements list | Authenticated |
| `POST` | `/player/achievements/check` | Trigger server sync of achievement evaluation | Authenticated |
| `GET` | `/player/leaderboard` | Global player rankings with `xp`, `campaign`, `achievements` filters | Authenticated |

---

## 4. Online Social Hub Endpoints

| Method | Path | Description | Access |
|---|---|---|---|
| `GET` | `/social/hub` | Summary of social stats, incoming alerts, and community activity feed | Authenticated |
| `GET` | `/social/search` | Case-insensitive player search by username/display name | Authenticated |
| `GET` | `/social/profile/{id}` | View public dossier of another operative (respects privacy settings) | Authenticated |
| `GET` | `/social/friends` | Roster of confirmed mutual friends | Authenticated |
| `GET` | `/social/requests` | List of received and sent pending friend requests | Authenticated |
| `POST` | `/social/requests` | Dispatch friend request to target operative | Authenticated |
| `POST` | `/social/requests/{id}/accept` | Accept pending friend request | Authenticated |
| `POST` | `/social/requests/{id}/reject` | Decline pending friend request | Authenticated |
| `POST` | `/social/requests/{id}/cancel` | Cancel outgoing friend request | Authenticated |
| `DELETE` | `/social/friends/{friendId}` | Remove confirmed friend (bi-directional cleanup) | Authenticated |
| `GET` | `/social/blocks` | List blacklisted operatives | Authenticated |
| `POST` | `/social/blocks` | Block operative (severs friendships and purges pending requests) | Authenticated |
| `DELETE` | `/social/blocks/{userId}` | Unblock operative | Authenticated |
| `GET` | `/social/challenges/templates` | Available challenge trial templates and parameters | Authenticated |
| `GET` | `/social/challenges` | Challenges matrix (Active, Received, Sent, Completed) | Authenticated |
| `POST` | `/social/challenges` | Create asynchronous challenge for a friend | Authenticated |
| `POST` | `/social/challenges/{id}/accept` | Accept challenge invitation | Authenticated |
| `POST` | `/social/challenges/{id}/reject` | Decline challenge invitation | Authenticated |
| `POST` | `/social/challenges/{id}/cancel` | Cancel challenge before start | Authenticated |
| `POST` | `/social/challenges/{id}/submit` | Submit run telemetry (server verifies score, awards XP) | Authenticated |
| `GET` | `/social/notifications` | Social transponder alerts with unread counter | Authenticated |
| `POST` | `/social/notifications/{id}/read` | Mark individual notification as read | Authenticated |
| `POST` | `/social/notifications/read-all` | Mark all notifications as read | Authenticated |
| `GET` | `/social/privacy` | Read 6 operative privacy broadcast toggles | Authenticated |
| `PUT` | `/social/privacy` | Update privacy broadcast toggles | Authenticated |
| `POST` | `/social/reports` | Submit conduct or glitch abuse report against operative | Authenticated |
| `GET` | `/social/leaderboard` | Social rankings with dedicated `friends_only` filter | Authenticated |

---

## 5. Administrative Moderation Endpoints

All endpoints require `Authorization: Bearer <admin_token>` and pass through `admin` middleware:

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/dashboard-stats` | Real-time studio KPIs: players, sessions, completion rates, endings |
| `GET` | `/admin/players` | Paginated player list with search and ban/suspension status |
| `POST` | `/admin/players/{id}/status` | Ban, suspend, or reactivate player account |
| `GET` | `/admin/worlds` | Worlds catalog with player completion distribution |
| `PUT` | `/admin/worlds/{id}` | Edit world title, epoch, description, or active status |
| `POST` | `/admin/worlds/{id}/thumbnail` | Upload official world cover thumbnail |
| `GET` | `/admin/analytics` | Analytics telemetry: playtime, hardware DPR, ending breakdown |
| `GET` | `/admin/feedback` | Player bug reports, feedback tickets, and inquiry logs |
| `PUT` | `/admin/feedback/{id}` | Triage feedback ticket status and record internal staff notes |
| `GET` | `/admin/media` | Media asset library (images, thumbnails, brand graphics) |
| `POST` | `/admin/media/upload` | Upload verified image asset (`jpeg`, `png`, `webp`) |
| `DELETE` | `/admin/media/{filename}` | Delete media asset (protects `aervyn-logo.png` against deletion) |
| `GET` | `/admin/social/overview` | Social moderation metrics (friendships, reports, suspensions) |
| `GET` | `/admin/social/reports` | Player conduct report triage queue |
| `PUT` | `/admin/social/reports/{id}` | Update report status (`reviewing`, `resolved`, `rejected`) and add notes |
| `GET` | `/admin/social/challenges` | Challenge monitor across all players |
| `POST` | `/admin/social/users/{id}/suspend` | Toggle social suspension without banning campaign access |

---

## 6. Commercial & Buyer Inquiry Endpoints

### Public Submission
| Method | Path | Description | Access | Rate Limit |
|---|---|---|---|---|
| `POST` | `/inquiries` | Submit prospective buyer inquiry (name, email, company, country, type, message) | Public | 5 req/min (`throttle:auth`) |

#### Request Payload:
```json
{
  "name": "Jane Doe",
  "email": "jane@acme.com",
  "company": "Acme Interactive",
  "country": "United States",
  "inquiry_type": "game_purchase",
  "message": "Interested in full commercial source code buyout for Q1 2027 launch."
}
```

### Administrative Inquiries Triage
All endpoints require `Authorization: Bearer <admin_token>` and pass through `admin` middleware:

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/inquiries` | List all inquiries with KPI counts (total, new, contacted, qualified, closed) |
| `PUT` | `/admin/inquiries/{id}` | Update inquiry pipeline status and append internal negotiation notes |

#### Triage Payload:
```json
{
  "status": "contacted",
  "admin_notes": "Initial response email sent. Intro meeting scheduled for Tuesday."
}
```
