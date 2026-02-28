import { HugeiconsIcon } from '@hugeicons/react';

/**
 * Configuration properties for the StatCard component.
 */
export interface StatCardProps {
  /**
   * Icon data object from the icon library.
   */
  icon: any;
  /**
   * CSS class for the icon background.
   */
  iconBg: string;
  /**
   * CSS class for the icon color.
   */
  iconColor: string;
  /**
   * Label text for the statistic.
   */
  label: string;
  /**
   * The numeric or string value to display.
   */
  value: string | number;
}

/**
 * Metric card component for displaying key system statistics.
 * @param props - Component properties.
 * @returns A stylized card with icon and metric value.
 */
const StatCard = ({ icon, iconBg, iconColor, label, value }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-large border border-gray-100 shadow-sm">
      <div className={`w-12 h-12 ${iconBg} ${iconColor} rounded-base flex items-center justify-center mb-4`}>
        <HugeiconsIcon icon={icon} size={24} />
      </div>
      <p className="text-gray-400 text-sm font-medium">{label}</p>
      <p className="text-3xl font-extrabold mt-1 tracking-tight text-gray-900">{value}</p>
    </div>
  );
};

export default StatCard;
