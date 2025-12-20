import React from "react";

const NewArrivalsSection = () => {
  return (
    <div className="relative w-full bg-[#FFE8DB] overflow-hidden">
      {/* Reduced min-height for mobile from 450px to 400px */}
      <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[650px] flex items-center justify-center">
        
        {/* Left side decorative vase image */}
        {/* Now visible on mobile, positioned at bottom-right */}
        {/* On sm screens and up, it moves back to bottom-left */}
        <div className="absolute bottom-0 right-0 z-10 sm:left-0 sm:right-auto">
          <img
            src="/hand-craft.webp"
            alt="Decor Vase"
            className="w-[80px] sm:w-[100px] md:w-[140px] lg:w-[180px] object-contain"
          />
        </div>

        {/* Decorative Circle - Hidden on mobile */}
        <div className="hidden sm:block w-96 h-96 absolute left-[14%] top-10 bg-[#F5C6A5] rounded-full opacity-60"></div>

        {/* Main Model Image - Hidden on mobile */}
        <div className="hidden sm:block w-[70%] absolute left-[-8%] bottom-0">
          <img
            src="/new-arrivals-1.webp"
            alt="New Arrival Model"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* ======== TEXT CONTENT ======== */}
        <div className="w-full px-4 text-center z-30 sm:absolute sm:w-auto sm:left-[55%] sm:top-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 sm:px-4">
          <div className="mb-2 sm:mb-4">
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light italic text-amber-600">
              Buy Now
            </span>
          </div>
          <div className="mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 tracking-wide leading-tight">
              New Arrivals
            </h1>
          </div>
          <button className="px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-white text-gray-800 border-2 border-gray-800 font-semibold text-sm sm:text-base hover:bg-gray-800 hover:text-white transition-all duration-300 shadow">
            Shop Now
          </button>
        </div>

        {/* Right side polaroid images - Hidden on mobile */}
        <div className="hidden sm:block absolute right-1 sm:right-4 md:right-8 lg:right-12 top-1/2 transform -translate-y-1/2 z-20">
          <div className="relative">
            {/* Top row polaroids */}
            <div className="flex space-x-1 sm:space-x-2 md:space-x-4 mb-2 sm:mb-4 md:mb-6">
              <div className="bg-white p-1 sm:p-2.5 md:p-3 shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <img
                  src="/new-arrivals-left.webp"
                  alt="New Arrival 1"
                  className="w-14 h-16 sm:w-20 sm:h-24 md:w-24 md:h-32 lg:w-28 lg:h-36 object-cover"
                />
              </div>

              <div className="bg-white p-1 sm:p-2.5 md:p-3 shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-300 mt-2 sm:mt-6 md:mt-8">
                <img
                  src="/new-arrivals-2.webp"
                  alt="New Arrival 2"
                  className="w-14 h-16 sm:w-20 sm:h-24 md:w-24 md:h-32 lg:w-28 lg:h-36 object-cover"
                />
              </div>
            </div>

            {/* Bottom row polaroids */}
            <div className="hidden sm:flex space-x-1 sm:space-x-2 md:space-x-4">
              <div className="bg-white p-2 sm:p-2.5 md:p-3 shadow-lg transform -rotate-12 hover:rotate-0 transition-transform duration-300">
                <img
                  src="/new-arrivals-3.webp"
                  alt="New Arrival 3"
                  className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-32 lg:w-28 lg:h-36 object-cover"
                />
              </div>

              <div className="bg-white p-2 sm:p-2.5 md:p-3 shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300 -mt-2 sm:-mt-3 md:-mt-4">
                <img
                  src="/new-arrivals-4.webp"
                  alt="New Arrival 4"
                  className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-32 lg:w-28 lg:h-36 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsSection;