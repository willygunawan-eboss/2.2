import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronRight, Activity, Upload, ShieldAlert, Search } from 'lucide-react';

interface PromoteEmployeeWizardProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function PromoteEmployeeWizard({ onClose, onSuccess }: PromoteEmployeeWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [employees, setEmployees] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    employeeNumber: '',
    companyId: 'comp-1',
    newOrganizationId: '',
    newPositionId: '',
    newJobGradeId: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    reason: ''
  });

  useEffect(() => {
    setEmployees([
      { employeeNumber: 'E001', name: 'Alice Smith', position: 'Software Engineer', organization: 'IT Dept' },
      { employeeNumber: 'E002', name: 'Bob Jones', position: 'Product Manager', organization: 'Product Dept' }
    ]);

    setOrganizations([
      { id: 'org-1', name: 'IT Department', code: 'IT' },
      { id: 'org-2', name: 'Product Department', code: 'PROD' }
    ]);

    setPositions([
      { id: 'pos-1', name: 'Senior Software Engineer', code: 'SSE' },
      { id: 'pos-2', name: 'Product Lead', code: 'PL' }
    ]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectEmployee = (empNumber: string) => {
    setFormData({ ...formData, employeeNumber: empNumber });
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/workforce/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          actor: 'HRAdmin'
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to promote employee');
      if (onSuccess) onSuccess();
      else onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-50 w-full max-w-3xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Promote Employee</h2>
            <p className="text-sm text-slate-500 mt-1">Initiate a formal employee promotion process</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex bg-slate-100 border-b border-slate-200 px-6 py-3 gap-2 text-sm shrink-0 overflow-x-auto">
          {[
            { num: 1, title: 'Select Employee' },
            { num: 2, title: 'Promotion Details' },
            { num: 3, title: 'Review' }
          ].map((s) => (
            <div key={s.num} className={`flex items-center gap-2 ${step === s.num ? 'text-blue-600 font-medium' : step > s.num ? 'text-slate-600' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === s.num ? 'bg-blue-600 text-white' : step > s.num ? 'bg-slate-300 text-slate-700' : 'bg-slate-200 text-slate-500'}`}>
                {s.num}
              </div>
              <span className="whitespace-nowrap">{s.title}</span>
              {s.num < 3 && <ChevronRight className="w-4 h-4 text-slate-300 mx-1" />}
            </div>
          ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by name or employee number..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div className="space-y-3">
                {employees.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase())).map(emp => (
                  <div 
                    key={emp.employeeNumber} 
                    onClick={() => handleSelectEmployee(emp.employeeNumber)}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
                  >
                    <div>
                      <h4 className="font-medium text-slate-900">{emp.name}</h4>
                      <p className="text-sm text-slate-500">{emp.employeeNumber} &bull; {emp.position} &bull; {emp.organization}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New Organization <span className="text-red-500">*</span></label>
                  <select name="newOrganizationId" value={formData.newOrganizationId} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="">Select Organization...</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>{org.name} ({org.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New Position <span className="text-red-500">*</span></label>
                  <select name="newPositionId" value={formData.newPositionId} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="">Select Position...</option>
                    {positions.map(pos => (
                      <option key={pos.id} value={pos.id}>{pos.name} ({pos.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New Job Grade</label>
                  <input name="newJobGradeId" type="text" value={formData.newJobGradeId} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. JG-05" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Effective Date <span className="text-red-500">*</span></label>
                  <input name="effectiveDate" type="date" value={formData.effectiveDate} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Promotion Reason <span className="text-red-500">*</span></label>
                  <textarea name="reason" value={formData.reason} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Explain the reason for this promotion..."></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 block mb-1">Employee</span>
                    <span className="font-medium text-slate-900">{employees.find(e => e.employeeNumber === formData.employeeNumber)?.name || formData.employeeNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Effective Date</span>
                    <span className="font-medium text-slate-900">{formData.effectiveDate}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block mb-1">New Assignment</span>
                    <span className="font-medium text-slate-900">
                      {organizations.find(o => o.id === formData.newOrganizationId)?.name || '-'} &bull; {positions.find(p => p.id === formData.newPositionId)?.name || '-'}
                      {formData.newJobGradeId ? ` (Grade: ${formData.newJobGradeId})` : ''}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block mb-1">Reason</span>
                    <span className="font-medium text-slate-900">{formData.reason}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-start gap-3 bg-blue-50/50 p-3 rounded-lg">
                  <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    Executing this promotion will automatically terminate the current assignment and create a new one. Depending on business policy, this may trigger an approval workflow.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 bg-white flex items-center justify-between">
          <button
            onClick={() => step === 1 ? onClose() : setStep(step - 1)}
            disabled={loading}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg disabled:opacity-50 transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !formData.employeeNumber}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Confirm Promotion
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
