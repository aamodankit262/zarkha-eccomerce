import { Truck, Headphones, RotateCcw, Shield } from "lucide-react";
import React from "react";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const FeaturesSection = () => {
  const features: Feature[] = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free Shipping all Order",
    },
    {
      icon: Headphones,
      title: "Quality Support",
      description: "Support 24/7 Hours A Day",
    },
    {
      icon: RotateCcw,
      title: "Money Return",
      description: "30 Days For Free Return",
    },
    {
      icon: Shield,
      title: "100% Payment Secure",
      description: "We Ensure Secure Payment",
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid ab 'sm' screen se 2-column ho jayega */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              // Card design aur hover effects
              <div
                key={feature.title}
                className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
              >
                {/* Icon ka container */}
                <div className="w-20 h-20 bg-[#FFE8DB] rounded-full flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-orange-200">
                  <IconComponent className="h-10 w-10 text-orange-600 transition-transform duration-300 group-hover:scale-110" />
                </div>
                {/* Text content */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-base text-gray-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;