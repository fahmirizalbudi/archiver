import { HugeiconsIcon } from '@hugeicons/react';
import type { ReactNode } from 'react';

/**
 * Configuration properties for the EmptyState component.
 */
export interface EmptyStateProps {
  /**
   * Icon data object from the icon library.
   */
  icon: any;
  /**
   * Title text for the empty state.
   */
  title: string;
  /**
   * Descriptive text explaining the empty state.
   */
  description: string;
  /**
   * Optional action button or element.
   */
  action?: ReactNode;
  /**
   * Optional additional CSS classes.
   */
  className?: string;
  /**
   * Optional click handler for the entire container.
   */
  onClick?: () => void;
}

/**
 * Standardized empty state and placeholder component.
 * @param props - Component properties.
 * @returns A centered container with icon and message.
 */
const EmptyState = ({ icon, title, description, action, className = "", onClick }: EmptyStateProps) => {
  return (
    <div 
      className={`bg-white p-20 rounded-large border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center transition-all ${onClick ? 'hover:border-primary/30 cursor-pointer group' : ''} ${className}`}
      onClick={onClick}
    >
      <div className={`w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4 ${onClick ? 'group-hover:bg-primary-light group-hover:text-primary transition-colors' : ''}`}>
        <HugeiconsIcon icon={icon} size={32} />
      </div>
      <h3 className="text-gray-900 font-bold">{title}</h3>
      <p className="text-gray-400 text-sm mt-1 max-w-xs">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
