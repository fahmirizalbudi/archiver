import { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  FilterIcon,
  Sorting05Icon,
  File01Icon,
  PencilEdit01Icon,
  Delete02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Download01Icon,
  CloudUploadIcon
} from '@hugeicons/core-free-icons';
import { archiveService, type ArchivedDocument } from '../../services/archiveService';
import { Link } from 'react-router-dom';

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
      {/* Page Title */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-light rounded-large flex items-center justify-center">
            <div className="bg-primary-soft p-2 rounded-base text-primary flex items-center justify-center">
              <HugeiconsIcon icon={File01Icon} size={32} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Document Repository</h1>
            <p className="text-gray-400 text-sm mt-0.5">Access and manage all archived organizational files</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <HugeiconsIcon icon={Download01Icon} size={16} className="text-gray-400" />
            Bulk Export
          </button>
          <Link to="/uploads" className="btn-primary">
            <HugeiconsIcon icon={CloudUploadIcon} size={16} />
            Add Document
          </Link>
        </div>
      </div>

      {/* Unified Data Table Container */}
      <div className="bg-white border border-gray-100 rounded-large shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        {/* Data Table Toolbar */}
        <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4 flex-1">
            {/* Search */}
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
            <div className="h-6 w-px bg-gray-100"></div>
            {/* Filter Chips */}
            <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl">
              <button className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-white shadow-sm text-primary">All Files</button>
              <button className="px-4 py-1.5 text-xs font-medium rounded-lg text-gray-500 hover:bg-white/50 transition-all">Recent</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary py-2 px-3 border-none bg-gray-50 hover:bg-gray-100">
              <HugeiconsIcon icon={FilterIcon} size={16} />
              <span className="text-xs">Advanced</span>
            </button>
            <button className="btn-secondary py-2 px-3 border-none bg-gray-50 hover:bg-gray-100">
              <HugeiconsIcon icon={Sorting05Icon} size={16} />
            </button>
          </div>
        </div>

        {/* Modern Data Table */}
        <div className="overflow-x-auto flex-1 flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center p-20">
              <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4">
                <HugeiconsIcon icon={File01Icon} size={32} />
              </div>
              <h3 className="text-gray-900 font-bold">No documents found</h3>
              <p className="text-gray-400 text-sm mt-1 max-w-xs">Start by uploading your first document to the archive system.</p>
              <Link to="/uploads" className="btn-primary mt-6">Upload Now</Link>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/30">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">Document Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 text-center">Security</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">Upload Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 text-right">Actions</th>
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
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn-icon w-8 h-8 border-none hover:bg-gray-100">
                          <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                        </a>
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

        {/* Pagination Footer */}
        {!loading && filteredDocs.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-white shrink-0">
            <p className="text-sm text-gray-400">
              Showing <span className="text-gray-900 font-semibold">{filteredDocs.length}</span> of <span className="text-gray-900 font-semibold">{documents.length}</span> files
            </p>
            <div className="flex items-center gap-1">
              <button className="btn-icon w-8 h-8 border-none hover:bg-gray-50 text-gray-400 disabled:opacity-30" disabled>
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              </button>
              <div className="flex items-center gap-1 px-2">
                <button className="w-8 h-8 rounded-lg bg-primary/10 text-primary text-xs font-bold">1</button>
              </div>
              <button className="btn-icon w-8 h-8 border-none hover:bg-gray-50 text-gray-400 disabled:opacity-30" disabled>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
