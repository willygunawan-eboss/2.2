const fs = require('fs');
let content = fs.readFileSync('src/components/OrgWorkspace/OrganizationExplorer.tsx', 'utf8');

const originalFetch = `    fetch('/api/organization/workspace/tree')
      .then(res => res.json())
      .then(data => {
        // Build Tree
        const nodeMap: any = {};
        
        // 1. Companies
        data.companies.forEach((c: any) => {
          nodeMap[\`comp_\${c.id}\`] = { key: \`comp_\${c.id}\`, id: c.id, name: c.name, type: 'Company', icon: <Building2 className="w-4 h-4 text-blue-600" />, children: [] };
        });
        
        // 2. Branches
        data.branches.forEach((b: any) => {
          const node = { key: \`br_\${b.id}\`, id: b.id, name: b.name, type: 'Branch', icon: <MapPin className="w-4 h-4 text-green-400" />, children: [] };
          nodeMap[node.key] = node;
          if (nodeMap[\`comp_\${b.companyId}\`]) {
            nodeMap[\`comp_\${b.companyId}\`].children.push(node);
          }
        });

        // 3. Divisions
        data.divisions.forEach((d: any) => {
          const node = { key: \`div_\${d.id}\`, id: d.id, name: d.name, type: 'Division', icon: <Layers className="w-4 h-4 text-purple-500" />, children: [] };
          nodeMap[node.key] = node;
          if (nodeMap[\`br_\${d.branchId}\`]) {
            nodeMap[\`br_\${d.branchId}\`].children.push(node);
          } else if (nodeMap[\`comp_\${d.companyId}\`]) {
            nodeMap[\`comp_\${d.companyId}\`].children.push(node);
          }
        });

        // 4. Departments
        data.departments.forEach((d: any) => {
          const node = { key: \`dept_\${d.id}\`, id: d.id, name: d.name, type: 'Department', icon: <FolderTree className="w-4 h-4 text-orange-400" />, children: [] };
          nodeMap[node.key] = node;
          if (nodeMap[\`div_\${d.divisionId}\`]) {
            nodeMap[\`div_\${d.divisionId}\`].children.push(node);
          } else if (nodeMap[\`br_\${d.branchId}\`]) {
             nodeMap[\`br_\${d.branchId}\`].children.push(node);
          } else if (nodeMap[\`comp_\${d.companyId}\`]) {
            nodeMap[\`comp_\${d.companyId}\`].children.push(node);
          }
        });

        const roots = Object.values(nodeMap).filter((n: any) => {
          // It's a root if it has no parent in our logic, meaning it's a company
          return n.type === 'Company';
        });

        setTree(roots);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));`;

const updatedFetch = `    fetch('/api/v2/org/tree')
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.message || "Failed to fetch");
        
        const mapIcon = (type: string) => {
          switch(type) {
            case 'COMPANY': return <Building2 className="w-4 h-4 text-blue-600" />;
            case 'BRANCH': return <MapPin className="w-4 h-4 text-green-400" />;
            case 'DIVISION': return <Layers className="w-4 h-4 text-purple-500" />;
            case 'DEPARTMENT': return <FolderTree className="w-4 h-4 text-orange-400" />;
            case 'SECTION': return <Network className="w-4 h-4 text-indigo-400" />;
            case 'TEAM': return <Users className="w-4 h-4 text-teal-400" />;
            default: return <Briefcase className="w-4 h-4 text-slate-400" />;
          }
        };

        const transformNode = (node: any): any => {
          return {
            key: node.id,
            id: node.id,
            name: node.name,
            type: node.type,
            icon: mapIcon(node.type),
            children: (node.children || []).map(transformNode)
          };
        };

        const roots = (data.data || []).map(transformNode);
        setTree(roots);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));`;

content = content.replace(originalFetch, updatedFetch);

fs.writeFileSync('src/components/OrgWorkspace/OrganizationExplorer.tsx', content);
