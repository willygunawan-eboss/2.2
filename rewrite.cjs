const fs = require('fs');

function rewriteFile(filepath, entityName) {
  let content = fs.readFileSync(filepath, 'utf-8');
  
  // Strip tanstack imports
  content = content.replace(/import { useQuery, useMutation, useQueryClient } from '@tanstack\/react-query';\n/, '');
  
  // Replace queryClient
  content = content.replace(/const queryClient = useQueryClient\(\);\n/, '');

  // Add more states
  const states = `
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const [companiesData, setCompaniesData] = useState<any>(null);
  const [branchesData, setBranchesData] = useState<any>(null);
  const [divisionsData, setDivisionsData] = useState<any>(null);
  const [departmentsData, setDepartmentsData] = useState<any>(null);
  const [sectionsData, setSectionsData] = useState<any>(null);
  const [auditsData, setAuditsData] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);
  
  useEffect(() => {
    api.get('/api/org/companies?limit=100').then(res => setCompaniesData(res.data)).catch(console.error);
  }, []);
  
  useEffect(() => {
    const cid = formData.companyId || companyIdFilter;
    if (cid) api.get(\`/api/org/branches?limit=100&companyId=\${cid}\`).then(res => setBranchesData(res.data)).catch(console.error);
  }, [formData.companyId, companyIdFilter]);
  
  useEffect(() => {
    const bid = formData.branchId || branchIdFilter;
    if (bid) api.get(\`/api/org/divisions?limit=100&branchId=\${bid}\`).then(res => setDivisionsData(res.data)).catch(console.error);
  }, [formData.branchId, branchIdFilter]);
  
  useEffect(() => {
    const did = formData.divisionId || divisionIdFilter;
    if (did) api.get(\`/api/org/departments?limit=100&divisionId=\${did}\`).then(res => setDepartmentsData(res.data)).catch(console.error);
  }, [formData.divisionId, divisionIdFilter]);
  
  ${entityName === 'Team' ? `
  useEffect(() => {
    const did = formData.departmentId || departmentIdFilter;
    if (did) api.get(\`/api/org/sections?limit=100&departmentId=\${did}\`).then(res => setSectionsData(res.data)).catch(console.error);
  }, [formData.departmentId, departmentIdFilter]);
  ` : ''}
  
  const fetchEntities = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      let url = \`/api/org/${entityName.toLowerCase()}s?page=\${page}&limit=10&search=\${search}&showDeleted=\${showDeleted}\`;
      if (companyIdFilter) url += \`&companyId=\${companyIdFilter}\`;
      if (branchIdFilter) url += \`&branchId=\${branchIdFilter}\`;
      if (divisionIdFilter) url += \`&divisionId=\${divisionIdFilter}\`;
      if (departmentIdFilter) url += \`&departmentId=\${departmentIdFilter}\`;
      ${entityName === 'Team' ? "if (sectionIdFilter) url += `&sectionId=${sectionIdFilter}`;" : ""}
      const response = await api.get(url);
      setData(response.data);
    } catch (err) {
      setIsError(true);
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchEntities();
  }, [page, search, showDeleted, companyIdFilter, branchIdFilter, divisionIdFilter, departmentIdFilter${entityName === 'Team' ? ', sectionIdFilter' : ''}]);
  
  useEffect(() => {
    if (isAuditModalOpen && selected${entityName}) {
      api.get(\`/api/org/${entityName.toLowerCase()}s/\${selected${entityName}.id}/audits\`).then(res => setAuditsData(res.data)).catch(console.error);
    }
  }, [isAuditModalOpen, selected${entityName}]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      if (selected${entityName}) {
        await api.put(\`/api/org/${entityName.toLowerCase()}s/\${selected${entityName}.id}\`, formData);
      } else {
        await api.post(\`/api/org/${entityName.toLowerCase()}s\`, formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchEntities();
    } catch(err) {
      alert("Error saving");
    }
    setIsPending(false);
  };

  const deleteMutationMutate = async (id: string) => {
    try {
      await api.delete(\`/api/org/${entityName.toLowerCase()}s/\${id}\`);
      fetchEntities();
    } catch(err) {
      alert("Error deleting");
    }
  };

  const restoreMutationMutate = async (id: string) => {
    try {
      await api.post(\`/api/org/${entityName.toLowerCase()}s/\${id}/restore\`);
      fetchEntities();
    } catch(err) {
      alert("Error restoring");
    }
  };
`;

  // Remove the old query declarations
  content = content.replace(/const \{ data: companiesData \}[\s\S]*?(?=const fetch)/, '');
  content = content.replace(/const fetch.*?\n.*?\} \? \[\] \: \[this\.notDeleted\(\)\];.*?\n/s, '');
  content = content.replace(/const fetch.*?fetch[A-Za-z]+,[\s\S]*?\}\);/s, '');
  content = content.replace(/const fetch[A-Za-z]+ = async \(\) => \{[\s\S]*?\}\);/s, '');
  content = content.replace(/const \{ data, isLoading, isError \}.*?\}\);/s, '');
  content = content.replace(/const \{ data: auditsData \}[\s\S]*?\}\);/, '');
  content = content.replace(/const createMutation[\s\S]*?\}\);/, '');
  content = content.replace(/const updateMutation[\s\S]*?\}\);/, '');
  content = content.replace(/const deleteMutation[\s\S]*?\}\);/, '');
  content = content.replace(/const restoreMutation[\s\S]*?\}\);/, '');
  content = content.replace(/const handleSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?\}\;/s, '');
  
  // Inject the states
  content = content.replace(/isActive: true\n  \}\);/, `isActive: true\n  });\n\n${states}`);
  
  // Replace mutation calls
  content = content.replace(/createMutation\.isPending \|\| updateMutation\.isPending/g, "isPending");
  content = content.replace(/deleteMutation\.mutate/g, "deleteMutationMutate");
  content = content.replace(/restoreMutation\.mutate/g, "restoreMutationMutate");

  fs.writeFileSync(filepath, content);
}

rewriteFile('src/components/SectionManager.tsx', 'Section');
rewriteFile('src/components/TeamManager.tsx', 'Team');

