import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronDown, Search, ArrowRightLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { MoveOrganizationDialog } from './MoveOrganizationDialog';

function TreeNode({ node, level, expanded, onToggle, searchQuery, onMove, highlightedNodeId }: any) {
  const isExpanded = expanded[node.id] || false;
  const hasChildren = node.children && node.children.length > 0;
  
  // Highlighting search text
  const matchSearch = searchQuery && node.name.toLowerCase().includes(searchQuery.toLowerCase());
  const isHighlighted = highlightedNodeId === node.id;

  return (
    <div className="select-none">
      <div 
        className={clsx(
          "flex items-center py-2 px-2 hover:bg-slate-50 rounded cursor-pointer group",
          matchSearch && "bg-blue-50",
          isHighlighted && "ring-2 ring-blue-500 bg-blue-50/50"
        )}
        style={{ paddingLeft: `${level * 24 + 8}px` }}
      >
        <span 
          className="w-5 h-5 flex items-center justify-center mr-1 text-slate-400 hover:text-slate-600"
          onClick={() => hasChildren && onToggle(node.id)}
        >
          {hasChildren && (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          )}
        </span>
        
        <div className="flex-1 flex items-center" onClick={() => hasChildren && onToggle(node.id)}>
          <span className={clsx("text-sm", matchSearch || isHighlighted ? "text-blue-700 font-medium" : "text-slate-700 font-medium")}>
            {node.name}
          </span>
          <span className="ml-3 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-slate-100 text-slate-500 rounded-full">
            {node.type}
          </span>
          <span className="ml-2 text-xs text-slate-400 font-mono">
            {node.code}
          </span>
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
          {level > 0 && (
            <button 
              onClick={(e) => { e.stopPropagation(); onMove(node); }}
              className="p-1 hover:bg-blue-100 text-blue-600 rounded"
              title="Move Organization"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {isExpanded && hasChildren && (
        <div className="flex flex-col">
          {node.children.map((child: any) => (
            <TreeNode 
              key={child.id} 
              node={child} 
              level={level + 1} 
              expanded={expanded} 
              onToggle={onToggle}
              searchQuery={searchQuery}
              onMove={onMove}
              highlightedNodeId={highlightedNodeId}
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
  
  const [moveNode, setMoveNode] = useState<any>(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  const fetchTree = () => {
    setLoading(true);
    fetch('/api/v2/org/tree')
      .then(res => res.json())
      .then(data => {
        setTree(data.data || []);
        setLoading(false);
        
        if (data.data) {
          const initialExpanded: Record<string, boolean> = {};
          data.data.forEach((r: any) => { initialExpanded[r.id] = true; });
          setExpanded(prev => ({...prev, ...initialExpanded}));
        }
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const toggleNode = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allExp: Record<string, boolean> = {};
    const traverse = (nodes: any[]) => {
      nodes.forEach(n => {
        allExp[n.id] = true;
        if (n.children) traverse(n.children);
      });
    };
    traverse(tree);
    setExpanded(allExp);
  };

  const collapseAll = () => {
    setExpanded({});
  };

  const handleMoveSuccess = (movedNodeId: string) => {
    setMoveNode(null);
    setHighlightedNodeId(movedNodeId);
    fetchTree();
    // Also trigger refetch for other components
    window.dispatchEvent(new Event('refetch-org'));
    
    setTimeout(() => {
      setHighlightedNodeId(null);
    }, 3000);
  };

  if (loading && tree.length === 0) return <div className="text-slate-500 p-8 flex justify-center">Loading Enterprise Hierarchy...</div>;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Enterprise Explorer</h3>
          <p className="text-sm text-slate-500 mt-1">Hierarchical view of your organization</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-64"
            />
          </div>
          <button onClick={expandAll} className="px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors">Expand All</button>
          <button onClick={collapseAll} className="px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors">Collapse All</button>
        </div>
      </div>
      
      <div className="overflow-x-auto border border-slate-100 rounded-lg bg-slate-50/50 p-2">
        <div className="min-w-fit">
          {tree.map(node => (
            <TreeNode 
              key={node.id} 
              node={node} 
              level={0} 
              expanded={expanded} 
              onToggle={toggleNode}
              searchQuery={search}
              onMove={(n: any) => setMoveNode(n)}
              highlightedNodeId={highlightedNodeId}
            />
          ))}
          {tree.length === 0 && !loading && (
            <div className="text-slate-500 py-12 text-center text-sm">No organization data found.</div>
          )}
        </div>
      </div>

      <MoveOrganizationDialog
        isOpen={!!moveNode}
        onClose={() => setMoveNode(null)}
        onSuccess={handleMoveSuccess}
        nodeId={moveNode?.id}
        nodeName={moveNode?.name}
      />
    </div>
  );
}
