import { Button } from "@/components/ui/button";

const DealsSection = () => {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-warm-brown mb-8">
          Special Deals
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Bridal Collection Deal */}
          <div className="relative bg-gray-800 text-white rounded-xl p-8 text-center overflow-hidden min-h-[280px] flex flex-col justify-center">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3">Bridal Collection</h3>
              <div className="w-12 h-1 bg-brand-orange mx-auto mb-6"></div>
              <div className="text-6xl font-bold mb-2">50<span className="text-2xl">%</span></div>
              <div className="text-xl mb-6">Off</div>
              <Button 
                variant="outline" 
                className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
              >
                Shop Now
              </Button>
            </div>
          </div>

          {/* Wedding Special Deal */}
          <div className="relative bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-xl p-8 text-center overflow-hidden min-h-[280px] flex flex-col justify-center">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3">Wedding Special</h3>
              <div className="w-12 h-1 bg-white mx-auto mb-6"></div>
              <div className="text-6xl font-bold mb-2">40<span className="text-2xl">%</span></div>
              <div className="text-xl mb-6">Off</div>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-pink-600"
              >
                Shop Now
              </Button>
            </div>
          </div>

          {/* Festival Collection Deal */}
          <div className="relative bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl p-8 text-center overflow-hidden min-h-[280px] flex flex-col justify-center">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3">Festival Collection</h3>
              <div className="w-12 h-1 bg-white mx-auto mb-6"></div>
              <div className="text-6xl font-bold mb-2">35<span className="text-2xl">%</span></div>
              <div className="text-xl mb-6">Off</div>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-orange-600"
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;