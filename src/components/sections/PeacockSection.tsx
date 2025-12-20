import React from 'react';

const PeacockSection = () => {
  return (
    <div className="w-full ">
      {/* Main Peacock Design Image */}
      <div className="w-full h-full bg-white relative overflow-hidden">
        <img 
          src="/peacock.webp" 
          alt="Zarkhai Peacock Design" 
          className="w-full h-full object-cover"
        />
             
      </div>
      {/* Bottom Copyright Bar */}
      <div className="bg-black py-2">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-white text-xs text-center">
            All Copy Rights Are Reserved @ Zarkhai.Com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PeacockSection;