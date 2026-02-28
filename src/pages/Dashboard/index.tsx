import { HugeiconsIcon } from '@hugeicons/react';
import {
  File01Icon,
  FolderOpenIcon,
  CloudUploadIcon,
  UserGroupIcon,
  Download01Icon
} from '@hugeicons/core-free-icons';

const Dashboard = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">System Overview</h1>
          <p className="text-gray-400 text-sm mt-0.5">Track your archival metrics and recent uploads</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <HugeiconsIcon icon={Download01Icon} size={16} className="text-gray-400" />
            Export Stats
          </button>
          <button className="btn-primary">
            <HugeiconsIcon icon={CloudUploadIcon} size={16} />
            Upload Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded-large border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-base flex items-center justify-center mb-4">
            <HugeiconsIcon icon={File01Icon} size={24} />
          </div>
          <p className="text-gray-400 text-sm font-medium">Total Documents</p>
          <p className="text-2xl font-bold mt-1">12,842</p>
          <p className="text-xs text-emerald-600 font-bold mt-2">+12% from last month</p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-6 rounded-large border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-base flex items-center justify-center mb-4">
            <HugeiconsIcon icon={FolderOpenIcon} size={24} />
          </div>
          <p className="text-gray-400 text-sm font-medium">Categories</p>
          <p className="text-2xl font-bold mt-1">48</p>
          <p className="text-xs text-gray-400 font-medium mt-2">Active organizational units</p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-6 rounded-large border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-base flex items-center justify-center mb-4">
            <HugeiconsIcon icon={CloudUploadIcon} size={24} />
          </div>
          <p className="text-gray-400 text-sm font-medium">Storage Used</p>
          <p className="text-2xl font-bold mt-1">1.2 TB</p>
          <p className="text-xs text-emerald-600 font-bold mt-2">85% Capacity</p>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white p-6 rounded-large border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-base flex items-center justify-center mb-4">
            <HugeiconsIcon icon={UserGroupIcon} size={24} />
          </div>
          <p className="text-gray-400 text-sm font-medium">System Users</p>
          <p className="text-2xl font-bold mt-1">156</p>
          <p className="text-xs text-amber-600 font-bold mt-2">12 Active Now</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-large border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Uploads</h2>
            <button className="text-primary text-sm font-bold">View All</button>
          </div>
          <div className="p-0">
             <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/30">
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filename</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Size</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                           <HugeiconsIcon icon={File01Icon} size={16} />
                         </div>
                         <span className="text-sm font-semibold">Q4_Report_2025.pdf</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">2.4 MB</td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-right">2 mins ago</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                           <HugeiconsIcon icon={File01Icon} size={16} />
                         </div>
                         <span className="text-sm font-semibold">Project_A_Specs.docx</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">1.1 MB</td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-right">15 mins ago</td>
                  </tr>
                </tbody>
             </table>
          </div>
        </div>
        
        <div className="bg-white rounded-large border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-6">Archive Health</h2>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-100 rounded-large">
             <div className="w-32 h-32 rounded-full border-8 border-emerald-500 border-t-gray-100 flex items-center justify-center">
                <span className="text-2xl font-black text-emerald-500">92%</span>
             </div>
             <p className="mt-4 text-sm font-bold text-gray-900">Optimal Integrity</p>
             <p className="text-xs text-gray-400 mt-1">Last scan 3 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
