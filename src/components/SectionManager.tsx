import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Check, Eye, RefreshCw, AlertTriangle, Filter } from 'lucide-react';

export default function SectionManager() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const [companyIdFilter, setCompanyIdFilter] = useState('');
  const [branchIdFilter, setBranchIdFilter] = useState('');
  const [divisionIdFilter, setDivisionIdFilter] = useState('');
  const [departmentIdFilter, setDepartmentIdFilter] = useState('');
  
  const [formData, setFormData] = useState({
    companyId: '',
    branchId: '',
    divisionId: '',
    departmentId: '',
    code: '',
    name: '',
    description: '',
    status: 'Active',
    isActive: true
  });

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const [companiesData, setCompaniesData] = useState<any>(null);
  const [branchesData, setBranchesData] = useState<any>(null);
  const [divisionsData, setDivisionsData] = useState<any>(null);
  const [departmentsData, setDepartmentsData] = useState<any>(null);
  const [auditsData, setAuditsData] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);
  
  useEffect(() => {
    fetch('/api/org/companies?limit=100').then(res => res.json()).then(res => setCompaniesData(res.data)).catch(console.error);
  }, []);
  
  useEffect(() => {
    const cid = formData.companyId || companyIdFilter;
    if (cid) fetch(`/api/org/branches?limit=100&companyId=${cid}`).then(res => res.json()).then(res => setBranchesData(res.data)).catch(console.error);
  }, [formData.companyId, companyIdFilter]);
  
  useEffect(() => {
    const bid = formData.branchId || branchIdFilter;
    if (bid) fetch(`/api/org/divisions?limit=100&branchId=${bid}`).then(res => res.json()).then(res => setDivisionsData(res.data)).catch(console.error);
  }, [formData.branchId, branchIdFilter]);
  
  useEffect(() => {
    const did = formData.divisionId || divisionIdFilter;
    if (did) fetch(`/api/org/departments?limit=100&divisionId=${did}`).then(res => res.json()).then(res => setDepartmentsData(res.data)).catch(console.error);
  }, [formData.divisionId, divisionIdFilter]);
  
  const fetchEntities = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      let url = `/api/org/sections?page=${page}&limit=10&search=${search}&showDeleted=${showDeleted}`;
      if (companyIdFilter) url += `&companyId=${companyIdFilter}`;
      if (branchIdFilter) url += `&branchId=${branchIdFilter}`;
      if (divisionIdFilter) url += `&divisionId=${divisionIdFilter}`;
      if (departmentIdFilter) url += `&departmentId=${departmentIdFilter}`;
      const res = await fetch(url);
