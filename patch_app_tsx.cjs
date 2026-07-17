const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const importStr = `import PositionPlatform from './pages/PositionPlatform';`;
content = content.replace(
  'import AssignmentPlatform from \'./pages/AssignmentPlatform\';',
  'import AssignmentPlatform from \'./pages/AssignmentPlatform\';\n' + importStr
);

const routeStr = `<Route path="/positions" element={<PositionPlatform />} />`;
content = content.replace(
  '<Route path="/assignments" element={<AssignmentPlatform />} />',
  '<Route path="/assignments" element={<AssignmentPlatform />} />\n              ' + routeStr
);

const navStr = `<Link to="/positions" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Positions</Link>`;
content = content.replace(
  '<Link to="/assignments" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Assignments</Link>',
  '<Link to="/assignments" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Assignments</Link>\n                ' + navStr
);

fs.writeFileSync('src/App.tsx', content);
