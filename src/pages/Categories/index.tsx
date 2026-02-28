import { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  FolderOpenIcon,
  Search01Icon,
  Add02Icon,
  File01Icon,
  Sorting05Icon,
  Delete02Icon
} from '@hugeicons/core-free-icons';
import { archiveService, type DocumentCategory, type ArchivedDocument } from '../../services/archiveService';

const Categories = () => {
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [documents, setDocuments] = useState<ArchivedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Predefined color themes for new categories
  const colorThemes = [
    'bg-blue-50 text-blue-600 border-blue-100',
    'bg-red-50 text-red-600 border-red-100',
    'bg-emerald-50 text-emerald-600 border-emerald-100',
    'bg-purple-50 text-purple-600 border-purple-100',
    'bg-amber-50 text-amber-600 border-amber-100',
    'bg-indigo-50 text-indigo-600 border-indigo-100',
    'bg-pink-50 text-pink-600 border-pink-100',
    'bg-teal-50 text-teal-600 border-teal-100'
  ];

  useEffect(() => {
    // Fetch categories
    const unsubscribeCats = archiveService.getCategories((cats) => {
      setCategories(cats);
      // Only set loading to false if documents are also fetched
    });

    // Fetch documents to calculate counts per category
    const unsubscribeDocs = archiveService.getDocuments((docs) => {
      setDocuments(docs);
      setLoading(false);
    });

    // Setup initial default category if none exist
    const checkAndCreateDefault = async () => {
      // Small delay to allow initial fetch to complete
      setTimeout(async () => {
        if (categories.length === 0 && !loading) {
          try {
            await archiveService.saveCategory({
              name: 'General Archive',
              color: colorThemes[0]
            });
          } catch (e) {
            console.error("Failed to create default category", e);
          }
        }
      }, 1000);
    };
    
    checkAndCreateDefault();

    return () => {
      unsubscribeCats();
      unsubscribeDocs();
    };
  }, [categories.length, loading]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const randomColor = colorThemes[Math.floor(Math.random() * colorThemes.length)];
      await archiveService.saveCategory({
        name: newCatName.trim(),
        color: randomColor
      });
      setNewCatName('');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleDeleteCategory = async (id: string, docCount: number) => {
    if (docCount > 0) {
      alert(`Cannot delete this category because it contains ${docCount} documents. Please move or delete the documents first.`);
      return;
    }

    if (window.confirm('Are you sure you want to delete this empty category?')) {
      try {
        await archiveService.deleteCategory(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDocCountForCategory = (categoryId: string) => {
    return documents.filter(doc => doc.categoryId === categoryId).length;
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 relative">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-light rounded-large flex items-center justify-center">
            <div className="bg-primary-soft p-2 rounded-base text-primary flex items-center justify-center">
              <HugeiconsIcon icon={FolderOpenIcon} size={32} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Document Categories</h1>
            <p className="text-gray-400 text-sm mt-0.5">Organize and classify your organizational records</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
             <HugeiconsIcon icon={Sorting05Icon} size={16} className="text-gray-400" />
             Sort Layout
          </button>
          <button className="btn-primary" onClick={() => setIsCreating(true)}>
            <HugeiconsIcon icon={Add02Icon} size={16} />
            New Category
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-80 group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
            <HugeiconsIcon icon={Search01Icon} size={16} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-gray-50 border border-transparent rounded-base py-2 pl-10 pr-10 text-sm focus:outline-none focus:bg-white focus:border-primary/20 transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 border border-gray-200 px-1.5 py-0.5 rounded-md">/</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-sm text-gray-400 font-medium">Displaying {filteredCategories.length} folders</span>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center p-20">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Categories Grid */}
          {filteredCategories.map((cat) => {
            const docCount = getDocCountForCategory(cat.id);
            // Extract the base color class (e.g., 'bg-blue-50')
            const baseColorClass = cat.color.split(' ')[0] || 'bg-gray-50';
            const textColorClass = cat.color.split(' ')[1] || 'text-gray-600';

            return (
              <div key={cat.id} className="bg-white border border-gray-100 rounded-large p-6 shadow-sm hover:border-primary/30 transition-all cursor-pointer group relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${baseColorClass} ${textColorClass} rounded-base flex items-center justify-center`}>
                    <HugeiconsIcon icon={FolderOpenIcon} size={24} />
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id, docCount); }}
                    className="p-1 text-gray-300 hover:text-red-500 transition-colors z-10"
                    title={docCount > 0 ? "Cannot delete category with documents" : "Delete category"}
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={18} />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors pr-6 truncate">
                  {cat.name}
                </h3>
                
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <HugeiconsIcon icon={File01Icon} size={14} />
                  <span>{docCount} {docCount === 1 ? 'Document' : 'Documents'}</span>
                </div>
                
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-400 italic">Updated {getTimeAgo(cat.updatedAt)}</span>
                  {docCount > 0 && (
                    <div className="flex -space-x-2">
                      <img src={`https://ui-avatars.com/api/?name=User+${cat.id}&background=random`} className="w-6 h-6 rounded-full border-2 border-white" alt="user" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Create New Card trigger */}
          <div 
            onClick={() => setIsCreating(true)}
            className="border-2 border-dashed border-gray-200 rounded-large p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-primary/50 transition-all cursor-pointer group min-h-[200px]"
          >
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-light group-hover:text-primary transition-colors">
               <HugeiconsIcon icon={Add02Icon} size={24} />
            </div>
            <span className="text-sm font-bold text-gray-500 group-hover:text-primary transition-colors">Create Category</span>
          </div>
        </div>
      )}

      {/* Creation Modal Overlay */}
      {isCreating && (
        <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-large shadow-lg w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">New Category</h2>
            <form onSubmit={handleCreateCategory}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  autoFocus
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-base py-2.5 px-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="e.g., Q3 Financials, HR Policies..."
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsCreating(false); setNewCatName(''); }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={!newCatName.trim()}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