const response = await res.json();
      setData(response.data);
    } catch (err) {
      setIsError(true);
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchEntities();
  }, [page, search, showDeleted, companyIdFilter, branchIdFilter, divisionIdFilter, departmentIdFilter]);
  
  useEffect(() => {
    if (isAuditModalOpen && selectedSection) {
      fetch(`/api/org/sections/${selectedSection.id}/audits`).then(res => res.json()).then(res => setAuditsData(res.data)).catch(console.error);
    }
  }, [isAuditModalOpen, selectedSection]);

  const resetForm = () => {
    setFormData({
      companyId: '',
      branchId: '',
      divisionId: '',
      departmentId: '',
      code: '',
      name: '',
      description: '',
      status: 'Active',
      isActive: true
    });
    setSelectedSection(null);
  };

  const handleEdit = (section: any) => {
    setSelectedSection(section);
    setFormData({
      companyId: section.companyId,
      branchId: section.branchId,
      divisionId: section.divisionId,
      departmentId: section.departmentId,
      code: section.code,
      name: section.name,
      description: section.description || '',
      status: section.status || 'Active',
      isActive: section.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      if (selectedSection) {
        await fetch(`/api/org/sections/${selectedSection.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      } else {
        await fetch(`/api/org/sections`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      }
      setIsModalOpen(false);
      resetForm();
      fetchEntities();
    } catch(err) {
      alert("Error saving");
    }
    setIsPending(false);
  };

  const deleteMutationMutate = async (id: string) => {
    try {
      await fetch(`/api/org/sections/${id}`, { method: 'DELETE' });
      fetchEntities();
    } catch(err) {
      alert("Error deleting");
    }
  };

  const restoreMutationMutate = async (id: string) => {
    try {
      await fetch(`/api/org/sections/${id}/restore`, { method: 'POST' });
      fetchEntities();
    } catch(err) {
      alert("Error restoring");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Section Management</h2>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Section
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search sections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showDeleted"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showDeleted" className="text-sm text-gray-600">Show Deleted</label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select 
            value={companyIdFilter} 
            onChange={(e) => {
              setCompanyIdFilter(e.target.value);
              setBranchIdFilter('');
              setDivisionIdFilter('');
              setDepartmentIdFilter('');
            }}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Companies</option>
            {companiesData?.data?.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select 
            value={branchIdFilter} 
            onChange={(e) => {
              setBranchIdFilter(e.target.value);
              setDivisionIdFilter('');
              setDepartmentIdFilter('');
            }}
            disabled={!companyIdFilter}
            className="border rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
          >
            <option value="">All Branches</option>
            {branchesData?.data?.map((b: any) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <select 
            value={divisionIdFilter} 
            onChange={(e) => {
              setDivisionIdFilter(e.target.value);
              setDepartmentIdFilter('');
            }}
            disabled={!branchIdFilter}
            className="border rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
          >
            <option value="">All Divisions</option>
            {divisionsData?.data?.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <select 
            value={departmentIdFilter} 
            onChange={(e) => setDepartmentIdFilter(e.target.value)}
            disabled={!divisionIdFilter}
            className="border rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
          >
            <option value="">All Departments</option>
            {departmentsData?.data?.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : isError ? (
        <div className="text-center py-10 text-red-500">Error loading sections</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-medium text-gray-600">Code</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600">Name</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600">Department</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600">Division</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((section: any) => (
                <tr key={section.id} className={`border-b border-gray-50 hover:bg-gray-50 ${section.deletedAt ? 'bg-red-50 hover:bg-red-100' : ''}`}>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-600">{section.code}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{section.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {section.departmentName}
                    <div className="text-xs text-gray-400">{section.branchName}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{section.divisionName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${section.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {section.status || 'Active'}
                    </span>
                    {section.deletedAt && (
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Deleted
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <button
                      onClick={() => { setSelectedSection(section); setIsAuditModalOpen(true); }}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      title="View Audit Log"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {!section.deletedAt ? (
                      <>
                        <button
                          onClick={() => handleEdit(section)}
                          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this section?')) {
                              deleteMutationMutate(section.id);
                            }
                          }}
                          className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to restore this section?')) {
                            restoreMutationMutate(section.id);
                          }
                        }}
                        className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                        title="Restore"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {data?.data?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No sections found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Showing {(page - 1) * 10 + 1} to Math.min(page * 10, data?.pagination?.total || 0) of {data?.pagination?.total || 0} entries
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={!data?.data || data.data.length < 10}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedSection ? 'Edit Section' : 'Add Section'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                  <select
                    required
                    value={formData.companyId}
                    onChange={(e) => {
                      setFormData({ ...formData, companyId: e.target.value, branchId: '', divisionId: '', departmentId: '' });
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select Company</option>
                    {companiesData?.data?.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                  <select
                    required
                    value={formData.branchId}
                    onChange={(e) => {
                      setFormData({ ...formData, branchId: e.target.value, divisionId: '', departmentId: '' });
                    }}
                    disabled={!formData.companyId}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                  >
                    <option value="">Select Branch</option>
                    {branchesData?.data?.map((b: any) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Division *</label>
                  <select
                    required
                    value={formData.divisionId}
                    onChange={(e) => {
                      setFormData({ ...formData, divisionId: e.target.value, departmentId: '' });
                    }}
                    disabled={!formData.branchId}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                  >
                    <option value="">Select Division</option>
                    {divisionsData?.data?.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select
                    required
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    disabled={!formData.divisionId}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                  >
                    <option value="">Select Department</option>
                    {departmentsData?.data?.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="OnHold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                Audit Log: {selectedSection?.name}
              </h3>
              <button onClick={() => setIsAuditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {auditsData?.data?.length > 0 ? (
                <div className="space-y-4">
                  {auditsData.data.map((audit: any) => (
                    <div key={audit.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-bold rounded ${
                            audit.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                            audit.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                            audit.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {audit.action}
                          </span>
                          <span className="text-sm font-medium text-gray-700">by {audit.performedBy}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(audit.performedAt).toLocaleString()}
                        </span>
                      </div>
                      {audit.changes && (
                        <div className="mt-2 bg-white p-3 rounded border text-sm overflow-x-auto">
                          <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                            {JSON.stringify(JSON.parse(audit.changes), null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No audit logs found for this section.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
