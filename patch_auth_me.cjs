const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  "const employee = await db.select().from(schema.employees).where(eq(schema.employees.userId, user.id)).get() || null;",
  "const dbUser = await db.select().from(schema.users).where(eq(schema.users.id, user.id)).get();\n  const employee = dbUser && dbUser.email ? await db.select().from(schema.employees).where(eq(schema.employees.email, dbUser.email)).get() || null : null;"
);
fs.writeFileSync('server.ts', content);
