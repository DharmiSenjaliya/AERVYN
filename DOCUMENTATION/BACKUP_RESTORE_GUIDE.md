# AERVYN: ECHOES OF TIME — Backup & Disaster Recovery Guide

This guide details backup procedures, disaster recovery protocols, and verification steps for **AERVYN: ECHOES OF TIME**.

---

## 1. What to Back Up & What to Exclude

### Critical Data to Back Up
| Component | Location | Description |
|---|---|---|
| **MySQL Database** | MySQL Server / `aervyn_db` | Player accounts, saved game states, missions, achievements, inquiry leads, branding settings |
| **Media Uploads** | `backend/public/uploads/` | Uploaded buyer logos, favicons, promotional thumbnails |
| **Environment Configuration** | `backend/.env` | Production encryption keys, database credentials, CORS domains |

### Ephemeral Data to Exclude
- `backend/vendor/` (reinstallable via `composer install`)
- `frontend/node_modules/` (reinstallable via `npm ci`)
- `backend/storage/framework/cache/` (temporary session and cache files)
- `backend/storage/logs/` (log data should be archived separately)

---

## 2. Backup Procedures

### Automated Script (Linux)
A pre-configured backup script is provided in `scripts/backup-db.sh`. It outputs compressed timestamped `.sql.gz` dumps to `database/backups/`:
```bash
bash scripts/backup-db.sh
```

### Manual Command Line Backup
```bash
mysqldump -h 127.0.0.1 -u aervyn_user -p --single-transaction --quick --routines --triggers aervyn_db | gzip > /var/backups/aervyn/aervyn_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Media Assets Backup
```bash
tar -czvf /var/backups/aervyn/uploads_$(date +%Y%m%d).tar.gz -C /var/www/aervyn/backend/public uploads
```

### Backup Frequency Recommendations
- **Database Backups:** Daily automated dump at 02:00 UTC. Retain 14 daily backups and 8 weekly archives.
- **Media Backups:** Weekly or triggered on administrative upload.

---

## 3. Database Restoration Procedure

> [!WARNING]
> Database restoration will overwrite existing tables in the target database. Always take an emergency snapshot before proceeding.

### Restoration Using Automated Script (Linux)
```bash
bash scripts/restore-db.sh
```
The script validates the file exists and prompts for explicit confirmation (`RESTORE`) before executing.

### Manual Command Line Restoration
```bash
# For uncompressed .sql dump:
mysql -h 127.0.0.1 -u aervyn_user -p aervyn_db < backup.sql

# For compressed .sql.gz dump:
gunzip -c backup.sql.gz | mysql -h 127.0.0.1 -u aervyn_user -p aervyn_db
```

### Media Restoration
```bash
tar -xzvf uploads_backup.tar.gz -C /var/www/aervyn/backend/public/
```

---

## 4. Post-Restoration Verification Checklist
Immediately after restoring a backup:
- [ ] Run `php artisan test` in `backend/` to verify database schema integrity.
- [ ] Log in as administrator at `/admin/login`.
- [ ] Verify player save state resumes accurately at `/player/dashboard`.
- [ ] Confirm active branding reflects the intended configuration at `/admin/branding`.
