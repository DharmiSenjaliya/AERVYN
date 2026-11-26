# AERVYN: ECHOES OF TIME — Installation & Setup Guide (Windows & Linux)
**Version:** 1.0.0 Commercial Release

This guide provides end-to-end instructions for deploying and running **AERVYN: ECHOES OF TIME** from scratch on Windows development machines and production environments.

---

## 1. System Prerequisites (Windows & Linux)

Ensure your host machine has the following software installed:
- **PHP:** 8.2 or 8.3 with extensions: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `curl`, `fileinfo`
- **Composer:** 2.6+
- **Node.js:** 20.x or 22.x LTS
- **npm:** 10.x+
- **MySQL:** 8.0+ or MariaDB 10.5+
- **Git:** 2.40+

---

## 2. Complete Windows Zero-to-Running Installation

### Step 1: Open PowerShell or Command Prompt
Navigate to the root directory where you cloned or unpacked AERVYN:
```powershell
cd E:\AERVYN
```

### Step 2: Create MySQL Database
Open your MySQL console or MySQL Workbench:
```sql
CREATE DATABASE aervyn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 3: Configure Backend Environment
```powershell
cd E:\AERVYN\backend
copy .env.example .env
```
Open `backend\.env` in your text editor and ensure your database credentials match:
```env
APP_NAME="AERVYN: ECHOES OF TIME"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aervyn_db
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Step 4: Install Backend Dependencies & Migrate
```powershell
# Install Composer packages
composer install

# Generate application encryption key
php artisan key:generate

# Execute database migrations
php artisan migrate --force

# Seed master content, achievements, and admin account
php artisan db:seed --class=AdminGameContentSeeder
php artisan db:seed --class=AchievementSeeder
```

### Step 5: Configure Frontend Environment
In a new terminal window:
```powershell
cd E:\AERVYN\frontend
copy .env.example .env
```
Ensure `VITE_API_BASE_URL` in `frontend\.env` is set to:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### Step 6: Install Frontend Dependencies
```powershell
npm install
```

### Step 7: Launch Local Development Servers
- **Start Backend API (Terminal 1):**
  ```powershell
  cd E:\AERVYN\backend
  php artisan serve --port=8000
  ```
  *Backend server runs at `http://127.0.0.1:8000`.*

- **Start Frontend Vite Server (Terminal 2):**
  ```powershell
  cd E:\AERVYN\frontend
  npm run dev
  ```
  *Frontend application opens at `http://localhost:5173`.*

---

## 3. Automated One-Click Windows Setup
Alternatively, you can run the automated batch script located in `scripts/`:
```cmd
scripts\install-windows.bat
```
This batch script automatically sets up `.env`, installs composer dependencies, generates the application key, runs database migrations, installs npm packages, and provides startup instructions.

---

## 4. Default Accounts & Initial Access

### Administrator Access
- **URL:** `http://localhost:5173/admin/login`
- **Default Email:** `admin@aervyn.local`
- **Default Password:** `admin12345`
*(Please rotate credentials immediately via `/admin/change-password`)*

### Player Account
- **URL:** `http://localhost:5173/login`
- **Default Test Operative:** `player@aervyn.local`
- **Default Password:** `password123`
*(New players can register instantly at `http://localhost:5173/register`)*

### Frictionless Buyer Evaluation Mode
- **URL:** `http://localhost:5173/demo`
- Operates sandboxed without requiring login. Does not touch production player saves or leaderboards.

---

## 5. Production Build Verification
To test frontend compilation for production:
```powershell
cd E:\AERVYN\frontend
npm run build
```
Verify that `dist/index.html` and bundled assets are generated with **0 errors**.
