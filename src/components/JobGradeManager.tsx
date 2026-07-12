import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Save, BadgeDollarSign, History } from 'lucide-react';
import { cn } from '../lib/utils';

export function JobGradeManager() {
  const [jobGrades, setJobGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/organization/job-grades?limit=100&search=${encodeURIComponent(search)}`);
      const json = await res.json();
      if (json.success) setJobGrades(json.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSelect = (jg: any) => {
    setSelectedId(jg.id);
    setFormData(jg);
  };

  const handleCreateNew = () => {
    setSelectedId('new');
    setFormData({ isActive: true, currency: 'IDR' });
    setActiveTab('general');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = selectedId === 'new' ? '/api/organization/job-grades' : `/api/organization/job-grades/${selectedId}`;
      const method = selectedId === 'new' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        await fetchData();
        setSelectedId(json.data.id);
      } else {
        alert(json.message || 'Error saving job grade');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving job grade');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId || selectedId === 'new') return;
    if (!confirm('Are you sure you want to delete this job grade?')) return;
    try {
      const res = await fetch(`/api/organization/job-grades/${selectedId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setSelectedId(null);
        fetchData();
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      {/* Left List */}
      <div className="w-1/3 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-4 border-b border-slate-200 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <BadgeDollarSign className="w-5 h-5 text-indigo-600" />
              Job Grades
            </h2>
            <button onClick={handleCreateNew} className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search job grades..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-500">Loading...</div>
          ) : jobGrades.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">No job grades found.</div>
          ) : jobGrades.map(jg => (
            <button
              key={jg.id}
              onClick={() => handleSelect(jg)}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all duration-200",
                selectedId === jg.id 
                  ? "bg-indigo-50 border-indigo-200 shadow-sm" 
                  : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-slate-900">{jg.name}</span>
                <span className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full",
                  jg.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                )}>
                  {jg.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="font-mono">{jg.code}</span>
                <span>•</span>
                <span>Level {jg.level}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Detail */}
      <div className="flex-1 flex flex-col bg-slate-50/50">
        {!selectedId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <BadgeDollarSign className="w-16 h-16 opacity-20" />
            <p className="text-sm">Select a job grade to view details or create a new one.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white border-b border-slate-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {selectedId === 'new' ? 'New Job Grade' : formData.name || 'Unnamed'}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1 font-mono">
                    {formData.code || 'NO-CODE'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedId !== 'new' && (
                    <button onClick={handleDelete} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm shadow-indigo-600/20 disabled:opacity-50">
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-6 mt-6 border-b border-slate-200">
                {[
                  { id: 'general', label: 'General Info', icon: <BadgeDollarSign className="w-4 h-4" /> },
                  { id: 'audit', label: 'Audit Trail', icon: <History className="w-4 h-4" /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 relative top-[1px]",
                      activeTab === tab.id 
                        ? "text-indigo-600 border-indigo-600" 
                        : "text-slate-500 border-transparent hover:text-slate-700"
                    )}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Grade Code <span className="text-rose-500">*</span></label>
                        <input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none uppercase" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Grade Name <span className="text-rose-500">*</span></label>
                        <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Level (Numeric) <span className="text-rose-500">*</span></label>
                        <input type="number" value={formData.level || ''} onChange={e => setFormData({...formData, level: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
                        <p className="text-xs text-slate-500">1 = Lowest level, higher number = higher level</p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Sequence</label>
                        <input type="number" value={formData.sequence || ''} onChange={e => setFormData({...formData, sequence: parseInt(e.target.value) || null})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
                        <p className="text-xs text-slate-500">For display ordering within same level</p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Salary Band (Optional)</h3>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-slate-700">Currency</label>
                          <input type="text" value={formData.currency || 'IDR'} onChange={e => setFormData({...formData, currency: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none uppercase" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-slate-700">Minimum Salary</label>
                          <input type="number" value={formData.minimumSalary || ''} onChange={e => setFormData({...formData, minimumSalary: parseFloat(e.target.value) || null})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-slate-700">Maximum Salary</label>
                          <input type="number" value={formData.maximumSalary || ''} onChange={e => setFormData({...formData, maximumSalary: parseFloat(e.target.value) || null})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Description</label>
                      <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none" />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input type="checkbox" id="isActive" checked={formData.isActive || false} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500" />
                      <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Job Grade is active</label>
                    </div>
                  </div>
                )}

                {activeTab === 'audit' && (
                  <div className="space-y-6">
                    {selectedId === 'new' ? (
                      <div className="text-center text-sm text-slate-500 p-8">Save the job grade first to view audit trail.</div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="block text-slate-500 mb-1">Created At</span>
                            <span className="font-medium text-slate-900">{new Date(formData.createdAt).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="block text-slate-500 mb-1">Created By</span>
                            <span className="font-medium text-slate-900">{formData.createdBy || 'System'}</span>
                          </div>
                          <div>
                            <span className="block text-slate-500 mb-1">Updated At</span>
                            <span className="font-medium text-slate-900">{formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : '-'}</span>
                          </div>
                          <div>
                            <span className="block text-slate-500 mb-1">Updated By</span>
                            <span className="font-medium text-slate-900">{formData.updatedBy || '-'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
