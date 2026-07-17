import React, { useEffect, useState } from 'react';
import { Search, UserCircle, Briefcase, Calendar, MoreVertical } from 'lucide-react';

export function EmploymentDirectory() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/v2/emp/search?limit=50')
      .then(res => res.json())
      .then(data => {
        setEmployees(data.data || []);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const filteredEmployees = employees.filter(emp => 
    emp.fullName.toLowerCase().includes(search.toLowerCase()) || 
    emp.employeeNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Employment Directory</h3>
          <p className="text-sm text-slate-500 mt-1">Enterprise-wide employee records and statuses</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-64"
            />
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading directory...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Organization</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Join Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                        <UserCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{emp.fullName}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{emp.employeeNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      emp.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      emp.status === 'TERMINATED' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      {emp.employmentType}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {emp.organizationName || <span className="text-slate-400 italic">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(emp.joinDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-slate-400 hover:text-blue-600 p-1 rounded transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">
                    No employment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
