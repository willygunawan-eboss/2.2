const fs = require('fs');

function rewriteApiToFetch(filepath) {
  let content = fs.readFileSync(filepath, 'utf-8');
  
  // Remove import api
  content = content.replace(/import api from '\.\.\/lib\/api';\n/, '');

  // replace api.get
  content = content.replace(/api\.get\((.*?)\)\.then\(res => (.*?)\(res\.data\)\)/g, "fetch($1).then(res => res.json()).then(res => $2(res.data))");

  // replace await api.get
  content = content.replace(/const response = await api\.get\((.*?)\);\n(.*?)setData\(response\.data\);/g, "const res = await fetch($1);\nconst response = await res.json();\n$2setData(response.data);");

  // replace api.post
  content = content.replace(/await api\.post\(\`(.*?)\`, formData\);/g, "await fetch(`$1`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });");

  // replace api.put
  content = content.replace(/await api\.put\(\`(.*?)\`, formData\);/g, "await fetch(`$1`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });");

  // replace api.delete
  content = content.replace(/await api\.delete\(\`(.*?)\`\);/g, "await fetch(`$1`, { method: 'DELETE' });");

  // replace api.post without body (restore)
  content = content.replace(/await api\.post\(\`(.*?)\/restore\`\);/g, "await fetch(`$1/restore`, { method: 'POST' });");

  fs.writeFileSync(filepath, content);
}

rewriteApiToFetch('src/components/SectionManager.tsx');
rewriteApiToFetch('src/components/TeamManager.tsx');
