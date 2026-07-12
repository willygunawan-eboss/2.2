const fs = require('fs');
let content = fs.readFileSync('src/pages/OrgMasterView.tsx', 'utf8');

const replacementColumns = `  const getColumns = () => {
    switch (endpoint) {
      case 'company': return ['code', 'name', 'phone', 'email', 'isActive'];
      case 'branches': return ['code', 'name', 'companyId', 'phone', 'isActive'];
      case 'divisions': return ['code', 'name', 'companyId', 'branchId', 'isActive'];
      case 'departments': return ['code', 'name', 'divisionId', 'isActive'];
      case 'sections': return ['code', 'name', 'departmentId', 'isActive'];
      case 'teams': return ['code', 'name', 'sectionId', 'isActive'];
      case 'job-grades': return ['code', 'name', 'level', 'isActive'];
      case 'positions': return ['code', 'name', 'departmentId', 'jobGradeId', 'isActive'];
      case 'employees': return ['employeeNumber', 'name', 'email', 'positionId', 'status'];
      default: return [];
    }
  };`;

content = content.replace(
  /const getColumns = \(\) => \{[\s\S]*?\}\n  \};/,
  replacementColumns
);

// Map relations names for table display
const mapValRepl = `if (c === 'companyId') val = references.companies?.find((x:any) => x.id === val)?.name || val;
                    if (c === 'divisionId') val = references.divisions?.find((x:any) => x.id === val)?.name || val;
                    if (c === 'departmentId') val = references.departments?.find((x:any) => x.id === val)?.name || val;
                    if (c === 'sectionId') val = references.sections?.find((x:any) => x.id === val)?.name || val;
                    if (c === 'teamId') val = references.teams?.find((x:any) => x.id === val)?.name || val;
                    if (c === 'jobGradeId') val = references.jobGrades?.find((x:any) => x.id === val)?.name || val;
                    if (c === 'positionId') val = references.positions?.find((x:any) => x.id === val)?.name || val;
                    if (c === 'branchId') val = references.branches?.find((x:any) => x.id === val)?.name || val;`;

content = content.replace(
  /if \(c === 'companyId'\)[\s\S]*?if \(c === 'branchId'\) val = references\.branches\?\.find\(\(x:any\) => x\.id === val\)\?\.name || val;/,
  mapValRepl
);

// Form selects
const mapOptRepl = `if (c === 'companyId') opts = references.companies || [];
                    if (c === 'divisionId') opts = references.divisions || [];
                    if (c === 'departmentId') opts = references.departments || [];
                    if (c === 'sectionId') opts = references.sections || [];
                    if (c === 'teamId') opts = references.teams || [];
                    if (c === 'jobGradeId') opts = references.jobGrades || [];
                    if (c === 'positionId') opts = references.positions || [];
                    if (c === 'branchId') opts = references.branches || [];`;

content = content.replace(
  /if \(c === 'companyId'\)[\s\S]*?if \(c === 'branchId'\) opts = references\.branches || \[\];/,
  mapOptRepl
);

fs.writeFileSync('src/pages/OrgMasterView.tsx', content);
