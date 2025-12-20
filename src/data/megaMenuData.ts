export interface ShopByItem {
  name: string;
  image?: string;
  isViewAll?: boolean;
}

export interface ShopByPriceItem {
  range: string;
  image: string;
}

export interface RightContentItem {
  shopBy: ShopByItem[];
  shopByPrice: ShopByPriceItem[];
  more: string[];
}

export interface CategoryData {
  leftSidebar: string[];
  rightContent: {
    [key: string]: RightContentItem;
  };
}

export interface MegaMenuData {
  [key: string]: CategoryData;
}

export const megaMenuData: MegaMenuData = {
  Lehengas: {
    leftSidebar: [
      "All Lehengas",
      "Bridal Lehengas",
      "Reception Lehengas",
      "Engagement Lehengas",
      "Sangeet Lehengas",
      "Festive Lehengas",
      "Embroidered Lehengas",
      "Silk Lehengas",
      "Velvet Lehengas",
      "Net Lehengas",
      "Designer Lehengas",
      "Readymade Lehengas",
      "Crop Top Lehengas",
    ],
    rightContent: {
      "All Lehengas": {
        shopBy: [
          { name: "View All", isViewAll: true },
          {
            name: "Embroidered Lehenga",
            image: "/mega-menu-1.webp",
          },
          {
            name: "Festive Lehengas",
            image: "/mega-menu-2.webp",
          },
          {
            name: "Party Lehengas",
            image: "/mega-menu-3.webp",
          },
          {
            name: "Haldi Ceremony",
            image: "/mega-menu-4.webp",
          },
          {
            name: "Bridal Lehengas",
            image: "/mega-menu-5.webp",
          },
          {
            name: "Wedding Lehengas",
            image: "/mega-menu-6.webp",
          },
          {
            name: "Best Sellers",
            image: "/mega-menu-7.webp",
          },
        ],
        shopByPrice: [
          {
            range: "₹999 - ₹2000",
            image: "/mega-menu-price-1.webp",
          },
          {
            range: "₹2000 - ₹4000",
            image: "/mega-menu-price-2.webp",
          },
          {
            range: "Above ₹4000",
            image: "/mega-menu-price-3.webp",
          },
        ],
        more: [
          "New Arrival",
          "On Sale",
          "Trending Now",
          "Classic Styles",
          "Modern Designs",
          "Party Wear",
        ],
      },
      "Bridal Lehengas": {
        shopBy: [
          { name: "View All", isViewAll: true },
          {
            name: "Red Bridal",
            image: "/mega-menu-1.webp",
          },
          {
            name: "Velvet Bridal",
            image: "/mega-menu-2.webp",
          },
          {
            name: "Zari Work",
            image: "/mega-menu-3.webp",
          },
        ],
        shopByPrice: [
          {
            range: "₹5000 - ₹10000",
            image: "/mega-menu-price-1.webp",
          },
          {
            range: "₹10000 - ₹20000",
            image: "/mega-menu-price-2.webp",
          },
          {
            range: "Above ₹20000",
            image: "/mega-menu-price-3.webp",
          },
        ],
        more: ["Latest Collection", "Top Rated", "Royal Designs"],
      },
    },
  },
  Kurtis: {
    leftSidebar: [
      "All Kurtis",
      "Anarkali Kurtis",
      "Straight Kurtis",
      "A-Line Kurtis",
      "Short Kurtis",
      "Long Kurtis",
      "Designer Kurtis",
      "Cotton Kurtis",
      "Silk Kurtis",
    ],
    rightContent: {
      "All Kurtis": {
        shopBy: [
          { name: "View All", isViewAll: true },
          {
            name: "Printed Kurtis",
            image: "/mega-menu-1.webp",
          },
          {
            name: "Embroidered",
            image: "/mega-menu-2.webp",
          },
          {
            name: "Daily Wear",
            image: "/mega-menu-3.webp",
          },
        ],
        shopByPrice: [
          {
            range: "Under ₹500",
            image: "/mega-menu-price-1.webp",
          },
          {
            range: "₹500 - ₹1000",
            image: "/mega-menu-price-2.webp",
          },
          {
            range: "₹1000 - ₹1500",
            image: "/mega-menu-price-3.webp",
          },
        ],
        more: ["New Arrivals", "Party Wear", "Office Wear"],
      },
    },
  },
  Sarees: {
    leftSidebar: [
      "All Sarees",
      "Banarasi Sarees",
      "Silk Sarees",
      "Cotton Sarees",
      "Designer Sarees",
    ],
    rightContent: {
      "All Sarees": {
        shopBy: [
          { name: "View All", isViewAll: true },
          {
            name: "Traditional",
            image: "/mega-menu-1.webp",
          },
          {
            name: "Modern",
            image: "/mega-menu-3.webp",
          },
          {
            name: "Party Wear",
            image: "/mega-menu-6.webp",
          },
        ],
        shopByPrice: [
          {
            range: "Under ₹1000",
            image: "/mega-menu-1.webp",
          },
          {
            range: "₹1000 - ₹2500",
            image: "/mega-menu-2.webp",
          },
          {
            range: "Above ₹2500",
            image: "/mega-menu-3.webp",
          },
        ],
        more: ["New Arrivals", "Best Sellers", "Wedding Collection"],
      },
    },
  },
  "Salwar Suits": {
    leftSidebar: [
      "All Salwar Suits",
      "Anarkali Suits",
      "Punjabi Suits",
      "Palazzo Suits",
      "Churidar Suits",
    ],
    rightContent: {
      "All Salwar Suits": {
        shopBy: [
          { name: "View All", isViewAll: true },
          {
            name: "Readymade",
            image: "/mega-menu-1.webp",
          },
          {
            name: "Unstitched",
            image: "/mega-menu-2.webp",
          },
          {
            name: "Party Wear",
            image: "/mega-menu-7.webp",
          },
        ],
        shopByPrice: [
          {
            range: "Under ₹1500",
            image: "/mega-menu-1.webp",
          },
          {
            range: "₹1500 - ₹3000",
            image: "/mega-menu-4.webp",
          },
          {
            range: "Above ₹3000",
            image: "/mega-menu-5.webp",
          },
        ],
        more: ["New In", "Festive", "Casual"],
      },
    },
  },
  Gowns: {
    leftSidebar: [
      "All Gowns",
      "Evening Gowns",
      "Party Wear Gowns",
      "Ethnic Gowns",
      "Bridal Gowns",
    ],
    rightContent: {
      "All Gowns": {
        shopBy: [
          { name: "View All", isViewAll: true },
          {
            name: "Flared",
            image: "/mega-menu-1.webp",
          },
          {
            name: "Mermaid",
            image: "/mega-menu-7.webp",
          },
          {
            name: "A-Line",
            image: "/mega-menu-4.webp",
          },
        ],
        shopByPrice: [
          {
            range: "Under ₹2000",
            image: "/mega-menu-1.webp",
          },
          {
            range: "₹2000 - ₹5000",
            image: "/mega-menu-4.webp",
          },
          {
            range: "Above ₹5000",
            image: "/mega-menu-7.webp",
          },
        ],
        more: ["Latest Styles", "Cocktail", "Reception"],
      },
    },
  },
};

Object.keys(megaMenuData).forEach((category) => {
  const mainData = megaMenuData[category];
  if (mainData && mainData.leftSidebar && mainData.leftSidebar.length > 0) {
    const firstSubCategory = mainData.leftSidebar[0];
    mainData.leftSidebar.forEach((sub) => {
      if (!mainData.rightContent[sub]) {
        mainData.rightContent[sub] = mainData.rightContent[firstSubCategory];
      }
    });
  }
});
