import { HugeiconsIcon } from '@hugeicons/react';
import {
  FolderOpenIcon,
  Search01Icon,
  Add02Icon,
  MoreVerticalIcon,
  File01Icon,
  Sorting05Icon
} from '@hugeicons/core-free-icons';

const Categories = () => {
  const categories = [
    { id: 1, name: 'Financial Reports', count: 428, color: 'bg-blue-50 text-blue-600', lastUpdate: '2 hours ago' },
    { id: 2, name: 'Legal Contracts', count: 156, color: 'bg-red-50 text-red-600', lastUpdate: '1 day ago' },
    { id: 3, name: 'Operations', count: 2431, color: 'bg-emerald-50 text-emerald-600', lastUpdate: '3 days ago' },
    { id: 4, name: 'Human Resources', count: 89, color: 'bg-purple-50 text-purple-600', lastUpdate: '5 hours ago' },
    { id: 5, name: 'Marketing Assets', count: 567, color: 'bg-amber-50 text-amber-600', lastUpdate: '1 week ago' },
    { id: 6, name: 'Technical Docs', count: 1204, color: 'bg-gray-50 text-gray-600', lastUpdate: '12 mins ago' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
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
          <button className="btn-primary">
            <HugeiconsIcon icon={Add02Icon} size={16} />
            New Category
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-96 group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
            <HugeiconsIcon icon={Search01Icon} size={16} />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full bg-white border border-gray-100 rounded-base py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
           <span className="text-sm text-gray-400 font-medium">Displaying {categories.length} folders</span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-gray-100 rounded-large p-6 shadow-sm hover:border-primary/30 transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${cat.color} rounded-base flex items-center justify-center`}>
                <HugeiconsIcon icon={FolderOpenIcon} size={24} />
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <HugeiconsIcon icon={MoreVerticalIcon} size={20} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
              {cat.name}
            </h3>
            
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
              <HugeiconsIcon icon={File01Icon} size={14} />
              <span>{cat.count} Documents</span>
            </div>
            
            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-400 italic">Updated {cat.lastUpdate}</span>
              <div className="flex -space-x-2">
                <img src={`https://ui-avatars.com/api/?name=User+${cat.id}&background=random`} className="w-6 h-6 rounded-full border-2 border-white" alt="user" />
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500">+3</div>
              </div>
            </div>
          </div>
        ))}

        {/* Create New Card */}
        <div className="border-2 border-dashed border-gray-100 rounded-large p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50/50 hover:border-primary/20 transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-light group-hover:text-primary transition-colors">
             <HugeiconsIcon icon={Add02Icon} size={24} />
          </div>
          <span className="text-sm font-bold text-gray-400 group-hover:text-primary transition-colors">Add New Category</span>
        </div>
      </div>
    </div>
  );
};

export default Categories;
