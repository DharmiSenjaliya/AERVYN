# AERVYN: ECHOES OF TIME — Production Deployment Guide
**Target Stack:** Laravel 12 + React 19 + Vite 8 + MySQL 8.0 + Nginx / Apache  
**Document Classification:** Production Operations Manual

---

## 1. Production Architecture Overview
```
                      +-----------------------------+
                      |     Client Web Browser      |
                      |  (Desktop / Laptop / Mobile)|
                      +--------------+--------------+
                                     |
                                     | HTTPS (Port 443)
                                     v
                      +-----------------------------+
                      |   Nginx Reverse Proxy / SSL |
                      |    (Let's Encrypt Certs)    |
                      +-------+-------------+-------+
                              |             |
        Static Assets & SPA   |             | /api/* Requests
        /dist & /uploads      |             |
                              v             v
                +-------------+----+   +----+-------------+
                | React Single-Page|   | PHP 8.2-FPM      |
                | Application      |   | Laravel 12 Engine|
                +------------------+   +----+-------------+
                                            |
                                            | PDO Connection
                                            v
                                       +----+-------------+
                                       | MySQL 8.0 Server |
                                       | (InnoDB Tables)  |
                                       +------------------+
```

---

## 2. Server Prerequisites
- **OS:** Ubuntu 22.04 LTS / Debian 12 / Rocky Linux 9
- **Web Server:** Nginx 1.24+ or Apache 2.4+
- **PHP:** PHP 8.2 or 8.3 with extensions: `php8.2-fpm`, `php8.2-mysql`, `php8.2-mbstring`, `php8.2-xml`, `php8.2-curl`, `php8.2-zip`, `php8.2-bcmath`
- **Database:** MySQL 8.0+ or MariaDB 10.6+
- **Node.js:** v20.x or v22.x LTS with npm
- **Process Manager:** Supervisor or Systemd

---

## 3. Step-by-Step Production Deployment Procedure

### Step 1: Clone Repository into Production Directory
```bash
sudo mkdir -p /var/www/aervyn
sudo chown -R $USER:$USER /var/www/aervyn
git clone <repository_url> /var/www/aervyn
cd /var/www/aervyn
```

### Step 2: Configure Production Backend Environment
```bash
cd /var/www/aervyn/backend
cp .env.example .env
```
Edit `.env` with strict production values:
```env
APP_NAME="AERVYN: ECHOES OF TIME"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-game-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aervyn_production_db
DB_USERNAME=aervyn_admin
DB_PASSWORD=YOUR_STRONG_DATABASE_PASSWORD_HERE

SANCTUM_STATEFUL_DOMAINS=your-game-domain.com
SESSION_DOMAIN=.your-game-domain.com

CORS_ALLOWED_ORIGINS=https://your-game-domain.com
```

### Step 3: Install PHP Dependencies & Optimize
```bash
composer install --no-dev --optimize-autoloader --no-interaction
php artisan key:generate --force
php artisan migrate --force
php artisan db:seed --force

# Compile production caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Step 4: Configure Storage & Upload Permissions
```bash
sudo chown -R www-data:www-data /var/www/aervyn/backend/storage /var/www/aervyn/backend/bootstrap/cache /var/www/aervyn/backend/public/uploads
sudo chmod -R 775 /var/www/aervyn/backend/storage /var/www/aervyn/backend/bootstrap/cache /var/www/aervyn/backend/public/uploads
```

### Step 5: Configure and Compile Frontend
```bash
cd /var/www/aervyn/frontend
cp .env.example .env.production
```
Edit `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://your-game-domain.com/api
```
Compile static assets:
```bash
npm ci
npm run build
```
Production assets are generated in `/var/www/aervyn/frontend/dist`.

### Step 6: Configure Web Server (Nginx)
Copy the provided Nginx configuration template:
```bash
sudo cp /var/www/aervyn/deployment/nginx/aervyn.conf /etc/nginx/sites-available/aervyn.conf
sudo ln -s /etc/nginx/sites-available/aervyn.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 7: Obtain SSL Certificate via Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-game-domain.com
```

---

## 4. Production Security Hardening Checklist
- [x] `APP_ENV=production` and `APP_DEBUG=false` confirmed.
- [x] No sensitive stack traces exposed in API error responses.
- [x] Rate limiting active on auth (`throttle:auth`) and API (`throttle:api`).
- [x] Administrative endpoints protected by `admin` role middleware.
- [x] Secure HTTPS enforced with HTTP Strict Transport Security (HSTS).
- [x] Upload directory strictly forbids script execution (`.php`, `.sh`).
