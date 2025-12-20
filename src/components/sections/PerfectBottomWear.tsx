import { cn } from "@/lib/utils";

const bottomWearImages = [
  {
    id: 1,
    image: "/bottom-wear-meeting.webp", // Your first image path
  },
  {
    id: 2,
    image: "/bottom-wear-occasion.webp", // Your second image path
  }
];

const ImageCard = ({ image }) => {
  return (
    <div className="rounded-2xl overflow-hidden cursor-pointer group h-80 lg:h-96 relative">
      <img 
        src={image}
        alt="Bottom wear collection"
        className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110 group-hover:contrast-110"
      />
      
      {/* Subtle overlay animation */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      {/* Floating border effect */}
      <div className="absolute inset-2 border-2 border-white/0 group-hover:border-white/30 rounded-xl transition-all duration-500 group-hover:inset-4" />
    </div>
  );
};

export default function PerfectBottomWear() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {bottomWearImages.map((item) => (
          <ImageCard
            key={item.id}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
}