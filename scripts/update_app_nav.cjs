const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `  useEffect(() => {
    const handleNavigation = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActiveModule(customEvent.detail);
      }
    };
    window.addEventListener('navigate', handleNavigation);
    return () => window.removeEventListener('navigate', handleNavigation);
  }, []);

  const handleLogin = () => {`;

content = content.replace("  const handleLogin = () => {", replacement);
fs.writeFileSync('src/App.tsx', content);
