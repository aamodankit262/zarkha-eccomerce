import { FC } from "react";

const HeaderMenuSkeleton: FC = () => {
  return (
    <div className="bg-white border-b border-gray-200 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between w-full">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="flex-1 flex justify-center py-3"
            >
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderMenuSkeleton;
