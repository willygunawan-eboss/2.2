import React, { useState, useEffect } from 'react';
import { X, Check, ChevronRight, User, Briefcase, Building, FileText, Upload, ShieldAlert, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HireEmployeeWizardProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function HireEmployeeWizard({ onClose, onSuccess }: HireEmployeeWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    employeeNumber: '',
    name: '',
    email: '',
    nationalIdentityNumber: '',
    companyId: '',
    branchId: '',
    divisionId: '',
    departmentId: '',
    jobGradeId: '',
    employmentType: 'PERMANENT',
    employmentStatus: 'PROBATION',
    organizationId: '',
    positionId: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    contractStartDate: ''
  });

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);

  // Fetch reference data (mocking for simplicity, but ideally fetching from API)
  useEffect(() => {
    // In a real app we would fetch active organizations and positions.
    const fetchData = async () => {
      try {
        const orgRes = await fetch('/api/v2/org/structure');
        if (orgRes.ok) {
          const orgData = await orgRes.json();
          // Flatten organization structure for dropdown
          const orgs = flattenTree(orgData.data || []);
          setOrganizations(orgs);
        }

        const posRes = await fetch('/api/v2/org/structure?type=POSITION');
        if (posRes.ok) {
          const posData = await posRes.json();
          // Filter positions or assuming backend filters it
          const flatPositions = flattenTree(posData.data || []).filter((p: any) => p.type === 'POSITION');
          setPositions(flatPositions);
        }
      } catch (err) {
        console.error("Error fetching orgs/positions:", err);
      }
    };
    fetchData();
  }, []);

  const flattenTree = (nodes: any[]): any[] => {
    let flat: any[] = [];
    nodes.forEach(node => {
      flat.push(node);
      if (node.children && node.children.length > 0) {
        flat = flat.concat(flattenTree(node.children));
      }
    });
    return flat;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/workforce/hire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // assuming token is used
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to hire employee');
      }
      if (onSuccess) onSuccess(); else onClose();
      window.dispatchEvent(new Event('refetch-emp'));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Personal', icon: User },
    { id: 2, name: 'Employment', icon: Briefcase },
    { id: 3, name: 'Assignment', icon: Building },
    { id: 4, name: 'Review', icon: FileText }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Hire New Employee</h2>
            <p className="text-sm text-slate-500 mt-1">Cross-platform integration wizard</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-100 -z-10"></div>
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              
              return (
                <div key={s.id} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isActive ? 'border-blue-600 bg-blue-50 text-blue-600' :
                    isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' :
                    'border-slate-200 bg-white text-slate-400'
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {s.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <X className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Business Rule Violation</h4>
                <p className="text-sm mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">Personal Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Employee Number <span className="text-red-500">*</span></label>
                  <input name="employeeNumber" value={formData.employeeNumber} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. EMP-2026-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="john.doe@enterprise.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">National Identity (NIK)</label>
                  <input name="nationalIdentityNumber" value={formData.nationalIdentityNumber} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="16-digit ID" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">Employment Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company ID <span className="text-red-500">*</span></label>
                  <input name="companyId" value={formData.companyId} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="COMP-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type <span className="text-red-500">*</span></label>
                  <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                    <option value="PERMANENT">Permanent</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="PROBATION">Probation</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Employment Status <span className="text-red-500">*</span></label>
                  <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                    <option value="ACTIVE">Active</option>
                    <option value="PROBATION">Probation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Effective Date <span className="text-red-500">*</span></label>
                  <input name="effectiveDate" type="date" value={formData.effectiveDate} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">Organizational Assignment</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Organization Unit <span className="text-red-500">*</span></label>
                  <select name="organizationId" value={formData.organizationId} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                    <option value="">Select Organization...</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>{org.name} ({org.code})</option>
                    ))}
                    {/* Fallback mock option if no orgs exist yet */}
                    {organizations.length === 0 && <option value="mock-org-1">IT Department (IT-01)</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Position <span className="text-red-500">*</span></label>
                  <select name="positionId" value={formData.positionId} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                    <option value="">Select Position...</option>
                    {positions.map(pos => (
                      <option key={pos.id} value={pos.id}>{pos.name} ({pos.code})</option>
                    ))}
                    {/* Fallback mock option if no positions exist yet */}
                    {positions.length === 0 && <option value="mock-pos-1">Software Engineer (SE-01)</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Branch ID <span className="text-red-500">*</span></label>
                  <input name="branchId" value={formData.branchId} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="BR-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Division ID <span className="text-red-500">*</span></label>
                  <input name="divisionId" value={formData.divisionId} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="DIV-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department ID <span className="text-red-500">*</span></label>
                  <input name="departmentId" value={formData.departmentId} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="DEPT-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Grade ID <span className="text-red-500">*</span></label>
                  <input name="jobGradeId" value={formData.jobGradeId} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="JG-04" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">Review & Submit</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 block mb-1">Employee Name</span>
                    <span className="font-medium text-slate-900">{formData.name || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Employee Number</span>
                    <span className="font-medium text-slate-900">{formData.employeeNumber || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Employment Type</span>
                    <span className="font-medium text-slate-900">{formData.employmentType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Effective Date</span>
                    <span className="font-medium text-slate-900">{formData.effectiveDate}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block mb-1">Organization & Position</span>
                    <span className="font-medium text-slate-900">
                      {organizations.find(o => o.id === formData.organizationId)?.name || formData.organizationId || '-'} 
                      &nbsp;&bull;&nbsp; 
                      {positions.find(p => p.id === formData.positionId)?.name || formData.positionId || '-'}
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-start gap-3 bg-blue-50/50 p-3 rounded-lg">
                  <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    Submitting this form will automatically create Employee, Employment, and Assignment records in a single distributed transaction across the Human Capital Platform. Any failure will automatically rollback the entire state.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-white flex items-center justify-between">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1 || loading}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg disabled:opacity-50 transition-colors"
          >
            Back
          </button>
          
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  Processing Transaction...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Execute Hire
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
