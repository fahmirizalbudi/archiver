import { useState, useRef, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CloudUploadIcon,
  Tick01Icon,
  Delete02Icon,
  FolderOpenIcon
} from '@hugeicons/core-free-icons';
import { CLOUDINARY_UPLOAD_URL, cloudinaryConfig } from '../../lib/cloudinary';
import { archiveService, type DocumentCategory } from '../../services/archiveService';
import PageHeader from '../../components/UI/PageHeader';
import EmptyState from '../../components/UI/EmptyState';

const Uploads = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<{ id: string; name: string; progress: number; status: 'uploading' | 'completed' | 'error' }[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = archiveService.getCategories((cats) => {
      setCategories(cats);
      if (cats.length > 0 && !selectedCategory) {
        setSelectedCategory(cats[0].id);
      }
    });
    return () => unsubscribe();
  }, [selectedCategory]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (!selectedCategory && categories.length > 0) {
      alert("Please select a category first.");
      return;
    }

    const categoryObj = categories.find(c => c.id === selectedCategory);
    const categoryName = categoryObj ? categoryObj.name : 'General Archive';
    const categoryId = categoryObj ? categoryObj.id : 'default';

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const queueId = Math.random().toString(36).substr(2, 9);
      
      setUploadQueue(prev => [{ id: queueId, name: file.name, progress: 0, status: 'uploading' }, ...prev]);
      
      try {
        setUploading(true);
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default'); 
        formData.append('cloud_name', cloudinaryConfig.cloudName);

        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');

        const result = await response.json();

        await archiveService.saveDocument({
          name: file.name,
          url: result.secure_url,
          size: result.bytes,
          format: result.format,
          categoryId: categoryId,
          category: categoryName,
          security: 'Internal', 
          uploadDate: Date.now(),
        });

        setUploadQueue(prev => prev.map(item => 
          item.id === queueId ? { ...item, progress: 100, status: 'completed' } : item
        ));
      } catch (error) {
        console.error('Upload Error:', error);
        setUploadQueue(prev => prev.map(item => 
          item.id === queueId ? { ...item, status: 'error' } : item
        ));
      } finally {
        setUploading(false);
      }
    }
  };

  const removeQueueItem = (id: string) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <PageHeader 
        icon={CloudUploadIcon}
        title="Document Upload"
        subtitle="Securely ingest new records into the archive system"
        actions={
          <>
            <button className="btn-secondary" onClick={() => setUploadQueue([])}>
              <HugeiconsIcon icon={Delete02Icon} size={16} className="text-gray-400" />
              Clear Queue
            </button>
            <button className="btn-primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <HugeiconsIcon icon={CloudUploadIcon} size={16} />
              {uploading ? 'Processing...' : 'New Upload'}
            </button>
          </>
        }
      />

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        className="hidden" 
        multiple 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <EmptyState 
            icon={CloudUploadIcon}
            title="Drag and drop documents here"
            description="Support for PDF, DOCX, XLSX and high-resolution images up to 50MB per file."
            onClick={() => fileInputRef.current?.click()}
            action={
              <button className="btn-primary px-8" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Browse Files'}
              </button>
            }
          />

          {uploadQueue.length > 0 && (
            <div className="bg-white rounded-large border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Active Queue ({uploadQueue.length})</h3>
              </div>
              <div className="p-6 space-y-4">
                {uploadQueue.map(item => (
                  <div key={item.id} className={`flex items-center gap-4 p-4 rounded-base border ${item.status === 'completed' ? 'bg-emerald-50/30 border-emerald-100' : 'bg-white border-gray-100'}`}>
                    <div className={`p-2 rounded-lg ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-primary-light text-primary'}`}>
                      <HugeiconsIcon icon={item.status === 'completed' ? Tick01Icon : CloudUploadIcon} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                      <div className="w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${item.status === 'completed' ? 'bg-emerald-500' : item.status === 'error' ? 'bg-red-500' : 'bg-primary animate-pulse'}`} 
                          style={{ width: item.status === 'completed' ? '100%' : '60%' }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold uppercase ${item.status === 'completed' ? 'text-emerald-600' : item.status === 'error' ? 'text-red-600' : 'text-primary'}`}>
                        {item.status === 'completed' ? 'Completed' : item.status === 'error' ? 'Failed' : 'Uploading'}
                      </span>
                      <button 
                        onClick={() => removeQueueItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-large border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
               <HugeiconsIcon icon={FolderOpenIcon} size={20} className="text-primary" />
               <h3 className="font-bold text-gray-900">Destination Category</h3>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-base py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer font-medium"
            >
              <option value="" disabled>Select a category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uploads;
