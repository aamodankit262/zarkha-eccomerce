import { useState, useEffect } from "react";

import { Product } from "@/types";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const mockProducts: Product[] = [
      {
        id: 1,
        image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
        title: "Traditional Ethnic Kurta Set",
        price: "₹2,999",
        originalPrice: "₹4,999",
        discount: "40% OFF",
        rating: 4.5,
        reviews: 123,
        colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
        category: "Kurtas"
      },
      {
        id: 2,
        image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
        title: "Designer Anarkali Dress",
        price: "₹3,499",
        originalPrice: "₹5,999",
        discount: "42% OFF",
        rating: 4.3,
        reviews: 89,
        colors: ["#E74C3C", "#F39C12"],
        category: "Dresses"
      },
      {
        id: 3,
        image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
        title: "Embroidered Lehenga Set",
        price: "₹8,999",
        originalPrice: "₹15,999",
        discount: "44% OFF",
        rating: 4.7,
        reviews: 156,
        colors: ["#9B59B6", "#E67E22", "#F1C40F"],
        category: "Lehengas"
      },
      {
        id: 4,
        image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
        title: "Silk Saree Collection",
        price: "₹4,599",
        originalPrice: "₹7,999",
        discount: "42% OFF",
        rating: 4.6,
        reviews: 78,
        colors: ["#16A085", "#2980B9"],
        category: "Sarees"
      },
    ];

    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category?.toLowerCase() === category.toLowerCase());
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.rating >= 4.5);
  };

  return {
    products,
    loading,
    getProductsByCategory,
    getFeaturedProducts
  };
};