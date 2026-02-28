import { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  File01Icon,
  FolderOpenIcon,
  CloudUploadIcon,
  GridViewIcon
} from '@hugeicons/core-free-icons';
import { archiveService, type ArchivedDocument } from '../../services/archiveService';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import StatCard from '../../components/UI/StatCard';

/**
 * System overview dashboard page.
 * @returns Dashboard view with metrics and recent document activity.
 */
const Dashboard = () => {
  const [recentDocs, setRecentDocs] = useState<ArchivedDocument[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAll = archiveService.getDocuments((docs) => {
      setTotalCount(docs.length);
    });

    const unsubscribeCats = archiveService.getCategories((cats) => {
      setCategoryCount(cats.length);
    });

    const unsubscribeRecent = archiveService.getRecentDocuments(5, (docs) => {
      setRecentDocs(docs);
      setLoading(false);
    });

    return () => {
      unsubscribeAll();
      unsubscribeCats();
      unsubscribeRecent();
    };
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <PageHeader 
        icon={GridViewIcon}
        title="System Overview"
        subtitle="Track your archival metrics and recent uploads"
        actions={
          <Link to="/uploads" className="btn-primary">
            <HugeiconsIcon icon={CloudUploadIcon} size={16} />
            Upload Document
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={File01Icon}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          label="Total Documents"
          value={loading ? '...' : totalCount}
        />
        <StatCard 
          icon={FolderOpenIcon}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          label="Categories"
          value={loading ? '...' : categoryCount}
        />
      </div>

      <div className="bg-white rounded-large border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Activity</h2>
          <Link to="/documents" className="text-primary text-sm font-bold">View All</Link>
        </div>
        <div className="p-0">
           {loading ? (
             <div className="h-64 flex items-center justify-center">
               <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
             </div>
           ) : recentDocs.length === 0 ? (
             <div className="h-64 flex flex-col items-center justify-center text-center px-6">
               <p className="text-gray-400 text-sm font-medium">No recent activity found.</p>
             </div>
           ) : (
             <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/30">
                    <th className="px-6 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.05em]">Filename</th>
                    <th className="px-6 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.05em]">Size</th>
                    <th className="px-6 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.05em] text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentDocs.map(doc => (
                    <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-lg ${
                              doc.format === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                           }`}>
                             <HugeiconsIcon icon={File01Icon} size={16} />
                           </div>
                           <span className="text-sm font-semibold truncate max-w-[200px]">{doc.name}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatSize(doc.size)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 text-right">{getTimeAgo(doc.uploadDate)}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
