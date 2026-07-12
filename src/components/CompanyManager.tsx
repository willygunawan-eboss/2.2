import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, CheckCircle, XCircle, Clock, Undo, MoreVertical, Building2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function CompanyManager() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
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
    fetchData();
  }, [page, search, showDeleted]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/org/companies?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&showDeleted=${showDeleted}`);
      const json = await res.json();
      if (json.success) {
        setCompanies(json.data);
        setTotal(json.pagination.total);
        if (json.data.length > 0 && !selectedCompanyId && !json.data.find((c:any) => c.id === selectedCompanyId)) {
           setSelectedCompanyId(json.data[0].id);
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
      const url = formMode === 'create' ? `/api/org/companies` : `/api/org/companies/${formData.id}`;
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
        if (formMode === 'create') setSelectedCompanyId(json.data?.id);
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
    if (!confirm("Are you sure you want to delete this company?")) return;
    try {
      const res = await fetch(`/api/org/companies/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) fetchData();
      else alert(json.message);
    } catch (e) { console.error(e); }
  };

  const handleRestore = async (id: string) => {
    if (!confirm("Are you sure you want to restore this company?")) return;
    try {
      const res = await fetch(`/api/org/companies/${id}/restore`, { method: 'POST' });
      const json = await res.json();
      if (json.success) fetchData();
      else alert(json.message);
    } catch (e) { console.error(e); }
  };

  const openCreate = () => {
    setFormMode('create');
    setFormData({ isDefault: false, isActive: true });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEdit = (item: any) => {
    setFormMode('edit');
    setFormData(item);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      {/* Left List */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col z-10">
        <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Companies</h2>
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
          <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
            <input type="checkbox" checked={showDeleted} onChange={(e) => { setShowDeleted(e.target.checked); setPage(1); }} className="rounded border-slate-300" />
            Show Deleted
          </label>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-500">Loading...</div>
          ) : companies.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">No companies found.</div>
          ) : (
            <div className="space-y-1">
              {companies.map(company => (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompanyId(company.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors border flex items-center justify-between group",
                    selectedCompanyId === company.id 
                      ? "bg-blue-50 border-blue-200" 
                      : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                  )}
                >
                  <div className="flex flex-col truncate">
                    <span className={cn(
                      "text-sm font-medium truncate",
                      selectedCompanyId === company.id ? "text-blue-900" : "text-slate-700",
                      company.deletedAt && "line-through text-slate-400"
                    )}>
                      {company.name}
                    </span>
                    <span className={cn(
                      "text-xs truncate",
                      selectedCompanyId === company.id ? "text-blue-600" : "text-slate-500"
                    )}>
                      {company.code}
                    </span>
                  </div>
                  {company.isDefault && (
                    <span className="shrink-0 ml-2 px-2 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded-full">DEFAULT</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Detail */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {selectedCompany ? (
          <>
            <div className="px-8 py-6 border-b border-slate-100 bg-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-semibold text-slate-900">{selectedCompany.name}</h1>
                  {selectedCompany.isActive ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-200/50 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 flex items-center gap-1"><XCircle className="w-3 h-3" /> Inactive</span>
                  )}
                  {selectedCompany.deletedAt && (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-medium border border-red-200/50">Deleted</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 font-mono">{selectedCompany.code} {selectedCompany.legalName ? `• ${selectedCompany.legalName}` : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(selectedCompany)} className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" /> Edit
                </button>
                {selectedCompany.deletedAt ? (
                  <button onClick={() => handleRestore(selectedCompany.id)} className="px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors flex items-center gap-2">
                    <Undo className="w-4 h-4" /> Restore
                  </button>
                ) : (
                  <button onClick={() => handleDelete(selectedCompany.id)} className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                )}
              </div>
            </div>

            <div className="px-8 border-b border-slate-100 bg-white/50">
              <div className="flex gap-6">
                {['general', 'address', 'tax', 'contact', 'branding', 'audit'].map(tab => (
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
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Company Code</dt><dd className="col-span-2 text-sm text-slate-900 font-mono">{selectedCompany.code || '-'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Company Name</dt><dd className="col-span-2 text-sm text-slate-900">{selectedCompany.name || '-'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Legal Name</dt><dd className="col-span-2 text-sm text-slate-900">{selectedCompany.legalName || '-'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Business Type</dt><dd className="col-span-2 text-sm text-slate-900">{selectedCompany.businessType || '-'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Industry</dt><dd className="col-span-2 text-sm text-slate-900">{selectedCompany.industry || '-'}</dd></div>
                        </dl>
                      </div>
                      <div>
                         <h3 className="text-sm font-medium text-slate-900 mb-4 border-b pb-2">System Preferences</h3>
                         <dl className="space-y-3">
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Currency</dt><dd className="col-span-2 text-sm text-slate-900">{selectedCompany.currency || '-'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Timezone</dt><dd className="col-span-2 text-sm text-slate-900">{selectedCompany.timezone || '-'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Language</dt><dd className="col-span-2 text-sm text-slate-900">{selectedCompany.language || '-'}</dd></div>
                        </dl>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 mb-4 border-b pb-2">Status & Meta</h3>
                        <dl className="space-y-3">
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Status</dt><dd className="col-span-2 text-sm text-slate-900">{selectedCompany.status || '-'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Is Default</dt><dd className="col-span-2 text-sm text-slate-900">{selectedCompany.isDefault ? 'Yes' : 'No'}</dd></div>
                          <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Notes</dt><dd className="col-span-2 text-sm text-slate-900 whitespace-pre-wrap">{selectedCompany.notes || '-'}</dd></div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'address' && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-4 border-b pb-2">Location</h3>
                    <dl className="space-y-4 max-w-xl">
                      <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Address Line</dt><dd className="col-span-2 text-sm text-slate-900 whitespace-pre-wrap">{selectedCompany.address || '-'}</dd></div>
                      <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">City</dt><dd className="col-span-2 text-sm text-slate-900">{selectedCompany.city || '-'}</dd></div>
                      <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Province</dt><dd className="col-span-2 text-sm text-slate-900">{selectedCompany.province || '-'}</dd></div>
                      <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Postal Code</dt><dd className="col-span-2 text-sm text-slate-900">{selectedCompany.postalCode || '-'}</dd></div>
                      <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Country</dt><dd className="col-span-2 text-sm text-slate-900">{selectedCompany.country || '-'}</dd></div>
                    </dl>
                  </div>
                )}
                {activeTab === 'tax' && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-4 border-b pb-2">Legal & Tax</h3>
                    <dl className="space-y-4 max-w-xl">
                      <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Tax Number (NPWP)</dt><dd className="col-span-2 text-sm text-slate-900">{selectedCompany.taxNumber || '-'}</dd></div>
                      <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Registration Number</dt><dd className="col-span-2 text-sm text-slate-900">{selectedCompany.registrationNumber || '-'}</dd></div>
                    </dl>
                  </div>
                )}
                {activeTab === 'contact' && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-4 border-b pb-2">Contact Info</h3>
                    <dl className="space-y-4 max-w-xl">
                      <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Email Address</dt><dd className="col-span-2 text-sm text-blue-600 hover:underline cursor-pointer">{selectedCompany.email || '-'}</dd></div>
                      <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Phone Number</dt><dd className="col-span-2 text-sm text-slate-900">{selectedCompany.phone || '-'}</dd></div>
                      <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Website</dt><dd className="col-span-2 text-sm text-blue-600 hover:underline cursor-pointer">{selectedCompany.website || '-'}</dd></div>
                    </dl>
                  </div>
                )}
                {activeTab === 'branding' && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-4 border-b pb-2">Branding</h3>
                    <dl className="space-y-4 max-w-xl">
                      <div className="grid grid-cols-3 gap-2"><dt className="text-sm text-slate-500">Logo URL</dt><dd className="col-span-2 text-sm text-slate-900 truncate">{selectedCompany.logo || '-'}</dd></div>
                    </dl>
                    {selectedCompany.logo && (
                      <div className="mt-4 p-4 border rounded-lg bg-slate-50 inline-block">
                        <img src={selectedCompany.logo} alt="Logo" className="max-h-32 object-contain" />
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'audit' && (
                  <CompanyAuditLog companyId={selectedCompany.id} />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-3">
             <Building2 className="w-12 h-12 text-slate-200" />
             <p>Select a company to view details</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">
                {formMode === 'create' ? 'Create New Company' : 'Edit Company'}
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
              
              <form id="company-form" onSubmit={handleSave} className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-4">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">General Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Company Code *</label>
                      <input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                      <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Legal Name</label>
                      <input type="text" value={formData.legalName || ''} onChange={e => setFormData({...formData, legalName: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Business Type</label>
                      <input type="text" value={formData.businessType || ''} onChange={e => setFormData({...formData, businessType: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g. LLC, Corp" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                      <input type="text" value={formData.industry || ''} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g. Technology, Retail" />
                    </div>
                  </div>
                </div>

                <div className="col-span-2 space-y-4 pt-4 border-t">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact & Address</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                      <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                      <textarea value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" rows={2} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                      <input type="text" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                      <input type="text" value={formData.country || ''} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="col-span-2 space-y-4 pt-4 border-t">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-3 border rounded-lg bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                      <input type="checkbox" checked={formData.isDefault || false} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm font-medium text-slate-700">Set as Default Company</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                      <input type="checkbox" checked={formData.isActive ?? true} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm font-medium text-slate-700">Company is Active</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
              <button form="company-form" type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Company'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompanyAuditLog({ companyId }: { companyId: string }) {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAudits();
  }, [companyId]);

  const fetchAudits = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/org/companies/${companyId}/audits`);
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
