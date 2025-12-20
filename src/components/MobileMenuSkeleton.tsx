import { FC } from "react";

const MobileMenuSkeleton: FC = () => {
  return (
    <div className="lg:hidden fixed top-0 left-0 w-full h-screen bg-white z-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Menu Items */}
      <div className="flex flex-col">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 border-b"
          >
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileMenuSkeleton;
