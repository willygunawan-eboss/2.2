const fs = require('fs');
let content = fs.readFileSync('src/components/HRView.tsx', 'utf8');

// Replace the top part of the modal
const modalStart = `{isAddEmployeeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Add New Employee</h2>`;

const modalReplacement = `{isAddEmployeeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {positions.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Master Position Belum Tersedia</h2>
                <p className="text-slate-500 mb-6 max-w-md">Anda harus mengonfigurasi Master Position di Setup Center sebelum dapat menambahkan pegawai baru.</p>
                <div className="flex gap-3">
                  <button onClick={() => setIsAddEmployeeModalOpen(false)} className="px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">Batal</button>
                  <button onClick={() => { setIsAddEmployeeModalOpen(false); window.dispatchEvent(new CustomEvent('navigate', { detail: 'setup_center' })); }} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">Buka Setup Center</button>
                </div>
              </div>
            ) : (
            <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Add New Employee</h2>`;

const formEnd = `</form>
          </div>
        </div>
      )}`;

const formEndReplacement = `</form>
            </>
            )}
          </div>
        </div>
      )}`;

content = content.replace(modalStart, modalReplacement).replace(formEnd, formEndReplacement);
fs.writeFileSync('src/components/HRView.tsx', content);
