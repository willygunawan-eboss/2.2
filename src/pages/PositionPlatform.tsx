import React, { useState, useEffect } from 'react';

export default function PositionPlatform() {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPositions = async (query = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/position/search?q=${query}`);
      const data = await res.json();
      if (data.success) {
        setPositions(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch positions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPositions(search);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-sans text-gray-900 tracking-tight">Position Platform</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
          Create Position
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search positions..."
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
              Search
            </button>
          </form>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Job Family</th>
                <th className="p-4 font-medium">Job Grade</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : positions.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No positions found.</td></tr>
              ) : (
                positions.map(pos => (
                  <tr key={pos.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-mono text-gray-600">{pos.code}</td>
                    <td className="p-4 text-sm font-medium text-gray-900">{pos.name}</td>
                    <td className="p-4 text-sm text-gray-600">{pos.jobFamily || '-'}</td>
                    <td className="p-4 text-sm text-gray-600">{pos.jobGrade || '-'}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pos.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {pos.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-right">
                      <button className="text-blue-600 hover:text-blue-900 font-medium">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
