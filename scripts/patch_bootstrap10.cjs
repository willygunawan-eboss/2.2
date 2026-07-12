const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const badCode = `    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });
    app.get("/api/system/health",`;

const goodCode = `    app.get("/api/system/health",`;

content = content.replace(badCode, goodCode);

fs.writeFileSync('server.ts', content);
console.log('patched 10');
