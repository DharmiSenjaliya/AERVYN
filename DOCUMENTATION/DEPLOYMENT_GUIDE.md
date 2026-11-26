# AERVYN: ECHOES OF TIME
## PRODUCTION DEPLOYMENT & DEVOPS GUIDE

**Target Environment:** Linux (Ubuntu 22.04 LTS / Debian 12 / Rocky Linux 9)  
**Web Server:** Nginx 1.22+ with HTTP/2 and SSL/TLS  
**Runtime:** PHP 8.2+ FPM / Node.js 18+ LTS  
**Database:** MySQL 8.0+ / MariaDB 10.5+  

---

## 1. System Requirements

### Hardware Requirements (Server)
- **Minimum:** 2 vCPU, 4GB RAM, 20GB NVMe SSD
- **Recommended:** 4 vCPU, 8GB RAM, 50GB NVMe SSD

### Client Hardware Requirements
- **Desktop:** Any modern browser supporting WebGL 2.0 (Google Chrome 110+, Microsoft Edge 110+, Firefox 115+, Safari 16+). Discrete or integrated GPU with 1GB+ VRAM.
- **Mobile:** iOS 15+ (Safari / Chrome), Android 10+ (Chrome / Brave).

---

## 2. Server Environment Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Nginx, Git, Curl, Unzip
sudo apt install -y nginx git curl unzip software-properties-common

# Install PHP 8.2 and required extensions
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-xml php8.2-mbstring \
    php8.2-curl php8.2-zip php8.2-bcmath php8.2-intl php8.2-gd

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## 3. Backend Deployment (Laravel 12)

```bash
# Clone repository
cd /var/www
git clone <repository_url> aervyn
cd /var/www/aervyn/backend

# Install PHP dependencies without dev packages
composer install --no-dev --optimize-autoloader

# Configure environment
cp .env.example .env
nano .env
```

### Production `.env` Guidelines
```ini
APP_NAME="AERVYN: ECHOES OF TIME"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_32_BYTE_KEY=
APP_DEBUG=false
APP_URL=https://api.aervyn.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aervyn_prod
DB_USERNAME=aervyn_db_user
DB_PASSWORD=YOUR_SECURE_PASSWORD

SANCTUM_STATEFUL_DOMAINS=play.aervyn.com,aervyn.com
SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
```

```bash
# Run database migrations
php artisan migrate --force

# Seed master worlds, missions, and achievements (do NOT run migrate:fresh in production)
php artisan db:seed --class=AchievementSeeder --force

# Optimize Laravel cache
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
sudo chown -R www-data:www-data /var/www/aervyn/backend/storage /var/www/aervyn/backend/bootstrap/cache
sudo chmod -R 775 /var/www/aervyn/backend/storage /var/www/aervyn/backend/bootstrap/cache
```

---

## 4. Frontend Deployment (React 19 + Vite)

```bash
cd /var/www/aervyn/frontend

# Configure environment
cp .env.example .env
```

Set production API endpoint in `frontend/.env`:
```ini
VITE_API_BASE_URL=https://api.aervyn.com/api
VITE_APP_NAME="AERVYN: ECHOES OF TIME"
VITE_APP_VERSION="1.0.0"
```

```bash
# Install dependencies & compile production bundle
npm install
npm run build

# Output will be located in /var/www/aervyn/frontend/dist
```

---

## 5. Nginx Production Configuration

Create `/etc/nginx/sites-available/aervyn.conf`:

```nginx
# 1. Frontend Web App (Client Canvas, Dashboards, Social Hub)
server {
    listen 80;
    server_name play.aervyn.com;
    root /var/www/aervyn/frontend/dist;
    index index.html;

    # Gzip compression for 3D shaders and JS bundles
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml+rss text/javascript image/svg+xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}

# 2. Backend API Mainframe (Laravel Sanctum)
server {
    listen 80;
    server_name api.aervyn.com;
    root /var/www/aervyn/backend/public;
    index index.php;

    client_max_body_size 10M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
# Enable site and reload Nginx
sudo ln -s /etc/nginx/sites-available/aervyn.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install SSL Certificates via Let's Encrypt Certbot
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d play.aervyn.com -d api.aervyn.com
```

---

## 6. Backup & Maintenance Procedures

- **Nightly Database Backup:**
  ```bash
  mysqldump -u aervyn_db_user -p aervyn_prod | gzip > /backups/aervyn_$(date +%F).sql.gz
  ```
- **Zero-Downtime Cache Clearing:**
  ```bash
  php artisan optimize:clear && php artisan optimize
  ```
