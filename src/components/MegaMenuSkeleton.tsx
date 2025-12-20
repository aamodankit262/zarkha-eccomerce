// src/components/skeletons/MegaMenuSkeleton.tsx

import { FC } from "react";

const MegaMenuSkeleton: FC = () => {
  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-6 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Category List */}
          <div className="col-span-1 lg:col-span-3 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-10 rounded-md bg-gray-200"
              />
            ))}
          </div>

          {/* Right Content */}
          <div className="col-span-1 lg:col-span-9 grid grid-cols-1 md:grid-cols-10 gap-y-8 md:gap-x-4">
            
            {/* Subcategory Grid */}
            <div className="col-span-1 md:col-span-6 md:border-r md:border-gray-200 md:pr-10">
              <div className="h-5 w-32 bg-gray-200 rounded mb-6" />

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center space-y-2"
                  >
                    <div className="w-20 h-20 rounded-full bg-gray-200" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Price Section */}
            <div className="col-span-1 md:col-span-4 md:pl-10">
              <div className="h-5 w-28 bg-gray-200 rounded mb-6" />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center space-y-2"
                  >
                    <div className="w-20 h-20 rounded-full bg-gray-200" />
                    <div className="h-3 w-14 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuSkeleton;
