const fs = require('fs');
let content = fs.readFileSync('src/pages/DashboardView.tsx', 'utf8');

// The stats widget looks like:
// <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-4 hover:shadow-md transition-shadow relative overflow-hidden group">
// <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300">
// <Users className="w-12 h-12 text-blue-100" />
// </div>
// <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Employees</span>
// <span className="text-2xl font-black text-blue-600">{stats.activeEmployees}</span>
// ...

const missingMasterDataWidget = `
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-800">Master Data Incomplete</h3>
              <p className="text-sm text-amber-700 mt-1 mb-4">Please set up the Enterprise Organization Structure to unlock full dashboard analytics and ERP capabilities.</p>
              <button onClick={() => { if (onNavigate) onNavigate('settings'); }} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Configure Enterprise Foundation
              </button>
            </div>
          </div>
        </div>
`;

content = content.replace(
  /<div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">/m,
  "{stats.activeEmployees === 0 && (\n" + missingMasterDataWidget + "\n)}\n<div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6\">"
);

fs.writeFileSync('src/pages/DashboardView.tsx', content);
