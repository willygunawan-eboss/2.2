const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

const addCode = `
export const rolesRelations = relations(roles, ({ one, many }) => ({
  group: one(roleGroups, {
    fields: [roles.groupId],
    references: [roleGroups.id],
  }),
  rolePermissions: many(rolePermissions),
  userRoles: many(userRoles),
  roleDataScopes: many(roleDataScopes),
  menuPermissions: many(menuPermissions),
  approvalLevels: many(approvalLevels),
}));

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const menuPermissionsRelations = relations(
  menuPermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [menuPermissions.roleId],
      references: [roles.id],
    }),
  }),
);

`;

code = code + '\n' + addCode;
fs.writeFileSync(file, code);

