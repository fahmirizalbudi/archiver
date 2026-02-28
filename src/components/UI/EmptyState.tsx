import { HugeiconsIcon } from '@hugeicons/react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: any;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  onClick?: () => void;
}

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
