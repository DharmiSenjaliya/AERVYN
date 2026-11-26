# AERVYN: ECHOES OF TIME — Maintenance & Operations Guide
**Version:** 1.0.0 Commercial Release

This guide outlines routine system maintenance, log monitoring, cache management, dependency updates, and disaster recovery procedures.

---

## 1. Routine Maintenance Tasks

### Daily Tasks
- **Error Log Monitoring:** Inspect `backend/storage/logs/laravel.log` for unhandled exceptions or abnormal spikes in HTTP 4xx/5xx responses.
- **Session & Queue Monitoring:** If using database queues or sessions, ensure worker processes are processing jobs without memory leaks.

### Weekly Tasks
- **Database Backups:** Execute automated database dump via `scripts/backup-db.sh` or a cron task. Retain daily backups for 14 days and weekly snapshots for 60 days.
- **Disk Usage Audit:** Verify storage capacity on server partitions, specifically `backend/storage/logs/` and `backend/public/uploads/`.

### Monthly Tasks
- **Security Updates:** Review security advisories for PHP, Node.js, and web server software.
- **Log Archival:** Compress and archive older application logs.

---

## 2. Dependency Update Protocol
> [!IMPORTANT]
> Never run unconditional `composer update` or `npm update` directly on a live production server. Always test updates in a dedicated staging environment first.

### Backend Updates (Composer)
```bash
# 1. Check for security advisories
composer audit

# 2. Update specific patch releases in staging
composer update laravel/framework --with-dependencies

# 3. Run the automated test suite to confirm zero regressions
php artisan test
```

### Frontend Updates (npm)
```bash
# 1. Audit npm dependencies
npm audit

# 2. Test production compilation
npm run build
```

---

## 3. Cache & Optimization Management
After applying code changes or environment updates, refresh the Laravel optimization caches:

```bash
# Clear all caches
php artisan optimize:clear

# Rebuild production caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 4. Disaster Recovery & Safe Rollback Procedure

In the event of an unexpected release defect or database corruption:

### Step 1: Activate Maintenance Mode
```bash
php artisan down --secret="buyer-emergency-access-token"
```

### Step 2: Rollback to Previous Version
- Revert the codebase using Git or your deployment snapshot:
  ```bash
  git checkout <previous_stable_tag>
  ```

### Step 3: Database Restoration (If Schema Altered)
- If migrations altered existing table structures, restore the pre-deployment database dump:
  ```bash
  bash scripts/restore-db.sh
  ```

### Step 4: Recompile and Clear Caches
```bash
cd backend && php artisan optimize:clear && php artisan config:cache
cd ../frontend && npm run build
```

### Step 5: Resume Application
```bash
php artisan up
```
