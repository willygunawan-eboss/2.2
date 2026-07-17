const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

content = content.replace(
  'positionId: text("position_id").notNull().references(() => orgPlatform.id),',
  'positionId: text("position_id").notNull().references(() => posPlatform.id),'
);

content = content.replace(
  'position: one(orgPlatform, { fields: [empAssignment.positionId], references: [orgPlatform.id], relationName: "assignment_position" }),',
  'position: one(posPlatform, { fields: [empAssignment.positionId], references: [posPlatform.id], relationName: "assignment_position" }),'
);

content = content.replace(
  'company: one(orgPlatform, { fields: [posPlatform.companyId], references: [orgPlatform.id] })',
  'company: one(orgPlatform, { fields: [posPlatform.companyId], references: [orgPlatform.id] }),\n  assignments: many(empAssignment, { relationName: "assignment_position" })'
);

fs.writeFileSync('src/db/schema.ts', content);
