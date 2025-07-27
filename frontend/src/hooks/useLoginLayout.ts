export const useLoginLayout = () => {
  const containerClasses = "min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8";
  const wrapperClasses = "max-w-md mx-auto";
  const headerClasses = "text-center mb-8";
  const titleClasses = "text-3xl font-bold text-gray-900 mb-2";
  const subtitleClasses = "text-gray-600";
  const cardClasses = "bg-white rounded-lg shadow-lg p-6";

  return {
    containerClasses,
    wrapperClasses,
    headerClasses,
    titleClasses,
    subtitleClasses,
    cardClasses,
  };
}; 