# STARTUP FLOW
Flow startup aplikasi ICHANGEBOSS ERP adalah sebagai berikut:

1. **Browser Dibuka**
   - Aplikasi memuat `main.tsx` yang me-render `<App />`.
   - `<App />` di-wrap oleh `<GlobalErrorBoundary>` dan `<RBACProvider>`.

2. **Cek Bootstrap Status**
   - Di dalam `<MainApp />`, `useEffect` pertama kali melakukan HTTP GET ke `/api/bootstrap/status`.
   - Jika response = `bootstrapRequired`, aplikasi merender `<BootstrapWizard />`.
   - Jika response = `bootstrapCompleted`, lanjut ke proses otentikasi.

3. **Halaman Login (Otentikasi)**
   - Jika `bootstrapCompleted`, aplikasi mengecek `/api/auth/me`.
   - Jika user belum login, merender `<LoginView />`.
   - User memasukkan kredensial dan melakukan POST `/api/auth/login`.
   - Token JWT dan Refresh Token diset melalui secure HttpOnly cookies.

4. **Load Current User & Role**
   - Setelah login, `<MainApp />` kembali mengambil data profil dan peran pengguna.
   - Status otentikasi menjadi sukses.

5. **Load Permission**
   - `<RBACProvider>` menjalankan fungsi `fetchRBAC()` untuk mengambil data izin pengguna melalui `/api/rbac/context`.
   - Context ini berisi array `roles`, `permissions`, `menus`, dan `modules`.
   - Jika `user.role === 'SUPER_ADMIN'`, role ini mendapat *global bypass*.

6. **Dashboard**
   - Setelah RBAC termuat dan status siap, aplikasi merender `<Sidebar />`, `<Header />`, dan modul default yaitu `<DashboardView />`.
