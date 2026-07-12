const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/await db\.select\(\)\.from\(schema\.companies\)/g, 'await db.select({ id: schema.companies.id }).from(schema.companies)');
content = content.replace(/await db\.select\(\)\.from\(schema\.branches\)/g, 'await db.select({ id: schema.branches.id }).from(schema.branches)');
content = content.replace(/await db\.select\(\)\.from\(schema\.divisions\)/g, 'await db.select({ id: schema.divisions.id }).from(schema.divisions)');
content = content.replace(/await db\.select\(\)\.from\(schema\.departments\)/g, 'await db.select({ id: schema.departments.id }).from(schema.departments)');
content = content.replace(/await db\.select\(\)\.from\(schema\.jobGrades\)/g, 'await db.select({ id: schema.jobGrades.id }).from(schema.jobGrades)');
content = content.replace(/await db\.select\(\)\.from\(schema\.positions\)/g, 'await db.select({ id: schema.positions.id }).from(schema.positions)');
content = content.replace(/await db\.select\(\)\.from\(schema\.users\)/g, 'await db.select({ id: schema.users.id }).from(schema.users)');
content = content.replace(/await db\.select\(\)\.from\(schema\.employees\)/g, 'await db.select({ id: schema.employees.id }).from(schema.employees)');

fs.writeFileSync('server.ts', content);
console.log('patched 5');
