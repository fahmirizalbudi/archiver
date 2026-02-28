/**
 * Global loading spinner component.
 * @returns A centered spinner within a full-width container.
 */
const LoadingSpinner = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-20">
      <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
