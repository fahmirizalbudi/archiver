import { NavLink } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  GridViewIcon,
  DocumentValidationIcon,
  FolderOpenIcon,
  CloudUploadIcon,
  Settings01Icon,
  Shield01Icon,
  ArrowUpDownIcon,
  ArchiveIcon,
  Search01Icon
} from '@hugeicons/core-free-icons';

const Sidebar = () => {
  return (
    <aside className="w-[300px] border-r border-gray-100 flex flex-col p-6 shrink-0 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3.5 mb-8">
        <img src="/logo.svg" alt="Archiver Logo" className="w-8 h-8" />
        <span className="text-xl font-bold tracking-tight">Archiver</span>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <HugeiconsIcon icon={Search01Icon} size={16} />
        </div>
        <input
          type="text"
          placeholder="Global search..."
          className="w-full bg-gray-50 border border-gray-200 rounded-base py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">/</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? 'sidebar-item-active' : 'text-gray-500 hover:bg-gray-50 hover:border-gray-50'}`
          }
        >
          <HugeiconsIcon icon={GridViewIcon} size={20} />
          <span className="text-[0.9375rem] font-medium">Overview</span>
        </NavLink>

        <NavLink
          to="/documents"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? 'sidebar-item-active' : 'text-gray-500 hover:bg-gray-50 hover:border-gray-50'}`
          }
        >
          <HugeiconsIcon icon={DocumentValidationIcon} size={20} />
          <span className="text-[0.9375rem] font-medium">All Documents</span>
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? 'sidebar-item-active' : 'text-gray-500 hover:bg-gray-50 hover:border-gray-50'}`
          }
        >
          <HugeiconsIcon icon={FolderOpenIcon} size={20} />
          <span className="text-[0.9375rem] font-medium">Categories</span>
        </NavLink>

        <NavLink
          to="/uploads"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? 'sidebar-item-active' : 'text-gray-500 hover:bg-gray-50 hover:border-gray-50'}`
          }
        >
          <HugeiconsIcon icon={CloudUploadIcon} size={20} />
          <span className="text-[0.9375rem] font-medium">Quick Upload</span>
        </NavLink>

        <NavLink
          to="/archive"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? 'sidebar-item-active' : 'text-gray-500 hover:bg-gray-50 hover:border-gray-50'}`
          }
        >
          <HugeiconsIcon icon={ArchiveIcon} size={20} />
          <span className="text-[0.9375rem] font-medium">Long-term Archive</span>
        </NavLink>

        <div className="pt-6 pb-2">
          <div className="h-px bg-gray-100 w-full mb-6"></div>
        </div>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? 'sidebar-item-active' : 'text-gray-500 hover:bg-gray-50 hover:border-gray-50'}`
          }
        >
          <HugeiconsIcon icon={Settings01Icon} size={20} />
          <span className="text-[0.9375rem] font-medium">Settings</span>
        </NavLink>

        <NavLink
          to="/security"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? 'sidebar-item-active' : 'text-gray-500 hover:bg-gray-50 hover:border-gray-50'}`
          }
        >
          <HugeiconsIcon icon={Shield01Icon} size={20} />
          <span className="text-[0.9375rem] font-medium">Access Control</span>
        </NavLink>
      </nav>

      {/* User */}
      <div className="mt-auto border border-gray-100 bg-gray-50 rounded-large p-3 flex items-center gap-3">
        <img src="https://ui-avatars.com/api/?name=Vincz+Da+Alonso&background=FF5C35&color=fff" alt="User" className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">Vincz Da Alonso</p>
          <p className="text-xs text-gray-400 truncate">Admin Access</p>
        </div>
        <HugeiconsIcon icon={ArrowUpDownIcon} size={16} className="text-gray-400" />
      </div>
    </aside>
  );
};

export default Sidebar;
