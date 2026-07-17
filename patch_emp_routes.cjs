const fs = require('fs');
const file = 'src/routes/employeeRoutes.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/        department: true,\n        position: true,\n        branch: true,\n        company: true,\n/g, "");

// /organization
code = code.replace(/    res\.json\(formatSuccess\({\n      company: employee\.company,\n      branch: employee\.branch,\n      division: employee\.division,\n      department: employee\.department,\n      section: employee\.section,\n      team: employee\.team,\n      position: employee\.position,\n      jobGrade: employee\.jobGrade\n    }\)\);/g, "    res.json(formatSuccess({}));");

// /manager
code = code.replace(/    res\.json\(formatSuccess\(\{ manager: employee\.manager \}\)\);/g, "    res.json(formatSuccess({}));");

// /subordinates
code = code.replace(/    const subordinates = await db\.query\.employees\.findMany\({\n      where: eq\(schema\.employees\.managerEmployeeId, id\),\n      with: {\n        position: true,\n        department: true\n      }\n    }\);/g, "    const subordinates: any[] = []; // Subordinates logic moved to assignment tree");

fs.writeFileSync(file, code);
