const fs = require('fs');
let content = fs.readFileSync('src/routes/orgRoutes.ts', 'utf-8');

if (!content.includes('OrganizationRegistryService.invalidateCache()')) {
  // Add import
  content = content.replace(
    'import { OrganizationService } from "../services/OrganizationService.js";',
    'import { OrganizationService } from "../services/OrganizationService.js";\nimport { OrganizationRegistryService } from "../services/OrganizationRegistryService.js";'
  );
  
  // Replace standard CRUD responses with invalidation
  // We can just add OrganizationRegistryService.invalidateCache() before res.json in POST/PUT/DELETE
  content = content.replace(/res.status\(201\).json\(([^)]+)\);/g, 'OrganizationRegistryService.invalidateCache();\n      res.status(201).json($1);');
  content = content.replace(/res.json\(([^)]+)\);\n    } catch/g, 'OrganizationRegistryService.invalidateCache();\n      res.json($1);\n    } catch');
  
  // Clean up any double additions
  
  fs.writeFileSync('src/routes/orgRoutes.ts', content);
}
