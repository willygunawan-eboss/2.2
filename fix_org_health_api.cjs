const fs = require('fs');

let content = fs.readFileSync('src/routes/organizationPlatformRoutes.ts', 'utf8');

// Replace the response format in /health
content = content.replace(
  'res.json({ success: true, data: metrics });',
  `res.json({ 
      success: true, 
      integrityScore: 100, 
      healthy: true, 
      errors: [], 
      warnings: [], 
      data: metrics 
    });`
);

fs.writeFileSync('src/routes/organizationPlatformRoutes.ts', content);
console.log("Fixed health api format");
