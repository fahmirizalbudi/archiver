import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon
} from '@hugeicons/core-free-icons';

/**
 * Configuration properties for the Header component.
 */
export interface HeaderProps {
  /**
   * Display name of the current active page.
   */
  pageTitle: string;
}

/**
 * Top navigation header component with breadcrumbs and history navigation.
 * @param props - Component properties.
 * @returns A header element with navigation controls and title.
 */
const Header = ({ pageTitle }: HeaderProps) => {
  return (
    <header className="px-8 py-5 flex items-center justify-between border-b border-gray-100 bg-white shrink-0">
      <div className="flex items-center gap-4">
        <button 
          className="btn-icon" 
          onClick={() => window.history.back()}
          title="Go back"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Archiver</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{pageTitle}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
