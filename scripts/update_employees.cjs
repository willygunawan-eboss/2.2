const fs = require('fs');
let content = fs.readFileSync('src/components/EmployeesView.tsx', 'utf8');

const importReplacement = `import React from 'react';
import { Search, Filter, Plus, Users, AlertTriangle, ArrowRight } from 'lucide-react';
import { EmployeeDetailModal } from './EmployeeDetailModal';
import { useState, useEffect } from 'react';

export function EmployeesView({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dependencyError, setDependencyError] = useState('');
  
  useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(json => {
        if (json.success) setEmployees(json.data);
      });
      
    // Check dependency
    fetch('/api/bootstrap/status')
      .then(res => res.json())
      .then(json => {
        if (json.success && !json.data.details.hasPosition) {
          setDependencyError('Master Position belum tersedia.');
        }
      });
  }, []);

  if (dependencyError) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto text-center p-8">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Dependency Error</h2>
        <p className="text-slate-500 mb-6 max-w-md">{dependencyError}</p>
        <button 
          onClick={() => { if(onNavigate) onNavigate('setup_center'); }} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          Buka Setup Center
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }
`;

content = content.replace(/import React from 'react';[\s\S]*?export function EmployeesView\(\) \{[\s\S]*?setSelectedEmployee = useState\(null\);[\s\S]*?\}, \[\]\);/m, importReplacement);

fs.writeFileSync('src/components/EmployeesView.tsx', content);
