const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const importStr = `import JobArchitecturePlatform from './pages/JobArchitecturePlatform';`;
content = content.replace(
  'import PositionPlatform from \'./pages/PositionPlatform\';',
  'import PositionPlatform from \'./pages/PositionPlatform\';\n' + importStr
);

const routeStr = `<Route path="/job-architecture" element={<JobArchitecturePlatform />} />`;
content = content.replace(
  '<Route path="/positions" element={<PositionPlatform />} />',
  '<Route path="/positions" element={<PositionPlatform />} />\n              ' + routeStr
);

const navStr = `<Link to="/job-architecture" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Job Architecture</Link>`;
content = content.replace(
  '<Link to="/positions" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Positions</Link>',
  '<Link to="/positions" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Positions</Link>\n                ' + navStr
);

fs.writeFileSync('src/App.tsx', content);
