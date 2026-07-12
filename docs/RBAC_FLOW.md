# RBAC FLOW
Role-Based Access Control (RBAC) diatur secara terpusat dan memiliki caching di backend.

1. **Inisialisasi Cache**
   - Saat backend menyala (start), `initRBAC()` memuat seluruh relasi Users, Roles, Permissions, Menu Permissions, dan Data Scopes ke dalam memory cache (`rbacCache`).
   - Hal ini membuat pengecekan hak akses berjalan secepat O(1) tanpa membebani database SQLite.

2. **Middleware Enforcement** (`requirePermission` di `src/middleware/rbacMiddleware.ts`)
   - Setiap route spesifik yang butuh akses tertentu (misalnya POST `/api/hr/employees`) di-guard oleh fungsi ini.
   - Fungsi ini mengekstrak userId dari JWT dan mengecek `getUserPermissions(userId)` di cache.
   - Jika memiliki izin atau memiliki flag `MANAGE_MODULE`, akses diizinkan.

3. **Global Bypass untuk SUPER_ADMIN**
   - Di middleware maupun di route `/api/rbac/context`, role `SUPER_ADMIN` selalu dimodifikasi sedemikian rupa sehingga:
     `if (roles.includes('SUPER_ADMIN') || user.role === 'SUPER_ADMIN') return next();`
   - Ini memastikan Master User / CEO dapat melewati semua limitasi permission.

4. **Konteks Frontend**
   - Frontend memanggil `/api/rbac/context` untuk mendapatkan izin user saat ini.
   - Hook `useRBAC()` mengatur state lokal React dengan list izin.
   - Komponen UI seperti `<Sidebar />` atau elemen tombol akan mengecek `hasMenu(x)` atau `hasPermission(y)` dan menyembunyikan elemen jika tidak memenuhi hak akses.
