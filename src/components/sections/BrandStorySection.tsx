import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BrandStorySection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-warm-beige">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-warm-brown">
              Our Story
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Zarkhai, we believe that every woman deserves to feel beautiful and confident in what she wears. 
              Our journey began with a simple vision: to create timeless ethnic wear that blends traditional 
              craftsmanship with contemporary style.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From carefully sourced fabrics to intricate hand-embroidered details, every piece in our collection 
              tells a story of heritage, artistry, and elegance. We work directly with skilled artisans to bring 
              you authentic designs that celebrate the rich textile traditions of India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="brand" 
                size="lg"
                onClick={() => navigate("/about")}
              >
                Learn More About Us
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
              >
                View Collection
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="/lovable-uploads/beea47d5-6ae4-460a-a065-76f4befc19cb.png"
              alt="Traditional craftsmanship"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStorySection;