import { useState, useRef, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CloudUploadIcon,
  Tick01Icon,
  InformationCircleIcon,
  Delete02Icon,
  FolderOpenIcon
} from '@hugeicons/core-free-icons';
import { CLOUDINARY_UPLOAD_URL, cloudinaryConfig } from '../../lib/cloudinary';
import { archiveService, type DocumentCategory } from '../../services/archiveService';

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
        
        // Prepare FormData for Cloudinary
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

        // Save metadata to Firebase
        await archiveService.saveDocument({
          name: file.name,
          url: result.secure_url,
          size: result.bytes,
          format: result.format,
          categoryId: categoryId,
          category: categoryName,
          security: 'Internal', // Default security
          uploadDate: Date.now(),
        });

        // Update queue status
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Document Upload</h1>
          <p className="text-gray-400 text-sm mt-0.5">Securely ingest new records into the archive system</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary" onClick={() => setUploadQueue([])}>
            <HugeiconsIcon icon={Delete02Icon} size={16} className="text-gray-400" />
            Clear Queue
          </button>
          <button className="btn-primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <HugeiconsIcon icon={CloudUploadIcon} size={16} />
            {uploading ? 'Processing...' : 'New Upload'}
          </button>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        className="hidden" 
        multiple 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Area */}
          <div 
            className="bg-white p-12 rounded-large border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center hover:border-primary transition-colors cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-20 h-20 bg-primary-light text-primary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <HugeiconsIcon icon={CloudUploadIcon} size={40} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Drag and drop documents here</h2>
            <p className="text-gray-400 mt-2 max-w-sm">Support for PDF, DOCX, XLSX and high-resolution images up to 50MB per file.</p>
            <button className="btn-primary mt-8 px-8" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Browse Files'}
            </button>
          </div>

          {/* Upload Queue */}
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

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-large border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
               <HugeiconsIcon icon={FolderOpenIcon} size={20} className="text-primary" />
               <h3 className="font-bold text-gray-900">Destination Category</h3>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-base py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="" disabled>Select a category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-white p-6 rounded-large border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-amber-600">
               <HugeiconsIcon icon={InformationCircleIcon} size={20} />
               <h3 className="font-bold text-gray-900">Archival Guidelines</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full mt-1.5 shrink-0"></span>
                Ensure all documents have clear, descriptive filenames.
              </li>
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full mt-1.5 shrink-0"></span>
                Standard categorization helps global discovery.
              </li>
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full mt-1.5 shrink-0"></span>
                Assign appropriate security clearance levels.
              </li>
            </ul>
          </div>
          
          <div className="bg-primary/5 p-6 rounded-large border border-primary/10">
            <h4 className="font-bold text-sm text-primary mb-2">Pro Tip</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              You can upload multiple files at once. The system will process each document and securely archive it in your repository.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uploads;
