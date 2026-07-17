const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

const addCode = `
export const dataScopesRelations = relations(dataScopes, ({ many }) => ({
  roleDataScopes: many(roleDataScopes),
}));

export const roleDataScopesRelations = relations(roleDataScopes, ({ one }) => ({
  role: one(roles, {
    fields: [roleDataScopes.roleId],
    references: [roles.id],
  }),
  scope: one(dataScopes, {
    fields: [roleDataScopes.scopeId],
    references: [dataScopes.id],
  }),
}));

export const approvalLevelsRelations = relations(approvalLevels, ({ one }) => ({
  role: one(roles, {
    fields: [approvalLevels.roleId],
    references: [roles.id],
  }),
}));

export const auditPermissionsRelations = relations(auditPermissions, ({ one }) => ({
  actor: one(users, {
    fields: [auditPermissions.actorId],
    references: [users.id],
  }),
}));
`;

code = code + '\n' + addCode;
fs.writeFileSync(file, code);

