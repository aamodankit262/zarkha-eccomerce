import { NO_IMAGE } from "@/api/endpoints";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const categoryData = [
  {
    id: 1,
    label: "CASUAL",
    image: "/casual-wear-1.webp",
  },
  {
    id: 2,
    label: "WORK",
    image: "/casual-wear-2.webp",
  },
  {
    id: 3,
    label: "FESTIVE",
    image: "/casual-wear-3.webp",
  },
];

const CategoryCard = ({ title, subtitle, image, link}) => {
  const navigate = useNavigate();
  console.log(image ,'.....')
  return (
    <div 
    onClick={() => navigate(link)}
    className="relative rounded-2xl overflow-hidden h-96 cursor-pointer transition-all duration-500 hover:scale-105 group shadow-sm">
      {/* Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500"
        style={{
          backgroundImage: `url("${encodeURI(image)}")`,
        }}
        // style={{ backgroundImage: `url(${image})` }}
      />
    </div>
  );
};

export default function MonthStartSpecial({banner}) {
  if (!banner?.length) return null;
  console.log(banner, 'banner')
  const categoryData = [
  {
    id: 1,
    label: "CASUAL",
    image: "/casual-wear-1.webp",
  },
  {
    id: 2,
    label: "WORK",
    image: "/casual-wear-2.webp",
  },
  {
    id: 3,
    label: "FESTIVE",
    image: "/casual-wear-3.webp",
  },
];
  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      <div className="bg-white rounded-3xl shadow-lg px-6 py-10 lg:px-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          
          {/* Left Content Section (smaller width) */}
          <div className="lg:col-span-1 space-y-5">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
              Month Start <br /> Special
            </h2>

            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting
              Industry. Lorem Ipsum Has Been The Industry's Standard Dummy Text
              Ever Since The 1500s.
            </p>

            <button className="inline-flex items-center px-5 py-2.5 border border-gray-900 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300">
              Shop Now
            </button>
          </div>

          {/* Right Images Section (bigger width) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {banner.map((item) => (
              <CategoryCard
                key={item._id}
                title={item.title}
                subtitle={item.subtitle}
                image={item.image}
                link={item.link}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
