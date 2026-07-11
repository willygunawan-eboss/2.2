# System Bootstrap

The bootstrap flow runs automatically on fresh installations if no super admin exists.
1. App starts, redirects to `/login`.
2. A generic setup wizard is presented if `users` table is empty.
3. Automatically sets up the primary Organization and initial Super Admin.
4. Generates standard Roles and modules mapping.
