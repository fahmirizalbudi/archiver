import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CloudIcon,
  DatabaseIcon,
  Delete02Icon,
  UserIcon,
  InformationCircleIcon,
  Settings01Icon
} from '@hugeicons/core-free-icons';
import { archiveService } from '../../services/archiveService';
import { cloudinaryConfig } from '../../lib/cloudinary';
import PageHeader from '../../components/UI/PageHeader';

/**
 * System configuration and administrative settings page.
 * @returns Settings view with profile management and database controls.
 */
const Settings = () => {
  const [resetting, setResetting] = useState(false);

  const handleSystemReset = async () => {
    if (window.confirm('CRITICAL ACTION: This will delete ALL documents and categories from the database. This cannot be undone. Are you sure?')) {
      setResetting(true);
      try {
        await archiveService.clearAllData();
        alert('System has been reset successfully.');
      } catch (error) {
        console.error('Reset error:', error);
        alert('Failed to reset system.');
      } finally {
        setResetting(false);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-surface">
      <PageHeader 
        icon={Settings01Icon}
        title="System Settings"
        subtitle="Manage your administrative profile and core system integrations"
      />

      <div className="space-y-6">
        <section className="bg-white rounded-large border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
            <HugeiconsIcon icon={UserIcon} size={20} className="text-primary" />
            <h2 className="font-bold text-gray-900">Administrative Profile</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-6">
              <img 
                src="https://ui-avatars.com/api/?name=Vincz+Da+Alonso&background=FF5C35&color=fff" 
                alt="Admin" 
                className="w-20 h-20 rounded-full border-4 border-gray-50 shadow-sm"
              />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">Vincz Da Alonso</h3>
                <p className="text-xs text-gray-400">admin@archiver.internal</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-large border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
            <HugeiconsIcon icon={CloudIcon} size={20} className="text-blue-500" />
            <h2 className="font-bold text-gray-900">Cloud Storage Integration</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-base border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Service Provider</p>
                <p className="text-sm font-semibold text-gray-700">Cloudinary (Live)</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-base border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Cloud Name</p>
                <p className="text-sm font-mono font-semibold text-gray-700 truncate">{cloudinaryConfig.cloudName || 'Not configured'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-base text-blue-600 border border-blue-100">
              <HugeiconsIcon icon={InformationCircleIcon} size={16} />
              <p className="text-xs font-medium">Standard upload protocol is active. All archived files are stored in the primary cloud bucket.</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-large border border-gray-100 shadow-sm overflow-hidden border-red-100">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3 bg-red-50/30">
            <HugeiconsIcon icon={DatabaseIcon} size={20} className="text-red-500" />
            <h2 className="font-bold text-gray-900 text-red-600">Danger Zone</h2>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Reset All System Data</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Permanently delete all archived documents and organizational categories from the live database. This action is irreversible.
                </p>
              </div>
              <button 
                onClick={handleSystemReset}
                disabled={resetting}
                className="px-6 py-2.5 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-base hover:bg-red-50 transition-colors shrink-0 flex items-center gap-2"
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} />
                {resetting ? 'Resetting...' : 'Reset System'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
