import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronDown, Building2, MapPin, Layers, FolderTree, Network, Users, Briefcase, Search } from 'lucide-react';
import { clsx } from 'clsx';

function TreeNode({ node, level, expanded, onToggle, searchQuery }: any) {
  const isExpanded = expanded[node.key] || false;
  const hasChildren = node.children && node.children.length > 0;
  
  // Highlighting search text
  const matchSearch = searchQuery && node.name.toLowerCase().includes(searchQuery.toLowerCase());

  return (
    <div className="select-none">
      <div 
        className={clsx(
          "flex items-center py-1.5 px-2 hover:bg-slate-750/50 rounded cursor-pointer group",
          matchSearch && "bg-blue-500/10"
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => hasChildren && onToggle(node.key)}
      >
        <span className="w-5 h-5 flex items-center justify-center mr-1 text-slate-400 group-hover:text-slate-300">
          {hasChildren && (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          )}
        </span>
        
        <span className="mr-2 opacity-80">{node.icon}</span>
        <span className={clsx("text-sm", matchSearch ? "text-blue-400 font-medium" : "text-slate-300")}>
          {node.name}
        </span>
        <span className="ml-3 text-xs text-slate-500">{node.type}</span>
      </div>
      
      {isExpanded && hasChildren && (
        <div className="flex flex-col">
          {node.children.map((child: any) => (
            <TreeNode 
              key={child.key} 
              node={child} 
              level={level + 1} 
              expanded={expanded} 
              onToggle={onToggle}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function OrganizationExplorer() {
  const [tree, setTree] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/organization/workspace/tree')
      .then(res => res.json())
      .then(data => {
        // Build Tree
        const nodeMap: any = {};
        
        // 1. Companies
        data.companies.forEach((c: any) => {
          nodeMap[`comp_${c.id}`] = { key: `comp_${c.id}`, id: c.id, name: c.name, type: 'Company', icon: <Building2 className="w-4 h-4 text-blue-400" />, children: [] };
        });
        
        // 2. Branches
        data.branches.forEach((b: any) => {
          const node = { key: `br_${b.id}`, id: b.id, name: b.name, type: 'Branch', icon: <MapPin className="w-4 h-4 text-green-400" />, children: [] };
          nodeMap[node.key] = node;
          if (nodeMap[`comp_${b.companyId}`]) {
            nodeMap[`comp_${b.companyId}`].children.push(node);
          }
        });

        // 3. Divisions
        data.divisions.forEach((d: any) => {
          const node = { key: `div_${d.id}`, id: d.id, name: d.name, type: 'Division', icon: <Layers className="w-4 h-4 text-purple-400" />, children: [] };
          nodeMap[node.key] = node;
          if (nodeMap[`br_${d.branchId}`]) {
            nodeMap[`br_${d.branchId}`].children.push(node);
          }
        });

        // 4. Departments
        data.departments.forEach((d: any) => {
          const node = { key: `dep_${d.id}`, id: d.id, name: d.name, type: 'Department', icon: <FolderTree className="w-4 h-4 text-yellow-400" />, children: [] };
          nodeMap[node.key] = node;
          if (nodeMap[`div_${d.divisionId}`]) {
            nodeMap[`div_${d.divisionId}`].children.push(node);
          }
        });

        // 5. Sections
        data.sections.forEach((s: any) => {
          const node = { key: `sec_${s.id}`, id: s.id, name: s.name, type: 'Section', icon: <Network className="w-4 h-4 text-pink-400" />, children: [] };
          nodeMap[node.key] = node;
          if (nodeMap[`dep_${s.departmentId}`]) {
            nodeMap[`dep_${s.departmentId}`].children.push(node);
          }
        });

        // 6. Teams
        data.teams.forEach((t: any) => {
          const node = { key: `team_${t.id}`, id: t.id, name: t.name, type: 'Team', icon: <Users className="w-4 h-4 text-orange-400" />, children: [] };
          nodeMap[node.key] = node;
          if (nodeMap[`sec_${t.sectionId}`]) {
            nodeMap[`sec_${t.sectionId}`].children.push(node);
          }
        });

        // 7. Positions (attach to Department)
        data.positions.forEach((p: any) => {
          const node = { key: `pos_${p.id}`, id: p.id, name: p.name, type: 'Position', icon: <Briefcase className="w-4 h-4 text-indigo-400" />, children: [] };
          nodeMap[node.key] = node;
          if (nodeMap[`dep_${p.departmentId}`]) {
            nodeMap[`dep_${p.departmentId}`].children.push(node);
          }
        });

        const rootNodes = Object.values(nodeMap).filter((n: any) => n.type === 'Company');
        setTree(rootNodes);
        setLoading(false);
        
        // Auto expand root
        const initialExpanded: Record<string, boolean> = {};
        rootNodes.forEach((r: any) => { initialExpanded[r.key] = true; });
        setExpanded(initialExpanded);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const toggleNode = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    const allExp: Record<string, boolean> = {};
    const traverse = (nodes: any[]) => {
      nodes.forEach(n => {
        allExp[n.key] = true;
        if (n.children) traverse(n.children);
      });
    };
    traverse(tree);
    setExpanded(allExp);
  };

  const collapseAll = () => {
    setExpanded({});
  };

  if (loading) return <div className="text-slate-400 p-8">Loading Tree...</div>;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-medium">Organization Explorer</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search node..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-64"
            />
          </div>
          <button onClick={expandAll} className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded">Expand All</button>
          <button onClick={collapseAll} className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded">Collapse All</button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-fit pr-4">
          {tree.map(node => (
            <TreeNode 
              key={node.key} 
              node={node} 
              level={0} 
              expanded={expanded} 
              onToggle={toggleNode}
              searchQuery={search}
            />
          ))}
          {tree.length === 0 && (
            <div className="text-slate-500 py-8 text-center">No organization data found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
