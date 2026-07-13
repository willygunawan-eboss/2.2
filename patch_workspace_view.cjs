const fs = require('fs');
let content = fs.readFileSync('src/pages/OrgWorkspaceView.tsx', 'utf-8');

if (!content.includes('OrganizationHealth')) {
  content = content.replace(
    "import { CEOView } from '../components/OrgWorkspace/CEOView';",
    "import { CEOView } from '../components/OrgWorkspace/CEOView';\nimport { OrganizationHealth } from '../components/OrgWorkspace/OrganizationHealth';"
  );
  
  content = content.replace(
    "import { Network, Activity, BarChart3, Layout } from 'lucide-react';",
    "import { Network, Activity, BarChart3, Layout, ShieldAlert } from 'lucide-react';"
  );
  
  content = content.replace(
    "Explorer & Insights\n            </div>\n          </button>",
    "Explorer & Insights\n            </div>\n          </button>\n          <button\n            onClick={() => setActiveTab('health')}\n            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === 'health' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800'}`}\n          >\n            <div className=\"flex items-center gap-2\">\n              <ShieldAlert className=\"w-4 h-4\" />\n              Health & Integrity\n            </div>\n          </button>"
  );
  
  content = content.replace(
    "</div>\n        )}\n\n      </div>",
    "</div>\n        )}\n\n        {activeTab === 'health' && (\n          <div className=\"fade-in\">\n            <OrganizationHealth />\n          </div>\n        )}\n\n      </div>"
  );
  
  fs.writeFileSync('src/pages/OrgWorkspaceView.tsx', content);
}
