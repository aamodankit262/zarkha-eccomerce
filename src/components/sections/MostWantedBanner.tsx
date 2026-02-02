import { useNavigate } from "react-router-dom";

export default function MostWantedBanner() {
  const navigate = useNavigate();
  return (
    <section className="relative w-full min-h-[420px] md:min-h-[500px] lg:min-h-[560px]">
      {/* Left Image */}
      <div className="absolute top-0 left-0 w-1/2 h-full">
        <img
          src="/left-banner.webp" // replace with your image
          alt="Lehenga left"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Image */}
      <div className="absolute top-0 right-0 w-1/2 h-full">
        <img
          src="/right-banner.webp" // replace with your image
          alt="Lehenga right"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Center Overlay with Shadow (No Blur) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                      w-[88%] max-w-[950px] h-auto bg-black/40 
                      rounded-lg shadow-[0_0_25px_rgba(0,0,0,0.45)] 
                      flex flex-col items-center justify-center text-center px-6 py-10">
        
        {/* Text Content inside Overlay */}
        <h2 className="text-[22px] md:text-[28px] lg:text-[32px] font-[cursive] text-white mb-2 italic">
          Most Wanted
        </h2>
        <h1 className="text-[30px] md:text-[38px] lg:text-[44px] font-bold text-yellow-400 mb-4 uppercase tracking-wide">
          Most Wanted
        </h1>
        <div className="bg-[#EBD2C0] text-[#1B131A] px-4 md:px-6 py-1.5 md:py-2 rounded-md font-medium text-[14px] md:text-[16px] mb-4 inline-block">
          Bestsellers At Unbelievable Prices
        </div>
        <p className="text-[22px] md:text-[28px] lg:text-[34px] font-semibold text-white mb-6">
          Up To 60% Off
        </p>
        <button 
         onClick={() => navigate("/products")}
        className="px-5 py-1.5 md:px-6 md:py-2 border border-white text-white font-medium text-[14px] md:text-[15px] hover:bg-white hover:text-black transition-all rounded">
          Shop Now
        </button>
      </div>
    </section>
  );
}
