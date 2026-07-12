import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Check, Save, Layers, User, Briefcase, FileCheck, ShieldAlert, History } from 'lucide-react';
import { cn } from '../lib/utils';

export function PositionManager() {
  const [positions, setPositions] = useState<any[]>([]);
  const [references, setReferences] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
    fetchReferences();
  }, [search]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/organization/positions?limit=100&search=${encodeURIComponent(search)}`);
      const json = await res.json();
      if (json.success) setPositions(json.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchReferences = async () => {
    try {
      const [comp, bra, div, dept, sec, team, jg, pos] = await Promise.all([
        fetch('/api/organization/companies?limit=100').then(r => r.json()),
        fetch('/api/organization/branches?limit=100').then(r => r.json()),
        fetch('/api/organization/divisions?limit=100').then(r => r.json()),
        fetch('/api/organization/departments?limit=100').then(r => r.json()),
        fetch('/api/organization/sections?limit=100').then(r => r.json()),
        fetch('/api/organization/teams?limit=100').then(r => r.json()),
        fetch('/api/organization/job-grades?limit=100').then(r => r.json()),
        fetch('/api/organization/positions?limit=100').then(r => r.json())
      ]);
      setReferences({
        companies: comp.data || [],
        branches: bra.data || [],
        divisions: div.data || [],
        departments: dept.data || [],
        sections: sec.data || [],
        teams: team.data || [],
        jobGrades: jg.data || [],
        positions: pos.data || []
      });
    } catch(e) { console.error(e); }
  };

  const handleSelect = (pos: any) => {
    setSelectedId(pos.id);
    setFormData(pos);
  };

  const handleCreateNew = () => {
    setSelectedId('new');
    setFormData({ isActive: true });
    setActiveTab('general');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = selectedId === 'new' ? '/api/organization/positions' : `/api/organization/positions/${selectedId}`;
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
        alert(json.message || 'Error saving position');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving position');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId || selectedId === 'new') return;
    if (!confirm('Are you sure you want to delete this position?')) return;
    try {
      const res = await fetch(`/api/organization/positions/${selectedId}`, { method: 'DELETE' });
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
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Positions
            </h2>
            <button onClick={handleCreateNew} className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search positions..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-500">Loading...</div>
          ) : positions.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">No positions found.</div>
          ) : positions.map(pos => (
            <button
              key={pos.id}
              onClick={() => handleSelect(pos)}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all duration-200",
                selectedId === pos.id 
                  ? "bg-indigo-50 border-indigo-200 shadow-sm" 
                  : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-slate-900">{pos.name}</span>
                <span className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full",
                  pos.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                )}>
                  {pos.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="font-mono">{pos.code}</span>
                <span>•</span>
                <span>{references.departments?.find((d:any) => d.id === pos.departmentId)?.name || '-'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Detail */}
      <div className="flex-1 flex flex-col bg-slate-50/50">
        {!selectedId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <Briefcase className="w-16 h-16 opacity-20" />
            <p className="text-sm">Select a position to view details or create a new one.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white border-b border-slate-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {selectedId === 'new' ? 'New Position' : formData.name || 'Unnamed'}
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
                  { id: 'general', label: 'General Info', icon: <Briefcase className="w-4 h-4" /> },
                  { id: 'hierarchy', label: 'Hierarchy', icon: <Layers className="w-4 h-4" /> },
                  { id: 'approval', label: 'Approval & Authority', icon: <ShieldAlert className="w-4 h-4" /> },
                  { id: 'compensation', label: 'Compensation', icon: <FileCheck className="w-4 h-4" /> },
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
                        <label className="text-sm font-semibold text-slate-700">Position Code <span className="text-rose-500">*</span></label>
                        <input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none uppercase" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Position Name <span className="text-rose-500">*</span></label>
                        <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Company</label>
                        <select value={formData.companyId || ''} onChange={e => setFormData({...formData, companyId: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500">
                          <option value="">Select Company...</option>
                          {references.companies?.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Branch</label>
                        <select value={formData.branchId || ''} onChange={e => setFormData({...formData, branchId: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500">
                          <option value="">Select Branch...</option>
                          {references.branches?.filter((b:any) => !formData.companyId || b.companyId === formData.companyId).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Division</label>
                        <select value={formData.divisionId || ''} onChange={e => setFormData({...formData, divisionId: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500">
                          <option value="">Select Division...</option>
                          {references.divisions?.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Department</label>
                        <select value={formData.departmentId || ''} onChange={e => setFormData({...formData, departmentId: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500">
                          <option value="">Select Department...</option>
                          {references.departments?.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Section</label>
                        <select value={formData.sectionId || ''} onChange={e => setFormData({...formData, sectionId: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500">
                          <option value="">Select Section (Optional)...</option>
                          {references.sections?.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Team</label>
                        <select value={formData.teamId || ''} onChange={e => setFormData({...formData, teamId: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500">
                          <option value="">Select Team (Optional)...</option>
                          {references.teams?.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Description</label>
                      <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none" />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input type="checkbox" id="isActive" checked={formData.isActive || false} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500" />
                      <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Position is active and can be assigned to employees</label>
                    </div>
                  </div>
                )}

                {activeTab === 'hierarchy' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-blue-800 mb-4">
                      Configure the organizational reporting structure for this position. This drives the approval workflows and organizational chart.
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Parent Position (Structural)</label>
                        <select value={formData.parentPositionId || ''} onChange={e => setFormData({...formData, parentPositionId: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500">
                          <option value="">None (Top Level)</option>
                          {references.positions?.filter((p:any) => p.id !== selectedId).map((c:any) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                        </select>
                        <p className="text-xs text-slate-500">The formal structural parent of this position.</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Reports To (Functional)</label>
                        <select value={formData.reportsToPositionId || ''} onChange={e => setFormData({...formData, reportsToPositionId: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500">
                          <option value="">Same as Parent</option>
                          {references.positions?.filter((p:any) => p.id !== selectedId).map((c:any) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                        </select>
                        <p className="text-xs text-slate-500">Functional reporting line if different from structural parent (e.g. Matrix orgs).</p>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Hierarchy Level</label>
                        <input type="number" value={formData.level || ''} onChange={e => setFormData({...formData, level: parseInt(e.target.value) || null})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
                        <p className="text-xs text-slate-500">Numeric level indicating depth in the organization chart (1 = CEO/Top).</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'approval' && (
                  <div className="space-y-6">
                     <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-lg text-sm text-amber-800 mb-4">
                      Set authority levels for this position. These flags grant approval capabilities across different ERP modules.
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5 mb-6">
                        <label className="text-sm font-semibold text-slate-700">Approval Engine Level</label>
                        <input type="number" value={formData.approvalLevel || ''} onChange={e => setFormData({...formData, approvalLevel: parseInt(e.target.value) || null})} className="w-full max-w-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" placeholder="e.g. 1, 2, 3" />
                      </div>

                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pt-4 border-t border-slate-100">Module Approvals</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                          <div className="flex h-5 items-center">
                            <input type="checkbox" checked={formData.canApproveLeave || false} onChange={e => setFormData({...formData, canApproveLeave: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-900">Leave Approval</span>
                            <p className="text-xs text-slate-500 mt-0.5">Can approve employee leave and attendance requests.</p>
                          </div>
                        </label>
                        
                        <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                          <div className="flex h-5 items-center">
                            <input type="checkbox" checked={formData.canApprovePurchase || false} onChange={e => setFormData({...formData, canApprovePurchase: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-900">Purchase Approval</span>
                            <p className="text-xs text-slate-500 mt-0.5">Can approve PR and PO within limits.</p>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                          <div className="flex h-5 items-center">
                            <input type="checkbox" checked={formData.canApproveExpense || false} onChange={e => setFormData({...formData, canApproveExpense: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-900">Expense Approval</span>
                            <p className="text-xs text-slate-500 mt-0.5">Can approve claims and reimbursements.</p>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                          <div className="flex h-5 items-center">
                            <input type="checkbox" checked={formData.canApproveProject || false} onChange={e => setFormData({...formData, canApproveProject: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-900">Project Approval</span>
                            <p className="text-xs text-slate-500 mt-0.5">Can approve project phases and milestones.</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'compensation' && (
                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Job Grade <span className="text-rose-500">*</span></label>
                        <select value={formData.jobGradeId || ''} onChange={e => setFormData({...formData, jobGradeId: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500">
                          <option value="">Select Job Grade...</option>
                          {references.jobGrades?.map((c:any) => <option key={c.id} value={c.id}>{c.name} (Lvl {c.level})</option>)}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Employment Type</label>
                        <select value={formData.employmentTypeId || ''} onChange={e => setFormData({...formData, employmentTypeId: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500">
                          <option value="">Default...</option>
                          <option value="FULL_TIME">Full Time Permanent</option>
                          <option value="CONTRACT">Contract</option>
                          <option value="INTERNSHIP">Internship</option>
                          <option value="PART_TIME">Part Time</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Cost Center</label>
                        <input type="text" value={formData.costCenterId || ''} onChange={e => setFormData({...formData, costCenterId: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" placeholder="e.g. CC-IT-001" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Default Shift</label>
                        <input type="text" value={formData.defaultShiftId || ''} onChange={e => setFormData({...formData, defaultShiftId: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" placeholder="e.g. SHIFT-OFFICE" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'audit' && (
                  <div className="space-y-6">
                    {selectedId === 'new' ? (
                      <div className="text-center text-sm text-slate-500 p-8">Save the position first to view audit trail.</div>
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
                          <div>
                            <span className="block text-slate-500 mb-1">Version</span>
                            <span className="font-medium text-slate-900">{formData.version || 1}</span>
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
