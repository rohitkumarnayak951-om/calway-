import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-3 sm:p-4 animate-pulse flex flex-col justify-between">
      <div>
        <div className="w-full pt-[85%] bg-gray-200 rounded-xl mb-3"></div>
        <div className="h-3 w-1/3 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-4/5 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
      </div>
      <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between">
        <div className="h-5 w-14 bg-gray-200 rounded"></div>
        <div className="h-8 w-16 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};
