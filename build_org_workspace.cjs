const fs = require('fs');
const path = require('path');

const orgWorkspace = `
import React from 'react';

export default function OrganizationWorkspace() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Workspace Shell */}
      <div className="flex-1 flex flex-col">
        {/* Workspace Header & Breadcrumb */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">
              <span>Enterprise</span>
              <span className="mx-2">/</span>
              <span className="font-medium text-gray-900">Organization Platform</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Organization Master</h1>
          </div>
          <div>
            <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
              Create Organization
            </button>
          </div>
        </header>

        {/* Master Detail Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Master Panel (Tree & Search) */}
          <div className="w-80 bg-white border-r flex flex-col">
            <div className="p-4 border-b">
              <input 
                type="text" 
                placeholder="Search organization..." 
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-sm text-gray-500 italic">
                Organization Tree Placeholder
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="flex-1 bg-gray-50 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Organization Selected</h3>
              <p className="text-sm text-gray-500">Select an organization from the tree to view details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/OrganizationWorkspace.tsx', orgWorkspace);
console.log("Created OrganizationWorkspace.tsx");

// Register in App.tsx routing
let appFile = fs.readFileSync('src/App.tsx', 'utf8');
if (!appFile.includes('OrganizationWorkspace')) {
  appFile = appFile.replace('import DashboardView from', 'import OrganizationWorkspace from "./pages/OrganizationWorkspace.js";\nimport DashboardView from');
  
  // Find a good place to insert the route
  if (appFile.includes('<Route path="/"')) {
    appFile = appFile.replace('<Route path="/"', '<Route path="/organization-platform" element={<OrganizationWorkspace />} />\n              <Route path="/"');
    fs.writeFileSync('src/App.tsx', appFile);
    console.log("Registered OrganizationWorkspace in App.tsx");
  }
}
