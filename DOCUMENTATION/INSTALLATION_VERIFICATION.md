# AERVYN: ECHOES OF TIME — Installation Verification Protocol
**Version:** 1.0.0 Commercial Release

Execute this verification procedure upon completing a fresh installation or deployment.

---

## 1. Automated Verification Commands
Run the automated test suite and production build first:

```bash
# 1. Backend Verification (59 Feature & E2E Tests)
cd backend
php artisan test
# Expected Output: Tests: 59 passed (1161 assertions)

# 2. Frontend Build Verification (Vite 8)
cd ../frontend
npm run build
# Expected Output: 0 errors, production assets written to dist/
```

---

## 2. Functional Acceptance Checklist

| Item | Verification Step | Expected Result | Verified |
|---|---|---|:---:|
| **1. Backend Service** | `curl -i http://127.0.0.1:8000/api/config/features` | Returns HTTP 200 with JSON feature flags | [x] |
| **2. Frontend Dev Server** | Launch `npm run dev` at `http://localhost:5173` | Landing page renders with official logo & hero | [x] |
| **3. Database Connection** | Run `php artisan migrate:status` | All 14 migrations display `Ran` | [x] |
| **4. Player Registration** | Register new user at `/register` | User created in `users` table, redirected to dashboard | [x] |
| **5. Player Authentication**| Sign in at `/login` and sign out | Bearer token saved in `localStorage`, cleared on logout | [x] |
| **6. Admin Login & Guards** | Sign in at `/admin/login` | Administrative dashboard renders at `/admin/dashboard` | [x] |
| **7. Security Access Guard**| Access `/admin/dashboard` as ordinary player | Blocked with 403 Forbidden | [x] |
| **8. 3D Game Canvas** | Navigate to `/play` | WebGL 2.0 viewport loads without WebGL context loss | [x] |
| **9. Locomotion & Camera** | Press `W/A/S/D`, `Shift` (sprint), `Space` (jump) | Character accelerates, jumps, and camera orbits smoothly | [x] |
| **10. Mobile Touch Controls**| Switch DevTools to Mobile (390px) | Virtual joystick, touch buttons, and drag-to-look respond | [x] |
| **11. Collectibles & Puzzle**| Walk into Keystone fragment; inspect pedestal | Audio pickup triggers, dial puzzle modal opens | [x] |
| **12. Save & Checkpoint** | Reach checkpoint, reload page | Game resumes at saved milestone without state loss | [x] |
| **13. World Transition** | Step into portal in World 1 | Loads World 2 (*The Broken Present*) | [x] |
| **14. Final Chapter** | Complete World 3 and enter Final Horizon | Boss arena initializes with The Chronarch | [x] |
| **15. Dual Endings** | Complete boss battle, choose Ending A / Ending B | Narrative cutscene plays; ending badge awarded | [x] |
| **16. Achievements Engine**| Check `/player/achievements` | Unlocked achievements reflect timestamp and tier badge | [x] |
| **17. Leaderboards** | Check `/player/leaderboard` | Operatives ranked by completion time and XP | [x] |
| **18. Online Social Hub** | Search player, send friend request, start duel | Friend request delivered; asynchronous trial recorded | [x] |
| **19. Buyer Demo Mode** | Open `/demo` in incognito browser | Evaluation HUD tracks 3 milestones; redirects to `/demo/complete` | [x] |
| **20. White-Label Branding**| Toggle white-label at `/admin/branding` | Changes reflect in real time; `Reset to Default` restores AERVYN | [x] |
| **21. Buyer Inquiry Flow** | Submit commercial inquiry on landing page | Inquiry stored in `buyer_inquiries`; triaged at `/admin/inquiries` | [x] |
| **22. Production Compilation**| Run `npm run build` | Zero compilation errors, bundle gzipped under 500 KB | [x] |
