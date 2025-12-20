import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ExclusiveCollectionCarousel = ({collection}) => {
  const [currentIndex, setCurrentIndex] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const collections = collection.map((item, index) => {
    return {
      id: item._id || index,
      image: item?.image || "/assets/no_image.jpg",
      title: item.name || `Collection ${index + 1}`,
      category: item.category || "Cotton Printed",
    }
  });
  // const collections = [
  //   { id: 1, image: "/carousel-1.webp", title: "Floral Print Dress", price: "₹ 999", category: "Cotton Printed" },
  //   { id: 2, image: "/carousel-2.webp", title: "Elegant Kurta Set", price: "₹ 1299", category: "Cotton Printed" },
  //   { id: 3, image: "/carousel-3.webp", title: "Designer Anarkali", price: "₹ 899", category: "Cotton Printed" },
  //   { id: 4, image: "/carousel-4.webp", title: "Traditional Wear", price: "₹ 999", category: "Cotton Printed" },
  //   { id: 5, image: "/carousel-5.webp", title: "Casual Collection", price: "₹ 1199", category: "Cotton Printed" },
  //   { id: 6, image: "/carousel-6.webp", title: "Party Wear", price: "₹ 1499", category: "Cotton Printed" },
  //   { id: 7, image: "/carousel-7.webp", title: "Summer Special", price: "₹ 799", category: "Cotton Printed" }
  // ];

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev + 1) % collections.length);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev - 1 + collections.length) % collections.length);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  const getItemStyle = (index) => {
    const diff = index - currentIndex;
    let transform = '';
    let zIndex = 0;
    let opacity = 1;
    let scale = 1;

    if (diff === 0) {
      // Center item - main focus
      transform = 'translateX(0%) translateZ(0px) rotateY(0deg)';
      zIndex = 10;
      opacity = 1;
      scale = 1.1;
    } else if (diff === 1 || diff === -(collections.length - 1)) {
      // Immediate right - more space
      transform = 'translateX(40%) translateZ(-50px) rotateY(-15deg)';
      zIndex = 8;
      opacity = 0.9;
      scale = 0.95;
    } else if (diff === -1 || diff === collections.length - 1) {
      // Immediate left - more space
      transform = 'translateX(-40%) translateZ(-50px) rotateY(15deg)';
      zIndex = 8;
      opacity = 0.9;
      scale = 0.95;
    } else if (diff === 2 || diff === -(collections.length - 2)) {
      // Second right - more space
      transform = 'translateX(80%) translateZ(-100px) rotateY(-20deg)';
      zIndex = 6;
      opacity = 0.8;
      scale = 0.85;
    } else if (diff === -2 || diff === collections.length - 2) {
      // Second left - more space
      transform = 'translateX(-80%) translateZ(-100px) rotateY(20deg)';
      zIndex = 6;
      opacity = 0.8;
      scale = 0.85;
    } else if (diff === 3 || diff === -(collections.length - 3)) {
      // Third right - more space
      transform = 'translateX(120%) translateZ(-150px) rotateY(-25deg)';
      zIndex = 4;
      opacity = 0.7;
      scale = 0.75;
    } else if (diff === -3 || diff === collections.length - 3) {
      // Third left - more space
      transform = 'translateX(-120%) translateZ(-150px) rotateY(25deg)';
      zIndex = 4;
      opacity = 0.7;
      scale = 0.75;
    } else {
      // Hidden items - maximum space
      if (diff > 0) {
        transform = 'translateX(160%) translateZ(-200px) rotateY(-30deg)';
      } else {
        transform = 'translateX(-160%) translateZ(-200px) rotateY(30deg)';
      }
      zIndex = 2;
      opacity = 0.5;
      scale = 0.65;
    }

    return {
      transform: `${transform} scale(${scale})`,
      zIndex,
      opacity,
      transition: isTransitioning
        ? 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)'
        : 'all 0.3s ease-out'
    };
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=600&fit=crop&crop=center`;
  };

  return (
    <div className="relative w-full bg-white overflow-hidden">
      {/* Header */}
      <div className="text-center py-6 md:py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-black">
          Exclusive Collection
        </h1>
      </div>

      {/* 3D Carousel Container */}
      <div className="w-full">
        <div
          className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center"
          style={{ 
            perspective: '1200px', 
            perspectiveOrigin: 'center center',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {collections?.map((item, index) => (
              <div
                key={item.id}
                className="absolute w-56 h-80 md:w-64 md:h-96"
                style={getItemStyle(index)}
                onClick={() => {
                  if (index !== currentIndex && !isTransitioning) {
                    setIsTransitioning(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsTransitioning(false), 600);
                  }
                }}
              >
                <div className="relative w-full h-full bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                  {index === currentIndex && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-md text-center min-w-[130px]">
                      <div className="text-sm font-semibold">Starting At ₹ 999</div>
                      <div className="text-xs text-orange-400 font-medium mt-1">{item.category}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center mt-6 mb-8 space-x-4">
        <button
          onClick={prevSlide}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full shadow-md transition-all duration-300 disabled:opacity-50"
          disabled={isTransitioning}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex space-x-1">
          {collections.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (index !== currentIndex && !isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 600);
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-orange-500' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              disabled={isTransitioning}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-md transition-all duration-300 disabled:opacity-50"
          disabled={isTransitioning}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ExclusiveCollectionCarousel;