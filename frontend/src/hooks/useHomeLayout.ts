export const useHomeLayout = () => {
  const containerClasses = "min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8";
  const wrapperClasses = "max-w-md mx-auto";
  const headerClasses = "text-center mb-8";
  const titleClasses = "text-3xl font-bold text-gray-900 mb-2";
  const subtitleClasses = "text-gray-600 mb-4";
  const cardClasses = "bg-white rounded-lg shadow-lg p-6";
  const statusClasses = "bg-green-50 border border-green-200 rounded-md p-3 mb-4";
  const statusTextClasses = "text-sm text-green-800";
  const statusPhoneClasses = "font-medium";

  return {
    containerClasses,
    wrapperClasses,
    headerClasses,
    titleClasses,
    subtitleClasses,
    cardClasses,
    statusClasses,
    statusTextClasses,
    statusPhoneClasses,
  };
}; 