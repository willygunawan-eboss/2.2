const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  `if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/health', '/api/system/health'].includes(req.path)) return next();`,
  `if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/health', '/api/system/health', '/api/bootstrap/status', '/api/bootstrap'].includes(req.path)) return next();`
);
content = content.replace(
  `if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout'].includes(req.path) || req.path.startsWith('/api/health') || req.path.startsWith('/api/system/health')) return next();`,
  `if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/bootstrap/status', '/api/bootstrap'].includes(req.path) || req.path.startsWith('/api/health') || req.path.startsWith('/api/system/health')) return next();`
);

fs.writeFileSync('server.ts', content);
console.log('patched 12');
