
export const ServiceDetailsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-40 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="h-80 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};



export const EventDetailsPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#D3D9D4]/10 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#124E66] mb-4"></div>
        <p className="text-[#2E3944]">Loading event details...</p>
      </div>
    </div>
  );
}