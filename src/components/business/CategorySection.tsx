import { ChevronRight } from "lucide-react";

interface CategorySectionProps {
  category: string;
  onCategorySelect?: (category: string) => void;
  onSubcategorySelect?: (category: string, subcategory: string) => void;
}

const CategorySection = ({ category, onCategorySelect, onSubcategorySelect }: CategorySectionProps) => {
  const categories = [
    "Sarees",
    "Lehengas", 
    "Ethnic Gowns",
    "Salwar Suits",
    "Ethnic Gowns",
    "Salwar Suits",
    "Salwar Suits"
  ];

  const subcategories = {
    "Lehengas": [
      { name: "Wedding Lehengas", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
      { name: "Festive Lehengas", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
      { name: "Reception Lehengas", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
      { name: "Best Sellers", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
      { name: "Bridesmaid Lehengas", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" }
    ],
    "Sarees": [
      { name: "Silk Sarees", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
      { name: "Cotton Sarees", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
      { name: "Designer Sarees", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
      { name: "Party Wear Sarees", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
      { name: "Wedding Sarees", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" }
    ],
    "Salwar Suits": [
      { name: "Anarkali Suits", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
      { name: "Straight Suits", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
      { name: "Palazzo Suits", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
      { name: "Sharara Suits", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
      { name: "Punjabi Suits", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" }
    ],
    "Ethnic Gowns": [
      { name: "Floor Length Gowns", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
      { name: "Jacket Style Gowns", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
      { name: "Cape Style Gowns", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
      { name: "Indo Western Gowns", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
      { name: "Party Gowns", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" }
    ]
  };

  const priceRanges = [
    { range: "₹999 - ₹2000", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
    { range: "₹2000 - ₹4000", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" },
    { range: "₹2000 - ₹4000", image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png" }
  ];

  const currentSubcategories = subcategories[category as keyof typeof subcategories] || subcategories["Lehengas"];

  if (!category) return null;

  return (
    <div 
      className="bg-white border-r border-[#E0DDD7]" 
      style={{
        width: '394px',
        height: '478px',
        opacity: 1,
        top: '179px',
        borderWidth: '1px'
      }}
    >
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-32 md:w-56 bg-white shadow-lg">
          <div className="p-2 md:p-4">
            <div className="space-y-1">
              {categories.map((cat, index) => (
                <div
                  key={index}
                  onClick={() => onCategorySelect?.(cat)}
                  className={`flex items-center justify-between p-1 md:p-2 rounded-lg cursor-pointer transition-colors ${
                    category === cat 
                      ? 'bg-warm-beige text-warm-brown' 
                      : 'hover:bg-warm-beige/50 text-warm-brown'
                  }`}
                >
                  <span className="font-medium text-xs md:text-sm">{cat}</span>
                  <ChevronRight className="w-2 h-2 md:w-3 md:h-3" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-hidden bg-white">
          <div className="h-full">
            {/* Shop By Category Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-warm-brown mb-4">Shop by Category</h3>
              <div className="flex gap-4 overflow-x-auto">
                {currentSubcategories.slice(0, 4).map((subcat, index) => (
                  <div 
                    key={index} 
                    className="text-center flex-shrink-0 cursor-pointer"
                    onClick={() => onSubcategorySelect?.(category, subcat.name)}
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 border-2 border-brand-orange/30 hover:border-brand-orange transition-colors">
                      <img 
                        src={subcat.image} 
                        alt={subcat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs font-medium text-warm-brown max-w-16 leading-tight mt-1">{subcat.name}</p>
                  </div>
                ))}
                <div className="text-center flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-brand-orange/20 flex items-center justify-center mx-auto mb-2 cursor-pointer hover:bg-brand-orange/30 transition-colors">
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-sm"></div>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-warm-brown">View All</p>
                </div>
              </div>
            </div>

            {/* Horizontal Separator */}
            <div className="h-px bg-border my-6"></div>

            {/* Shop by Price Section */}
            <div>
              <h3 className="text-lg font-bold text-warm-brown mb-4">Shop by Price</h3>
              <div className="flex gap-4 overflow-x-auto">
                {priceRanges.map((price, index) => (
                  <div key={index} className="text-center flex-shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 border-2 border-brand-orange/30 hover:border-brand-orange transition-colors cursor-pointer">
                      <img 
                        src={price.image} 
                        alt={`Price range ${price.range}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs font-medium text-warm-brown mt-1">{price.range}</p>
                  </div>
                ))}
                <div className="text-center flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-brand-orange/20 flex items-center justify-center mx-auto mb-2 cursor-pointer hover:bg-brand-orange/30 transition-colors">
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-sm"></div>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-warm-brown">View All</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;