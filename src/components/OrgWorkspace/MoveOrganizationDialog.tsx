import React, { useState, useEffect } from 'react';
import { X, Network } from 'lucide-react';

export function MoveOrganizationDialog({ isOpen, onClose, onSuccess, nodeId, nodeName }: any) {
  const [tree, setTree] = useState<any[]>([]);
  const [newParentId, setNewParentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNewParentId('');
      setError('');
      fetch('/api/v2/org/tree')
        .then(res => res.json())
        .then(res => setTree(res.data || []))
        .catch(() => setError('Failed to load organization tree'));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/v2/org/${nodeId}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newParentId })
      });
      
      const data = await res.json();
      if (data.success) {
        onSuccess(nodeId); // Pass nodeId to highlight it
      } else {
        setError(data.message || 'Failed to move organization');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const flattenTree = (nodes: any[], level = 0): any[] => {
    let result: any[] = [];
    for (const node of nodes) {
      // Don't show the node itself or its descendants as valid parents (business rule handled in backend, but good for UI)
      result.push({ id: node.id, name: node.name, type: node.type, level });
      if (node.children && node.children.length > 0) {
        result = result.concat(flattenTree(node.children, level + 1));
      }
    }
    return result;
  };

  if (!isOpen) return null;

  const flatNodes = flattenTree(tree);

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
              <Network className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Move Organization</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Organization</label>
              <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 font-medium">
                {nodeName}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Parent</label>
              <select
                value={newParentId}
                onChange={e => setNewParentId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select New Parent</option>
                {flatNodes.map(node => (
                  <option key={node.id} value={node.id} disabled={node.id === nodeId}>
                    {'\u00A0'.repeat(node.level * 4)} {node.name} ({node.type})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !newParentId}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Moving...' : 'Move'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
