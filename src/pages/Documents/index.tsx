import { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  File01Icon,
  Delete02Icon,
  CloudUploadIcon
} from '@hugeicons/core-free-icons';
import { archiveService, type ArchivedDocument } from '../../services/archiveService';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import EmptyState from '../../components/UI/EmptyState';

const Documents = () => {
  const [documents, setDocuments] = useState<ArchivedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubscribe = archiveService.getDocuments((docs) => {
      setDocuments(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await archiveService.deleteDocument(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <PageHeader 
        icon={File01Icon}
        title="Document Repository"
        subtitle="Access and manage all archived organizational files"
        actions={
          <Link to="/uploads" className="btn-primary">
            <HugeiconsIcon icon={CloudUploadIcon} size={16} />
            Add Document
          </Link>
        }
      />

      <div className="bg-white border border-gray-100 rounded-large shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-80 group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <HugeiconsIcon icon={Search01Icon} size={16} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, category, or format..."
                className="w-full bg-gray-50 border border-transparent rounded-base py-2 pl-10 pr-10 text-sm focus:outline-none focus:bg-white focus:border-primary/20 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 border border-gray-200 px-1.5 py-0.5 rounded-md">/</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto flex-1 flex flex-col">
          {loading ? (
            <LoadingSpinner />
          ) : filteredDocs.length === 0 ? (
            <EmptyState 
              icon={File01Icon}
              title="No documents found"
              description="Start by uploading your first document to the archive system."
              action={
                <Link to="/uploads" className="btn-primary">Upload Now</Link>
              }
            />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/30">
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.05em] border-b border-gray-50">Document Name</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.05em] border-b border-gray-50">Category</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.05em] border-b border-gray-50 text-center">Security</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.05em] border-b border-gray-50">Upload Date</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.05em] border-b border-gray-50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          doc.format === 'pdf' ? 'bg-red-50 text-red-500' : 
                          doc.format === 'docx' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'
                        }`}>
                          <HugeiconsIcon icon={File01Icon} size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors truncate">{doc.name}</p>
                          <p className="text-xs text-gray-400">{formatSize(doc.size)} • {doc.format.toUpperCase()}</p>
                        </div>
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-600">{doc.category}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">System Archive</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`status-badge ${
                          doc.security === 'Public' ? 'status-active' : 'status-leave'
                        }`}>
                          {doc.security}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-sm text-gray-500">
                         {new Date(doc.uploadDate).toLocaleDateString()}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          className="btn-icon w-8 h-8 border-none hover:bg-red-50 hover:text-red-500"
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={16} />
                        </button>
                      </div>
                    </td>
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

export default Documents;
