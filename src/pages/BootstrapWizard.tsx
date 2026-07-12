import React, { useState } from 'react';
import { Building2, Server, Database, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function BootstrapWizard({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    companyName: '',
    adminPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.adminPassword) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success && data.status === 'bootstrapCompleted') {
        setStep(3);
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        setError(data.message || 'Bootstrap failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
            <Building2 className="w-8 h-8 text-white transform -rotate-3" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          System Bootstrap
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Initialize your ERP environment
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-200">
          
          {step === 1 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center gap-4">
                <Database className="w-12 h-12 text-slate-300" />
                <Server className="w-12 h-12 text-slate-300" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900">Welcome to ICHANGEBOSS ERP</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Your system requires initial configuration before first use. This will set up the master database and admin account.
                </p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Begin Setup
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700">Company Name</label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g. Acme Corp"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Super Admin Password</label>
                <div className="mt-1">
                  <input
                    type="password"
                    required
                    value={formData.adminPassword}
                    onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Set admin password"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">This will be the password for the 'admin' user.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Setup'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4 py-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900">Setup Complete!</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Your ERP system is now ready. Redirecting to login...
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
