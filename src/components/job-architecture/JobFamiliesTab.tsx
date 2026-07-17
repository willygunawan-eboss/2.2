import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { jobArchitectureApi } from '../../services/api';

export default function JobFamiliesTab() {
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    isActive: true
  });

  const loadFamilies = async () => {
    try {
      setLoading(true);
      const data = await jobArchitectureApi.getJobFamilies();
      setFamilies(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamilies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await jobArchitectureApi.updateJobFamily(editingId, formData);
      } else {
        await jobArchitectureApi.createJobFamily(formData);
      }
      setIsFormOpen(false);
      loadFamilies();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job family?')) return;
    try {
      await jobArchitectureApi.deleteJobFamily(id);
      loadFamilies();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openEdit = (family: any) => {
    setEditingId(family.id);
    setFormData({
      code: family.code,
      name: family.name,
      description: family.description || '',
      isActive: family.isActive
    });
    setIsFormOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData({ code: '', name: '', description: '', isActive: true });
    setIsFormOpen(true);
  };

  if (loading && !families.length) return <div className="text-gray-500">Loading job families...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Job Families</h2>
        <button
          onClick={openCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Job Family
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium text-gray-900">
              {editingId ? 'Edit Job Family' : 'New Job Family'}
            </h3>
            <button type="button" onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Code</label>
              <input
                type="text"
                required
                disabled={!!editingId}
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {editingId && (
              <div className="sm:col-span-2 flex items-center mt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={e => setFormData({...formData, isActive: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {editingId ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {families.map((family) => (
              <tr key={family.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {family.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {family.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    family.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {family.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEdit(family)}
                    className="text-blue-600 hover:text-blue-900 mx-2"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(family.id)}
                    className="text-red-600 hover:text-red-900 mx-2"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {families.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No job families found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
