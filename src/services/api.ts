export const fetchApi = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }
  
  if (response.status !== 204) {
    return response.json();
  }
};

export const jobArchitectureApi = {
  getJobFamilies: async () => fetchApi('/api/job-architecture/families'),
  getJobFamily: async (id: string) => fetchApi(`/api/job-architecture/families/${id}`),
  createJobFamily: async (data: any) => fetchApi('/api/job-architecture/families', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateJobFamily: async (id: string, data: any) => fetchApi(`/api/job-architecture/families/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteJobFamily: async (id: string) => fetchApi(`/api/job-architecture/families/${id}`, {
    method: 'DELETE',
  }),

  getJobGrades: async () => fetchApi('/api/job-architecture/grades'),
  getJobGrade: async (id: string) => fetchApi(`/api/job-architecture/grades/${id}`),
  createJobGrade: async (data: any) => fetchApi('/api/job-architecture/grades', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateJobGrade: async (id: string, data: any) => fetchApi(`/api/job-architecture/grades/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteJobGrade: async (id: string) => fetchApi(`/api/job-architecture/grades/${id}`, {
    method: 'DELETE',
  }),

  getJobs: async () => fetchApi('/api/job-architecture/jobs'),
  getJob: async (id: string) => fetchApi(`/api/job-architecture/jobs/${id}`),
  createJob: async (data: any) => fetchApi('/api/job-architecture/jobs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateJob: async (id: string, data: any) => fetchApi(`/api/job-architecture/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteJob: async (id: string) => fetchApi(`/api/job-architecture/jobs/${id}`, {
    method: 'DELETE',
  }),
};
