import { HugeiconsIcon } from '@hugeicons/react';
import type { ReactNode } from 'react';

/**
 * Configuration properties for the PageHeader component.
 */
export interface PageHeaderProps {
  /**
   * Icon data object from the icon library.
   */
  icon: any;
  /**
   * Main title text.
   */
  title: string;
  /**
   * Descriptive subtitle text.
   */
  subtitle: string;
  /**
   * Optional action elements to display on the right.
   */
  actions?: ReactNode;
}

/**
 * Consistent page header with icon, title, and action buttons.
 * @param props - Component properties.
 * @returns A section with icon-themed title and actions.
 */
const PageHeader = ({ icon, title, subtitle, actions }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-primary-light rounded-large flex items-center justify-center">
          <div className="bg-primary-soft p-2 rounded-base text-primary flex items-center justify-center">
            <HugeiconsIcon icon={icon} size={32} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{subtitle}</p>
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader;
