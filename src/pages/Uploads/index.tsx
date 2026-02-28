import { HugeiconsIcon } from '@hugeicons/react';
import {
  CloudUploadIcon,
  File01Icon,
  Tick01Icon,
  InformationCircleIcon
} from '@hugeicons/core-free-icons';

const Uploads = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Document Upload</h1>
          <p className="text-gray-400 text-sm mt-0.5">Securely ingest new records into the archive system</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <HugeiconsIcon icon={File01Icon} size={16} className="text-gray-400" />
            Upload History
          </button>
          <button className="btn-primary">
            <HugeiconsIcon icon={CloudUploadIcon} size={16} />
            New Upload
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Area */}
          <div className="bg-white p-12 rounded-large border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center hover:border-primary transition-colors cursor-pointer group">
            <div className="w-20 h-20 bg-primary-light text-primary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <HugeiconsIcon icon={CloudUploadIcon} size={40} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Drag and drop documents here</h2>
            <p className="text-gray-400 mt-2 max-w-sm">Support for PDF, DOCX, XLSX and high-resolution images up to 50MB per file.</p>
            <button className="btn-primary mt-8 px-8">Browse Files</button>
          </div>

          {/* Upload Queue */}
          <div className="bg-white rounded-large border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h3 className="font-bold text-gray-900">Upload Queue</h3>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-base border border-gray-100">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <HugeiconsIcon icon={Tick01Icon} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">Tax_Return_2023_Final.pdf</p>
                    <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                       <div className="w-full h-full bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 uppercase">Completed</span>
               </div>

               <div className="flex items-center gap-4 p-4 bg-white rounded-base border border-gray-100">
                  <div className="p-2 bg-primary-light text-primary rounded-lg">
                    <HugeiconsIcon icon={CloudUploadIcon} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">Legal_Agreement_Draft.docx</p>
                    <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                       <div className="w-45% h-full bg-primary rounded-full"></div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">45%</span>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-large border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-amber-600">
               <HugeiconsIcon icon={InformationCircleIcon} size={20} />
               <h3 className="font-bold text-gray-900">Archival Guidelines</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex gap-2">
                <span className="w-1 h-1 bg-gray-300 rounded-full mt-2 shrink-0"></span>
                Ensure all documents have clear, descriptive filenames.
              </li>
              <li className="flex gap-2">
                <span className="w-1 h-1 bg-gray-300 rounded-full mt-2 shrink-0"></span>
                Check for OCR readability before final submission.
              </li>
              <li className="flex gap-2">
                <span className="w-1 h-1 bg-gray-300 rounded-full mt-2 shrink-0"></span>
                Assign appropriate security clearance levels.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uploads;
