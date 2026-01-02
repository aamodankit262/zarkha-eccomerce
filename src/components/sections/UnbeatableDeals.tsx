import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const dealsData = [
  {
    id: 1,
    category: "Straight Kurtis",
    discount: 50,
    image: "/straight-kurtis-1.webp",
  },
  {
    id: 2,
    category: "Bridal Collection",
    discount: 30,
    image: "/straight-kurtis-4.webp",
  },
  {
    id: 3,
    category: "Bridal Collection",
    discount: 50,
    image: "/straight-kurtis-3.webp",
  },
  {
    id: 4,
    category: "Straight Kurtis",
    discount: 50,
    image: "/straight-kurtis-2.webp",
  },
];

const DealCard = ({ category, discount, image }) => {
  const navigate = useNavigate()
  return (
    <div
      className={cn(
        "relative h-72 sm:h-80 md:h-80 lg:h-96 rounded-xl overflow-hidden cursor-pointer group",
        "shadow-md transition-all duration-700 hover:shadow-xl hover:shadow-orange-500/20"
      )}
    >
      {/* Background Image - Fixed positioning for mobile */}
      <div
        className="absolute inset-0 bg-no-repeat transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
        style={{ 
          backgroundImage: `url(${image})`,
          backgroundPosition: 'center 0%',
          backgroundSize: 'cover'
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 transition-all duration-700 group-hover:bg-black/40" />

      {/* Border Glow */}
      <div className="absolute inset-0 rounded-xl border border-transparent transition-all duration-700 group-hover:border-orange-400/60 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]" />

      {/* Content */}
      <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end items-center text-center text-white">
        <h3 className="font-bruno-ace text-base md:text-lg font-normal leading-tight mb-2">
          {category}
        </h3>
        <div className="w-16 md:w-20 h-[2px] bg-[#FF8A18] mx-auto mb-3"></div>

        <div className="flex items-baseline my-2 md:my-3">
          <span className="font-inter text-4xl md:text-5xl lg:text-6xl font-semibold leading-none">
            {discount}
          </span>
          <div className="flex flex-col items-start ml-2 -translate-y-1 md:-translate-y-2">
            <span className="font-inter text-lg md:text-xl lg:text-2xl font-medium leading-none">
              %
            </span>
            <span className="font-inter text-lg md:text-xl lg:text-2xl font-medium leading-none">
              off
            </span>
          </div>
        </div>
        
        <button onClick={() => navigate('/products')} className="font-inter w-20 md:w-24 lg:w-28 text-[10px] md:text-xs font-semibold tracking-wider border border-orange-500 text-white rounded py-2 md:py-2.5 transition-all duration-300 hover:bg-orange-500 hover:text-white hover:scale-105 active:scale-95">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default function UnmissableDeals({dealsData}) {
  return (
    <div className="w-full mt-8 sm:mt-12">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Bruno+Ace&family=Inter:wght@400;500;600;700&display=swap');
          .font-bruno-ace { font-family: 'Bruno Ace', cursive; }
          .font-inter { font-family: 'Inter', sans-serif; }
          
          /* Ensure proper text rendering on mobile */
          @media (max-width: 640px) {
            .font-bruno-ace {
              font-weight: 400;
              letter-spacing: 0.025em;
            }
            .font-inter {
              font-weight: 600;
              letter-spacing: 0.05em;
            }
          }
        `}
      </style>
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight px-4">
            Unmissable Deals
          </h2>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-orange-500 mx-auto mt-2 sm:mt-3 md:mt-4"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {dealsData?.map((deal:any) => (
            <DealCard
              key={deal._id}
              category={deal.offer_title}
              discount={deal.discount_value}
              image={deal.banner_image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}