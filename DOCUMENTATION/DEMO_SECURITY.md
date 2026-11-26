# AERVYN: ECHOES OF TIME
## Demo Security & Isolation Architecture
**Document Version:** 1.0.0 Commercial Release  
**Classification:** Confidential Security Architecture Manual

---

## 1. Threat Model & Safeguards

The Buyer Demo Room (`/buyer-demo`) is publicly accessible to maximize commercial exposure, yet engineered with zero compromises to production database integrity.

| Potential Threat | Engineering Safeguard Implemented | Verification Test |
| :--- | :--- | :--- |
| **Tampering with Production Saves** | All demo progress is maintained strictly in memory (`sessionStorage` & React component state). Demo endpoints never write to `player_progress`. | `BuyerDemoPage.jsx` does not call `/game/save` |
| **Admin Privilege Escalation** | Admin routes (`/api/admin/*`) require valid Sanctum token with `role = 'admin'`. Public demo visitors and private token holders receive `403 Forbidden`. | `BuyerDemoAccessTest::test_ordinary_player_cannot_manage_buyer_demo_links` |
| **Token Brute-Force Attacks** | Token validation endpoint is rate-limited (`throttle:auth`, 10 req/min). Tokens are 48-character cryptographic hex strings (2^192 entropy). | `BuyerDemoController::validateToken` |
| **Leakage of Player PII** | Showcase data is completely synthetic and isolated in `BuyerDemoController::getShowcaseSampleData()`. Real user emails, callsigns, and IPs are never queried. | `BuyerDemoAccessTest::test_public_visitor_can_get_showcase_sample_data` |
| **Token Exposure in Database Dumps** | Database table `buyer_demo_access` stores only SHA-256 hashes (`token_hash`). Stealing database backups does not reveal usable tokens. | `BuyerDemoAccess::token_hash` schema |
| **Denial of Service via Link Sharing** | Private links enforce a strict `access_limit` and expiration date. Leaked links stop working once the limit is reached. | `BuyerDemoAccessTest::test_exhausted_access_limit_is_rejected` |

---

## 2. In-Memory Demo Isolation Guarantees

1. **Campaign Progress Isolation:** A visitor evaluating the 3D game slice at `/demo` explores an in-memory replica of World 1. Completing the puzzle and stepping through the portal writes to `commercial_demo_telemetry` and `buyer_demo_sessions`, strictly bypassing `player_progress`.
2. **Branding Customization Isolation:** The customization simulator (`CustomizationDemo.jsx`) manipulates React component state and temporary CSS variables. It does NOT call `/api/admin/branding` and does NOT change official database settings.
3. **Database Safeguards:** No demo action can trigger database migrations, table drops, or user deletions.
