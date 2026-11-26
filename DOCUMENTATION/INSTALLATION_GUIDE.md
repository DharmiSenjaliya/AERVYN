# AERVYN: ECHOES OF TIME — Installation & Setup Guide

This guide provides end-to-end instructions for deploying **AERVYN: ECHOES OF TIME** in local development environments and production servers.

---

## 1. System Prerequisites
Before installing, ensure the host machine has the following dependencies:
- **PHP:** 8.2 or higher with extensions: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `curl`
- **Composer:** 2.6+
- **Node.js:** 20.x or 22.x LTS
- **npm:** 10.x+
- **MySQL:** 8.0+ or MariaDB 10.5+
- **Web Server:** Nginx or Apache (for production)

---

## 2. Backend Setup (Laravel 12)

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install PHP Dependencies
```bash
composer install --no-dev --optimize-autoloader
```
*(For development, run `composer install` without `--no-dev`)*

### Step 3: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure database credentials in `.env` match your MySQL setup:
```env
APP_NAME=AERVYN
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aervyn_db
DB_USERNAME=aervyn_user
DB_PASSWORD=your_secure_password

SANCTUM_STATEFUL_DOMAINS=your-domain.com
SESSION_DOMAIN=.your-domain.com
```

### Step 4: Generate Application Key
```bash
php artisan key:generate
```

### Step 5: Run Database Migrations & Seeders
```bash
php artisan migrate --seed --force
```
This initializes the 14 database tables, default admin account (`admin@aervyn.com` / `admin123456`), and default achievements.

### Step 6: Optimize Backend Configuration
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Step 7: Run Automated Verification Tests
```bash
php artisan test
```
All 54 tests should pass with 100% assertions green.

---

## 3. Frontend Setup (React 19 + Vite 8)

### Step 1: Navigate to Frontend Directory
```bash
cd ../frontend
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Configure Environment
Create `.env` or edit `.env.production`:
```env
VITE_API_BASE_URL=https://your-domain.com/api
```
*(For local development: `http://127.0.0.1:8000/api`)*

### Step 4: Build for Production
```bash
npm run build
```
This generates the optimized static assets in `frontend/dist/`.

---

## 4. Production Web Server Configuration (Nginx)

Example Nginx virtual host configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Frontend Single Page App
    root /var/www/aervyn/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Routing
    location /api {
        alias /var/www/aervyn/backend/public;
        try_files $uri $uri/ @backend;

        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
            fastcgi_param SCRIPT_FILENAME /var/www/aervyn/backend/public/index.php;
        }
    }

    location @backend {
        rewrite /api/(.*)$ /api/index.php?/$1 last;
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
}
```

---

## 5. Default Administrative Access
- **Admin Login Route:** `/admin/login`
- **Default Email:** `admin@aervyn.com`
- **Default Password:** `admin123456`
*(Please update password immediately upon deployment via Admin Panel > Change Password)*
