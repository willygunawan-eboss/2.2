const fs = require('fs');
let content = fs.readFileSync('src/pages/DashboardView.tsx', 'utf8');

const newChartLogic = `
  const { data: employees } = useEmployees();
  let data = [];
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (!employees || employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Users className="w-10 h-10 mb-2 opacity-20" />
        <p className="text-sm">No Employee Data Available</p>
        <p className="text-xs mt-1 text-slate-500">Please complete Master Data setup.</p>
      </div>
    );
  }

  if (activeChart === 'Employment Status') {
    const active = employees.filter((e: any) => e.status === 'Active').length || 0;
    const inactive = employees.filter((e: any) => e.status !== 'Active').length || 0;
    data = [
      { name: 'Active', value: active },
      { name: 'Inactive/On Leave', value: inactive }
    ];
  } else if (activeChart === 'Length of Service') {
    let lt1 = 0, y1_3 = 0, y3_5 = 0, gt5 = 0;
    const now = new Date();
    employees.forEach((e: any) => {
       if (!e.joinDate) return;
       const join = new Date(e.joinDate);
       const diff = (now.getTime() - join.getTime()) / (1000 * 3600 * 24 * 365);
       if (diff < 1) lt1++;
       else if (diff < 3) y1_3++;
       else if (diff < 5) y3_5++;
       else gt5++;
    });
    data = [
      { name: '< 1 Year', value: lt1 },
      { name: '1-3 Years', value: y1_3 },
      { name: '3-5 Years', value: y3_5 },
      { name: '5+ Years', value: gt5 }
    ];
  } else if (activeChart === 'Job Level') {
    // We group by jobGradeId
    const counts: any = {};
    employees.forEach((e: any) => {
       const grade = e.jobGradeId || 'Unassigned';
       counts[grade] = (counts[grade] || 0) + 1;
    });
    data = Object.keys(counts).map(k => ({ name: k, value: counts[k] }));
  } else {
    data = [
      { name: 'Male', value: 0 },
      { name: 'Female', value: 0 }
    ];
  }
`;

content = content.replace(/const { data: employees } = useEmployees\(\);[\s\S]*?const COLORS = \['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'\];[\s\S]*?\}\s*return \(/m, newChartLogic + "\n  return (");

fs.writeFileSync('src/pages/DashboardView.tsx', content);
