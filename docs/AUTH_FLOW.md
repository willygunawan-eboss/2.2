# AUTHENTICATION FLOW
Aplikasi ERP menggunakan pola otentikasi berbasis token JWT stateless (disimpan di secure HttpOnly cookies).

1. **Login API** (`/api/auth/login`)
   - Memvalidasi username dan password melalui hashing bcrypt.
   - Mengeluarkan dua buah token: Access Token (`token`) dan Refresh Token (`refreshToken`).
   - Token disimpan ke dalam HttpOnly cookies dengan properti `secure`, mencegah celah XSS.

2. **Middleware** (`authMiddleware` di `server.ts`)
   - Mengecualikan endpoint publik seperti `/api/auth/login`, `/api/health`, `/api/bootstrap/status`, dan `/api/bootstrap`.
   - Mengekstrak cookie `token` dan `refreshToken`.
   - Jika `token` valid, req.user di-set dan next() dipanggil.
   - Jika `token` kedaluwarsa tapi `refreshToken` ada, aplikasi memvalidasi refresh token ke database dan membuat `token` baru, lalu req.user di-set.

3. **Logout** (`/api/auth/logout`)
   - Menghapus cookies dengan memanggil `res.clearCookie('token')` dan `res.clearCookie('refreshToken')`.
