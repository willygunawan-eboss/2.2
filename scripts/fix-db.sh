#!/bin/bash
echo "Memperbaiki database yang corrupt (malformed)..."
rm -f data/erp.db data/erp.db-shm data/erp.db-wal
echo "Database lama telah dihapus."
echo "Menjalankan migrasi database baru via server startup (saat PM2 di-restart)..."
echo "Selesai! Silakan restart PM2 Anda dengan: pm2 restart ecosystem.config.cjs"
