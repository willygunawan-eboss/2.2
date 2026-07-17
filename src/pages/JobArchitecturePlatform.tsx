import React, { useState } from 'react';
import { Briefcase, Layers, GraduationCap } from 'lucide-react';
import JobFamiliesTab from '../components/job-architecture/JobFamiliesTab';
import JobGradesTab from '../components/job-architecture/JobGradesTab';
import JobsTab from '../components/job-architecture/JobsTab';

export default function JobArchitecturePlatform() {
  const [activeTab, setActiveTab] = useState('families');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Job Architecture Platform</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage job families, job grades, and jobs across the enterprise.
        </p>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('families')}
            className={`
              flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'families'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <Layers className="mr-2 h-5 w-5" />
            Job Families
          </button>
          
          <button
            onClick={() => setActiveTab('grades')}
            className={`
              flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'grades'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <GraduationCap className="mr-2 h-5 w-5" />
            Job Grades
          </button>
          
          <button
            onClick={() => setActiveTab('jobs')}
            className={`
              flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'jobs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <Briefcase className="mr-2 h-5 w-5" />
            Jobs
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'families' && <JobFamiliesTab />}
        {activeTab === 'grades' && <JobGradesTab />}
        {activeTab === 'jobs' && <JobsTab />}
      </div>
    </div>
  );
}
