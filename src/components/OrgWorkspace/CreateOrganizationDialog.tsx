import React, { useState, useEffect } from 'react';
import { X, Building2, MapPin, Network, Layers, Users, Briefcase, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils.js';

interface CreateOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateOrganizationDialog({ isOpen, onClose, onSuccess }: CreateOrganizationDialogProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'COMPANY',
    parentId: ''
  });
  
  const [tree, setTree] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTree();
      setFormData({ code: '', name: '', type: 'COMPANY', parentId: '' });
      setError(null);
    }
  }, [isOpen]);

  const fetchTree = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v2/org/tree');
      const data = await res.json();
      if (data.success) {
        setTree(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const flattenTree = (nodes: any[], level = 0): {id: string, name: string, level: number}[] => {
    let result: {id: string, name: string, level: number}[] = [];
    nodes.forEach(node => {
      result.push({ id: node.id, name: node.name, level });
      if (node.children) {
        result = result.concat(flattenTree(node.children, level + 1));
      }
    });
    return result;
  };

  const flatOptions = flattenTree(tree);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload: any = {
        code: formData.code,
        name: formData.name,
        type: formData.type
      };
      
      if (formData.parentId) {
        payload.parentId = formData.parentId;
      }

      const res = await fetch('/api/v2/org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || 'Failed to create organization');
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">Create New Organization</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Organization Code</label>
              <input 
                type="text" 
                required
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="e.g. CMP-001"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Organization Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="COMPANY">Company</option>
                <option value="BRANCH">Branch</option>
                <option value="DIVISION">Division</option>
                <option value="DEPARTMENT">Department</option>
                <option value="SECTION">Section</option>
                <option value="TEAM">Team</option>
                <option value="POSITION">Position</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Organization Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="e.g. Global Headquarters"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Parent Organization (Leave blank for Root)</label>
            <select 
              value={formData.parentId}
              onChange={e => setFormData({...formData, parentId: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">-- No Parent (Root Organization) --</option>
              {flatOptions.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {'\u00A0'.repeat(opt.level * 4)} {opt.level > 0 ? '↳ ' : ''} {opt.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className={cn(
                "px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm",
                submitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {submitting ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
