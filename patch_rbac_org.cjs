const fs = require('fs');

let content = fs.readFileSync('src/contexts/RBACContext.tsx', 'utf8');

// The ModuleId might need 'org_workspace' if it's explicitly typed there, but it's likely in types.ts.
// Let's add permissions for 'org_workspace' to the superadmin and admin roles if they exist.

if (content.includes('const DEFAULT_ROLE_PERMISSIONS: Record<Role, Permission[]> = {') && !content.includes("'org_workspace:view'")) {
  content = content.replace(
    /SUPER_ADMIN: \[([\s\S]*?)\]/m,
    "SUPER_ADMIN: [$1, 'org_workspace:view', 'org_workspace:create', 'org_workspace:edit', 'org_workspace:delete']"
  );
  
  content = content.replace(
    /COMPANY_ADMIN: \[([\s\S]*?)\]/m,
    "COMPANY_ADMIN: [$1, 'org_workspace:view', 'org_workspace:create', 'org_workspace:edit', 'org_workspace:delete']"
  );
  
  content = content.replace(
    /BRANCH_ADMIN: \[([\s\S]*?)\]/m,
    "BRANCH_ADMIN: [$1, 'org_workspace:view', 'org_workspace:create', 'org_workspace:edit']"
  );

  fs.writeFileSync('src/contexts/RBACContext.tsx', content);
  console.log("Patched RBACContext.tsx with org_workspace permissions");
} else {
  console.log("RBACContext.tsx does not need patching or could not find DEFAULT_ROLE_PERMISSIONS");
}
