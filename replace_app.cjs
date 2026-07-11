const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace BootstrapWizard import
content = content.replace("import { BootstrapWizard } from './components/BootstrapWizard';", 
  "import { SetupCenterView } from './components/SetupCenterView';\nimport { SystemReadinessView } from './components/SystemReadinessView';");

// Remove BootstrapWizard rendering in systemReady check
// Wait, the prompt says "Jika User membuka Employee. Dan Position belum tersedia... Jangan tampilkan SQLite Error. Tampilkan: Master Position belum tersedia. Tombol: Buka Setup Center."
// "Hapus konsep Bootstrap sekali pakai. Bangun ERP Setup Center... Dapat dibuka kapan saja oleh SUPER_ADMIN."
// This means systemReady shouldn't block the UI entirely anymore.
content = content.replace(/if \(!systemReady\) \{[\s\S]*?const renderContent =/m, 'const renderContent =');

// Add setup_center and system_health to the router
const routerCases = `      case 'setup_center':
        return <SetupCenterView onNavigate={setActiveModule} />;
      case 'system_health':
        return <SystemReadinessView />;
      case 'finance':`;
content = content.replace(/case 'finance':/, routerCases);

fs.writeFileSync('src/App.tsx', content);
