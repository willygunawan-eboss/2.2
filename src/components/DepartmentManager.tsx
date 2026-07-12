import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, CheckCircle, XCircle, Clock, Undo, Users, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

export function DepartmentManager() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [filterCompany, setFilterCompany] = useState<string>("");
  const [filterBranch, setFilterBranch] = useState<string>("");
  const [filterDivision, setFilterDivision] = useState<string>("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create'|'edit'>('create');
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchReferences();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, search, showDeleted, filterCompany, filterBranch, filterDivision]);

  const fetchReferences = async () => {
    try {
      const res = await fetch('/api/org/references/all');
      const json = await res.json();
      if (json.success) {
        setCompanies(json.data.companies || []);
        setBranches(json.data.branches || []);
        setDivisions(json.data.divisions || []);
      }
    } catch (e) {}
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      let url = `/api/org/departments?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&showDeleted=${showDeleted}`;
      if (filterCompany) url += `&companyId=${filterCompany}`;
      if (filterBranch) url += `&branchId=${filterBranch}`;
      if (filterDivision) url += `&divisionId=${filterDivision}`;
      
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setDepartments(json.data);
        setTotal(json.pagination.total);
        if (json.data.length > 0 && !selectedDepartmentId && !json.data.find((c:any) => c.id === selectedDepartmentId)) {
           setSelectedDepartmentId(json.data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      const url = formMode === 'create' ? `/api/org/departments` : `/api/org/departments/${formData.id}`;
      const method = formMode === 'create' ? 'POST' : 'PUT';
      
      const payload = { ...formData };
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        fetchData();
        if (formMode === 'create') setSelectedDepartmentId(json.data?.id);
      } else {
        setErrorMsg(json.message || JSON.stringify(json.error));
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      const res = await fetch(`/api/org/departments/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) fetchData();
      else alert(json.message);
    } catch (e) { console.error(e); }
  };

  const handleRestore = async (id: string) => {
    if (!confirm("Are you sure you want to restore this department?")) return;
    try {
      const res = await fetch(`/api/org/departments/${id}/restore`, { method: 'POST' });
      const json = await res.json();
      if (json.success) fetchData();
      else alert(json.message);
    } catch (e) { console.error(e); }
  };

  const openCreate = () => {
    setFormMode('create');
    setFormData({ isActive: true, status: 'Active', companyId: filterCompany || (companies[0]?.id || ""), branchId: filterBranch || "", divisionId: filterDivision || "" });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEdit = (item: any) => {
    setFormMode('edit');
    setFormData(item);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const selectedDepartment = departments.find(c => c.id === selectedDepartmentId);
  const filteredBranches = formData.companyId ? branches.filter(b => b.companyId === formData.companyId) : branches;
  const filteredDivisions = formData.branchId ? divisions.filter(d => d.branchId === formData.branchId) : divisions;
  
  const filteredBranchesForFilter = filterCompany ? branches.filter(b => b.companyId === filterCompany) : branches;
  const filteredDivisionsForFilter = filterBranch ? divisions.filter(d => d.branchId === filterBranch) : divisions;

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      {/* Left List */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col z-10">
        <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Departments</h2>
            <button onClick={openCreate} className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <select 
                className="flex-1 text-xs border border-slate-200 rounded p-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={filterCompany}
                onChange={e => { setFilterCompany(e.target.value); setFilterBranch(''); setFilterDivision(''); setPage(1); }}
              >
                <option value="">All Companies</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select 
                className="flex-1 text-xs border border-slate-200 rounded p-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={filterBranch}
                onChange={e => { setFilterBranch(e.target.value); setFilterDivision(''); setPage(1); }}
              >
                <option value="">All Branches</option>
                {filteredBranchesForFilter.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <select 
              className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filterDivision}
              onChange={e => { setFilterDivision(e.target.value); setPage(1); }}
            >
              <option value="">All Divisions</option>
              {filteredDivisionsForFilter.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
            <input type="checkbox" checked={showDeleted} onChange={(e) => { setShowDeleted(e.target.checked); setPage(1); }} className="rounded border-slate-300" />
            Show Deleted
          </label>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-500">Loading...</div>
          ) : departments.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">No departments found.</div>
          ) : (
            <div className="space-y-1">
              {departments.map(department => (
                <button
                  key={department.id}
                  onClick={() => setSelectedDepartmentId(department.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors border flex flex-col justify-between group",
                    selectedDepartmentId === department.id 
                      ? "bg-blue-50 border-blue-200" 
                      : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium truncate",
                    selectedDepartmentId === department.id ? "text-blue-900" : "text-slate-700",
                    department.deletedAt && "line-through text-slate-400"
                  )}>
                    {department.name}
                  </span>
                  <span className={cn(
                    "text-xs truncate mt-1",
                    selectedDepartmentId === department.id ? "text-blue-600" : "text-slate-500"
                  )}>
                    {department.code} • {department.divisionName}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Detail */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {selectedDepartment ? (
          <>
            <div className="px-8 py-6 border-b border-slate-100 bg-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-semibold text-slate-900">{selectedDepartment.name}</h1>
                  {selectedDepartment.isActive ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-200/50 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 flex items-center gap-1"><XCircle className="w-3 h-3" /> Inactive</span>
                  )}
                  {selectedDepartment.deletedAt && (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-medium border border-red-200/50">Deleted</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 font-mono">{selectedDepartment.code} • {selectedDepartment.divisionName}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(selectedDepartment)} className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" /> Edit
                </button>
                {selectedDepartment.deletedAt ? (
                  <button onClick={() => handleRestore(selectedDepartment.id)} className="px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors flex items-center gap-2">
                    <Undo className="w-4 h-4" /> Restore
                  </button>
                ) : (
                  <button onClick={() => handleDelete(selectedDepartment.id)} className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                )}
              </div>
            </div>

            <div className="px-8 border-b border-slate-100 bg-white/50">
              <div className="flex gap-6">
                {['general', 'audit'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "py-3 text-sm font-medium border-b-2 transition-colors capitalize",
                      activeTab === tab ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="max-w-4xl">
                {activeTab === 'general' && (
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 mb-4 border-b pb-2">Basic Information</h3>
                        <dl className="space-y-3">
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Department Code</dt><dd className="col-span-2 text-sm text-slate-900 font-mono">{selectedDepartment.code || '-'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Department Name</dt><dd className="col-span-2 text-sm text-slate-900">{selectedDepartment.name || '-'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Company</dt><dd className="col-span-2 text-sm text-slate-900 font-medium">{selectedDepartment.companyName || '-'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Branch</dt><dd className="col-span-2 text-sm text-slate-900 font-medium">{selectedDepartment.branchName || '-'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Division</dt><dd className="col-span-2 text-sm text-slate-900 font-medium">{selectedDepartment.divisionName || '-'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Description</dt><dd className="col-span-2 text-sm text-slate-900 whitespace-pre-wrap">{selectedDepartment.description || '-'}</dd></div>
                        </dl>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 mb-4 border-b pb-2">Financial & Status</h3>
                        <dl className="space-y-3">
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Cost Center</dt><dd className="col-span-2 text-sm text-slate-900 font-mono">{selectedDepartment.costCenter || '-'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Manager Pos. ID</dt><dd className="col-span-2 text-sm text-slate-900 font-mono">{selectedDepartment.managerPositionId || '-'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Status</dt><dd className="col-span-2 text-sm text-slate-900">{selectedDepartment.status || '-'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Is Active</dt><dd className="col-span-2 text-sm text-slate-900">{selectedDepartment.isActive ? 'Yes' : 'No'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Created At</dt><dd className="col-span-2 text-sm text-slate-900">{new Date(selectedDepartment.createdAt).toLocaleString()}</dd></div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'audit' && (
                  <DepartmentAuditLog departmentId={selectedDepartment.id} />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-3">
             <Users className="w-12 h-12 text-slate-200" />
             <p>Select a department to view details</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">
                {formMode === 'create' ? 'Create New Department' : 'Edit Department'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {errorMsg}
                </div>
              )}
              
              <form id="department-form" onSubmit={handleSave} className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Company *</label>
                      <select value={formData.companyId || ''} onChange={e => { setFormData({...formData, companyId: e.target.value, branchId: '', divisionId: ''}); }} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white" required>
                        <option value="">Select Company</option>
                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Branch *</label>
                      <select value={formData.branchId || ''} onChange={e => setFormData({...formData, branchId: e.target.value, divisionId: ''})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white" required disabled={!formData.companyId}>
                        <option value="">Select Branch</option>
                        {filteredBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Division *</label>
                      <select value={formData.divisionId || ''} onChange={e => setFormData({...formData, divisionId: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white" required disabled={!formData.branchId}>
                        <option value="">Select Division</option>
                        {filteredDivisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Department Code *</label>
                      <input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Department Name *</label>
                      <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" required />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" rows={3} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Manager Position ID</label>
                      <input type="text" value={formData.managerPositionId || ''} onChange={e => setFormData({...formData, managerPositionId: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="UUID of Manager Position" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Cost Center</label>
                      <input type="text" value={formData.costCenter || ''} onChange={e => setFormData({...formData, costCenter: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g., CC-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                      <select value={formData.status || ''} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-3 border rounded-lg bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                      <input type="checkbox" checked={formData.isActive ?? true} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm font-medium text-slate-700">Department is Active</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
              <button form="department-form" type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Department'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DepartmentAuditLog({ departmentId }: { departmentId: string }) {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAudits();
  }, [departmentId]);

  const fetchAudits = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/org/departments/${departmentId}/audits`);
      const json = await res.json();
      if (json.success) setAudits(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-sm text-slate-500 py-4">Loading audit trail...</div>;
  if (audits.length === 0) return <div className="text-sm text-slate-500 py-4">No audit logs found.</div>;

  return (
    <div>
      <h3 className="text-sm font-medium text-slate-900 mb-4 border-b pb-2">Audit Trail</h3>
      <div className="space-y-4">
        {audits.map((audit) => (
          <div key={audit.id} className="text-sm border-l-2 border-slate-200 pl-4 py-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "px-2 py-0.5 rounded text-xs font-semibold",
                audit.action === 'CREATE' ? "bg-emerald-100 text-emerald-700" :
                audit.action === 'UPDATE' ? "bg-blue-100 text-blue-700" :
                audit.action === 'DELETE' ? "bg-red-100 text-red-700" :
                "bg-amber-100 text-amber-700"
              )}>
                {audit.action}
              </span>
              <span className="text-slate-500 text-xs flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(audit.performedAt).toLocaleString()}</span>
              <span className="text-slate-500 text-xs ml-auto">by {audit.performedBy}</span>
            </div>
            {audit.changes && (
              <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
                <pre className="whitespace-pre-wrap font-mono overflow-x-auto">
                  {JSON.stringify(JSON.parse(audit.changes), null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
