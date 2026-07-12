const fs = require('fs');

let content = fs.readFileSync('src/routes/rbacRoutes.ts', 'utf8');

const regex = /roles: getUserRoles\(user\.id\),/g;
content = content.replace(regex, `roles: user.role === 'SUPER_ADMIN' ? [...new Set([...getUserRoles(user.id), 'SUPER_ADMIN'])] : getUserRoles(user.id),`);

fs.writeFileSync('src/routes/rbacRoutes.ts', content);
console.log('patched rbacRoutes');
