# BOOTSTRAP FLOW
Proses Bootstrap adalah setup master data minimal pertama yang dibutuhkan sistem.

1. **Endpoint Status** (`GET /api/bootstrap/status`)
   - Bersifat *Public*, tidak melewati auth middleware.
   - Mengecek apakah setidaknya sudah ada satu *Company* di database.
   - Jika tidak, merespons `{ status: 'bootstrapRequired' }`.
   - Jika iya, merespons `{ status: 'bootstrapCompleted' }`.

2. **UI Wizard** (`<BootstrapWizard />`)
   - Ditampilkan jika status = `bootstrapRequired`.
   - Tidak memerlukan login.
   - Meminta parameter: `companyName` dan `adminPassword`.

3. **Endpoint Executor** (`POST /api/bootstrap`)
   - Memasukkan data awal ke tabel: `companies`, `branches` (HQ), dan `departments` (MGT).
   - Memperbarui password `admin` user berdasarkan `adminPassword` jika diberikan.
   - Mengembalikan `{ status: 'bootstrapCompleted' }`.

4. **Keamanan**
   - Bootstrap endpoint akan gagal jika companyName kosong (validation).
   - Wizard juga menahan form kosong.
