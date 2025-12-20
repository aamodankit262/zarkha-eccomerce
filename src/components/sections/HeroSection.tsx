import { useState } from "react";
// Import Swiper components and modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import SignupModal from "../auth/SignupModal";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Define the structure for a single slide
interface Slide {
  _id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
}

interface HeroSectionProps {
  slides: Slide[]; // The component now accepts an array of slides
  showSignup?: boolean;
}

const HeroSection = ({ slides, showSignup = true }: HeroSectionProps) => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] text-white">
      <Swiper
        // Install Swiper modules
        modules={[Navigation, Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        navigation={true} // This enables the navigation arrows
        pagination={{ clickable: true }} // Optional: adds dots at the bottom
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="w-full h-full"
      >
        {slides?.map((slide, index) => (
          <SwiperSlide key={slide._id || index}>
            <div
              className="relative w-full h-full bg-cover bg-center md:bg-top" // <-- HIGHLIGHT: YAHAN CHANGE KIYA HAI
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center h-full p-4">
                {slide.title && (
                  <h1 className="text-3xl md:text-6xl font-bold drop-shadow-lg mb-4">
                    {slide.title}
                  </h1>
                )}
                {slide.subtitle && (
                  <p className="mt-2 max-w-2xl text-base md:text-xl drop-shadow-md mb-6">
                    {slide.subtitle}
                  </p>
                )}
                {/* {slide.buttonText && ( */}
                  <a
                    href={slide.link || "#"}
                    className="mt-4 bg-white text-black font-semibold py-3 px-8 rounded-md hover:bg-gray-200 transition-colors shadow-lg"
                  >
                    {"Explore Collection"}
                    {/* {slide.buttonText ?? "Explore Collection"} */}
                  </a>
                {/* )} */}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {showSignup && (
        <SignupModal
          isOpen={isSignupOpen}
          onClose={() => setIsSignupOpen(false)}
        />
      )}
    </div>
  );
};

export default HeroSection;