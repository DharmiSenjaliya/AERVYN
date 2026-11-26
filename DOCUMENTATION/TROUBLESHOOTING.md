# AERVYN: ECHOES OF TIME — Troubleshooting & Diagnostics Guide

This document provides resolutions for common setup, deployment, and operational issues.

---

## 1. Backend & API Issues

### Issue 1: "No application encryption key has been specified."
- **Cause:** The `APP_KEY` variable in `backend/.env` is empty.
- **Resolution:**
  ```bash
  cd backend
  php artisan key:generate
  ```

### Issue 2: "SQLSTATE[HY000] [2002] Connection refused" or "Access denied for user"
- **Cause:** Incorrect MySQL host, port, username, or password in `backend/.env`.
- **Resolution:**
  1. Ensure the MySQL server is active (`sudo systemctl status mysql` or via Windows Services).
  2. Verify credentials using standard MySQL CLI:
     ```bash
     mysql -h 127.0.0.1 -u aervyn_user -p aervyn_db
     ```
  3. Update `backend/.env` and clear config cache:
     ```bash
     php artisan config:clear
     ```

### Issue 3: Cross-Origin Request Blocked (CORS)
- **Cause:** The frontend URL is not whitelisted in `backend/config/cors.php` or `backend/.env`.
- **Resolution:**
  1. Set `CORS_ALLOWED_ORIGINS` in `backend/.env` to include your frontend origin:
     ```env
     CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-domain.com
     ```
  2. Clear route and config caches:
     ```bash
     php artisan optimize:clear
     ```

### Issue 4: "The stream or file '/var/www/aervyn/backend/storage/logs/laravel.log' could not be opened in append mode: failed to open stream: Permission denied"
- **Cause:** Web server process lacks write permissions to `storage/` or `bootstrap/cache/`.
- **Resolution (Linux):**
  ```bash
  sudo chown -R www-data:www-data /var/www/aervyn/backend/storage /var/www/aervyn/backend/bootstrap/cache /var/www/aervyn/backend/public/uploads
  sudo chmod -R 775 /var/www/aervyn/backend/storage /var/www/aervyn/backend/bootstrap/cache /var/www/aervyn/backend/public/uploads
  ```

---

## 2. Frontend & Build Issues

### Issue 5: Vite Build Fails with EPERM on Windows
- **Cause:** Antivirus, indexing service, or terminal sandbox locking temporary `.vite-temp` files.
- **Resolution:**
  1. Close any running dev servers (`npm run dev`).
  2. Remove temporary directories:
     ```bash
     rd /s /q node_modules\.vite
     ```
  3. Re-run build:
     ```bash
     npm run build
     ```

### Issue 6: 3D Canvas Renders Blank Black Screen
- **Cause:** WebGL 2.0 hardware acceleration is disabled in the client browser.
- **Resolution:**
  1. Navigate to `chrome://settings/system` (Chrome) or `about:config` (Firefox).
  2. Ensure "Use hardware acceleration when available" is enabled.
  3. Check WebGL status at `chrome://gpu` to confirm WebGL 2.0 hardware support.

---

## 3. Administrative & Authentication Issues

### Issue 7: Admin Login Redirects with "Forbidden. Administrator privileges required."
- **Cause:** User account does not have `role = 'admin'` or has `is_active = false`.
- **Resolution:**
  Grant administrative privileges via Tinker:
  ```bash
  php artisan tinker
  >>> $user = App\Models\User::where('email', 'your_email@domain.com')->first();
  >>> $user->role = 'admin';
  >>> $user->is_active = true;
  >>> $user->save();
  ```
