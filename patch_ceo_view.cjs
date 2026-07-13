const fs = require('fs');
let content = fs.readFileSync('src/components/OrgWorkspace/CEOView.tsx', 'utf-8');

if (!content.includes('Integrity Score')) {
  content = content.replace(
    "api.get('/api/organization/workspace/summary').then(res => res.json()),",
    "fetch('/api/organization/workspace/summary').then(res => res.json()),"
  );
  content = content.replace(
    "api.get('/api/organization/workspace/readiness').then(res => res.json()),",
    "fetch('/api/organization/workspace/readiness').then(res => res.json()),"
  );
  
  content = content.replace(
    "api.get('/api/organization/workspace/readiness').then(res => res.json()),",
    "fetch('/api/organization/workspace/readiness').then(res => res.json()),\n      fetch('/api/organization/platform/health').then(res => res.json()),"
  );
  
  content = content.replace(
    "([summary, readiness]) => {",
    "([summary, readiness, health]) => {"
  );
  
  content = content.replace(
    "setData({ summary, readiness });",
    "setData({ summary, readiness, health });"
  );
  
  // Add another card for Integrity Score
  content = content.replace(
    "lg:grid-cols-4 gap-4",
    "lg:grid-cols-5 gap-4"
  );
  
  content = content.replace(
    "</div>\n      </div>\n    </div>",
    "</div>\n\n        <div className=\"bg-slate-800 border border-slate-700 rounded-lg p-5\">\n          <div className=\"flex items-center gap-3 mb-2\">\n            <div className=\"p-2 bg-red-500/10 text-red-400 rounded-lg\"><ShieldCheck className=\"w-5 h-5\" /></div>\n            <span className=\"text-slate-400 text-sm font-medium\">Integrity Score</span>\n          </div>\n          <div className=\"text-3xl font-bold text-white\">{data.health.integrityScore}%</div>\n        </div>\n\n      </div>\n    </div>"
  );
  
  fs.writeFileSync('src/components/OrgWorkspace/CEOView.tsx', content);
}
