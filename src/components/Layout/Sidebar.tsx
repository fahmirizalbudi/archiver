import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  GridViewIcon,
  DocumentValidationIcon,
  FolderOpenIcon,
  CloudUploadIcon,
  Settings01Icon,
  ArrowUpDownIcon,
  Logout01Icon
} from '@hugeicons/core-free-icons';
import { authService } from '../../services/authService';

const Sidebar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className="w-[300px] border-r border-gray-100 flex flex-col p-6 shrink-0 bg-white relative">
      {/* Logo */}
      <div className="flex items-center gap-3.5 mb-8">
        <img src="/logo.svg" alt="Archiver Logo" className="w-8 h-8" />
        <span className="text-xl font-bold tracking-tight text-gray-900">Archiver</span>
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
      </nav>

      {/* User with Dropdown */}
      <div className="mt-auto relative" ref={menuRef}>
        {showUserMenu && (
          <div className="absolute bottom-full left-0 w-full mb-2 bg-white border border-gray-100 rounded-large shadow-xl shadow-gray-200/50 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <HugeiconsIcon icon={Logout01Icon} size={18} />
              <span className="font-bold">Sign Out</span>
            </button>
          </div>
        )}
        
        <div 
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`border border-gray-100 bg-gray-50 rounded-large p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-all active:scale-[0.98] ${showUserMenu ? 'ring-2 ring-primary/10 border-primary/20' : ''}`}
        >
          <img 
            src={`https://ui-avatars.com/api/?name=${currentUser?.email || 'User'}&background=FF5C35&color=fff`} 
            alt="User" 
            className="w-10 h-10 rounded-full object-cover shadow-sm" 
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {currentUser?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate">
              {currentUser?.email}
            </p>
          </div>
          <HugeiconsIcon icon={ArrowUpDownIcon} size={16} className={`text-gray-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
