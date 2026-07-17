const fs = require('fs');
const file = 'src/services/workforce/application/ports/IWorkforceUnitOfWork.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'create(data: any): Promise<any>;',
  'create(data: any): Promise<any>;\n  update(id: string, data: any): Promise<any>;'
);

fs.writeFileSync(file, code);

const uowFile = 'src/services/workforce/infrastructure/WorkforceUnitOfWorkImpl.ts';
if (fs.existsSync(uowFile)) {
    let uowCode = fs.readFileSync(uowFile, 'utf8');
    if (!uowCode.includes('update: async')) {
        uowCode = uowCode.replace(
            'create: async (data: any) => {',
            `update: async (id: string, data: any) => {
              const stmt = db.prepare(\`
                UPDATE employees 
                SET position_id = @positionId 
                WHERE id = @id
              \`);
              stmt.run({ id, positionId: data.positionId });
              return data;
            },
            create: async (data: any) => {`
        );
        fs.writeFileSync(uowFile, uowCode);
    }
}

