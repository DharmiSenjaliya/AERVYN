# AERVYN: ECHOES OF TIME
## Private Buyer Demo Access & Link Management
**Document Version:** 1.0.0 Commercial Release  
**Admin Route:** `/admin/buyer-demo`  
**Public Validation Route:** `/api/buyer-demo/validate-token`  
**Classification:** Confidential Security Architecture Manual

---

## 1. Security Overview

To allow prospective enterprise buyers, publishers, and investors to evaluate the game with customized privileges without exposing production accounts or private player databases, AERVYN implements a **cryptographically secure private token system**.

### Key Security Guarantees:
1. **Zero Plaintext Storage:** Tokens are generated using high-entropy random bytes (`bin2hex(random_bytes(24))`) and stored solely as **SHA-256 hashes** (`token_hash`) in the `buyer_demo_access` database table.
2. **One-Time Plaintext Display:** The plaintext token is shown only once to the studio administrator upon generation.
3. **Automated Expiration:** Administrators can set token lifespans (1 to 365 days). Once `expires_at` is reached, validation returns `410 Gone`.
4. **Session Limiting:** Administrators can restrict the maximum number of accesses (default: 15). Once `access_count >= access_limit`, validation returns `429 Too Many Requests`.
5. **Instant Administrative Revocation:** Administrators can revoke a link at any time from `/admin/buyer-demo`, immediately invalidating future access (`403 Forbidden`).
6. **No Production Elevated Rights:** Private demo tokens provide elevated visual branding and priority CRM status in the demo room, but **never grant admin privileges or production player access**.

---

## 2. API Endpoints for Demo Access

### 1. Token Validation (Public)
- **Endpoint:** `POST /api/buyer-demo/validate-token`
- **Rate Limit:** 10 requests / minute (`throttle:auth`)
- **Request Body:**
  ```json
  {
    "token": "aervyn_demo_8f93e2b109c847d6e5a4b3c2d1e0f9a8"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "message": "Access token verified. Welcome to the AERVYN Interactive Product Showcase.",
    "data": {
      "access_id": 4,
      "buyer_name": "Apex Gaming Corp",
      "company": "Apex Interactive",
      "access_tier": "vip",
      "access_count": 1,
      "access_limit": 25,
      "expires_at": "2026-12-25T18:00:00Z"
    }
  }
  ```

### 2. Generate Private Link (Admin Only)
- **Endpoint:** `POST /api/admin/buyer-demo/links`
- **Requires:** `Authorization: Bearer <admin_token>`
- **Request Body:**
  ```json
  {
    "buyer_name": "Apex Gaming Corp",
    "company": "Apex Interactive",
    "email": "partnerships@apex.com",
    "access_tier": "vip",
    "access_limit": 25,
    "expires_in_days": 30,
    "internal_notes": "Tier 1 European publisher due diligence."
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "status": "success",
    "data": {
      "id": 4,
      "buyer_name": "Apex Gaming Corp",
      "plain_token": "aervyn_demo_...",
      "demo_url": "https://aervyn-game.com/buyer-demo?token=aervyn_demo_..."
    }
  }
  ```

### 3. Revoke Private Link (Admin Only)
- **Endpoint:** `POST /api/admin/buyer-demo/links/{id}/revoke`
- **Requires:** `Authorization: Bearer <admin_token>`
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "message": "Buyer demo link revoked successfully. Future access attempts will be blocked."
  }
  ```
