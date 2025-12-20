"use client"; // Assuming you might use client-side hooks, good practice to keep it.

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
// import { productsData } from "@/data/product";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronDown,
  Heart,
  Minus,
  Play,
  Plus,
  Share2,
  Star,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Layout } from "../common";
import { ProductCard } from "../common/ProductCard";
import { RatingsPage } from "./RatingPage";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { productService } from "@/services/productService";

interface ProductDetailsPageProps {
  onClose: () => void;
}

const ProductDetailsPage = ({ onClose }: ProductDetailsPageProps) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("XL");
  const [quantity, setQuantity] = useState(1);
  const [showProductDetails, setShowProductDetails] = useState(true);
  const [showAudioInfo, setShowAudioInfo] = useState(true);
  const [showRatingsReviews, setShowRatingsReviews] = useState(true);
  const [audioProgress, setAudioProgress] = useState(0.5);
  const [showRatingsPage, setShowRatingsPage] = useState(false);
  const { openCart, getTotalItems, addItem } = useCart();
  const { data, loading, request } = useApi(productService.getById);
  const id = useParams().id || "";
  console.log("Product ID:", id);
  useEffect(() => {
    request(id);
  }, []);
  console.log("Product Data:", data);
  // const productImages = [
  //   "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
  //   "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
  //   "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
  //   "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
  //   "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
  // ];

  // const sizes = ["S", "M", "L", "XL"];
  // const colors = ["#562C2C", "#FF6600", "#DC143C"];
  const productImages = data?.body?.images || [];
  const sizes = data?.body?.select_size?.map((size: any) => size) || ["S", "M", "L", "XL"];
  const colors = data?.body?.color.map((color: any) => color) || ["#562C2C", "#FF6600", "#DC143C"];
  const rating = data?.body?.ratings || 4.5;
  const productDescription = data?.body?.product_details?.description ?? "";

  const ratingsCount = data?.body?.ratings_and_reviews;
  const details = data?.body?.product_details;
  const similarProductsRaw = data?.body?.similar_products ?? [];

  console.log("Ratings Count:", ratingsCount);

  const totalRatings =
    (ratingsCount?.["1"] ?? 0) +
    (ratingsCount?.["2"] ?? 0) +
    (ratingsCount?.["3"] ?? 0) +
    (ratingsCount?.["4"] ?? 0) +
    (ratingsCount?.["5"] ?? 0);

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = ratingsCount?.[star] ?? 0;
    return {
      stars: star,
      count,
      percentage: totalRatings
        ? Math.round((count / totalRatings) * 100)
        : 0,
    };
  });

  // const ratingBreakdown = [
  // { stars: 5, count: ratingsCount["5"], percentage: 90 },
  //   { stars: 4, count: ratingsCount["4"], percentage: 90 },
  //   { stars: 3, count: ratingsCount["3"], percentage: 90 },
  //   { stars: 2, count: ratingsCount["2"], percentage: 4 },
  //   { stars: 1, count: ratingsCount["1"], percentage: 2 },
  // ];
  // const ratingBreakdown = [
  // { stars: rating[5], count: 450, percentage: 90 },
  //   { stars: rating[4], count: 450, percentage: 90 },
  //   { stars: rating[3], count: 450, percentage: 90 },
  //   { stars: rating[2], count: 20, percentage: 4 },
  //   { stars: rating[1], count: 10, percentage: 2 },
  // ];
  const customerReviews =
    data?.body?.feedback?.feedback_list?.map(
      (item: any, index: number) => ({
        id: index + 1,
        name: item.customer_name,
        timeAgo: item.time,
        comment: item.comments,
        rating: item.customer_rating,
        images: item.feedback_image ?? [],
      })
    ) ?? [];

  // const customerReviews = [
  //   {
  //     id: 1,
  //     name: "Shabshikta Simran",
  //     timeAgo: "1 Month Ago",
  //     comment:
  //       "Loved It!! Very Stylish And Comfortable! Love The Look, Fabric Is Very Soft.",
  //     rating: 5,
  //     images: [
  //       "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
  //       "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: "Shabshikta Simran",
  //     timeAgo: "1 Month Ago",
  //     comment:
  //       "Loved It!! Very Stylish And Comfortable! Love The Look, Fabric Is Very Soft.",
  //     rating: 5,
  //     images: [
  //       "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
  //       "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
  //     ],
  //   },
  //   {
  //     id: 3,
  //     name: "Shabshikta Simran",
  //     timeAgo: "1 Month Ago",
  //     comment:
  //       "Loved It!! Very Stylish And Comfortable! Love The Look, Fabric Is Very Soft.",
  //     rating: 5,
  //     images: [
  //       "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
  //       "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
  //     ],
  //   },
  // ];

  const productDetails = [
    { label: "Color", value: details?.color?.join(", ") || "-" },
    { label: "Length", value: details?.length || "-" },
    { label: "Fabric", value: details?.fabric || "-" },
    {
      label: "Pattern / Ideal For",
      value: details?.pattern || details?.ideal_for || "-",
    },
    { label: "Style Code", value: details?.style_code || "-" },
    { label: "Suitable For", value: details?.suitable_for || "-" },
  ];
    // const productDetails = [
    //   { label: "Color", 
    //     value: "Black"
    //    },
    //   { label: "Length", value: "Maxi/Full Length" },
    //   { label: "Fabric", value: "Viscose Rayon" },
    //   { label: "Pattern/Ideal For", value: "Floral Print" },
    //   { label: "Style Code", value: "Fit And Flare" },
    //   { label: "Suitable For", value: "Fit And Flare" },
    // ];
    // const productDetails = [
    //   { label: "Color", value: "Black" },
    //   { label: "Length", value: "Maxi/Full Length" },
    //   { label: "Fabric", value: "Viscose Rayon" },
    //   { label: "Pattern/Ideal For", value: "Floral Print" },
    //   { label: "Style Code", value: "Fit And Flare" },
    //   { label: "Suitable For", value: "Fit And Flare" },
    // ];
 const productsData = similarProductsRaw?.map((product: any) => {
    const discount =
      product.mrp && product.product_price
        ? Math.round(
          ((product.mrp - product.product_price) / product.mrp) * 100
        )
        : 0;

    return {
      id: product._id,
      title: product.name,
      price: product.product_price,
      originalPrice: product.mrp,
      discount, // percentage
      image: product?.images?.[0]?.url || "/assets/no_image.jpg",
      isNew: true,
      colors: product.color ? [product.color] : [], // FIXED
      size: product.size,
    };
  });

  const handleAddToCart = () => {
    addItem({
      productId: id,
      variantId: "variant-123", // Placeholder, replace with actual variant ID
      name: data?.body?.product_title || "Product Name",
      image: productImages[selectedImage],
      size: selectedSize,
      color: colors[0] || "#000000",
      price: data?.body?.discount_price || 0,
      quantity: quantity,
    });
    openCart();
  };
  const handleViewAllReviews = () => {
    setShowRatingsPage(true);
  };

  const handleBackFromRatings = () => {
    setShowRatingsPage(false);
  };

  if (showRatingsPage) {
    return <RatingsPage onBack={handleBackFromRatings} />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-sm text-gray-600">
            <span className="hover:text-brand-orange cursor-pointer">Home</span>
            <span className="mx-1">›</span>
            <span className="hover:text-brand-orange cursor-pointer">
              Kurtis
            </span>
            <span className="mx-1">›</span>
            <span className="text-gray-900">Product Details</span>
          </div>
        </div>

        {/* Product Section */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                <img
                  src={productImages[selectedImage]}
                  alt="Product"
                  //  {/* CHANGE: Responsive height for main image */}
                  className="w-full h-[400px] md:h-[500px] object-cover rounded-lg"
                />
                {/* New Arrivals Badge */}
                <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1 rounded">
                  New Arrivals
                </div>
                {/* Action Icons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Images */}
              {/* CHANGE: Horizontal scroll on mobile for thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image.id || index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === image.id || index
                        ? "border-orange-500"
                        : "border-gray-200"
                      }`}
                  >
                    <img
                      src={image.url || image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            {/* CHANGE: Adjusted spacing for mobile */}
            <div className="space-y-4 md:space-y-6">
              {/* Title and Rating */}
              <div>
                {/* CHANGE: Responsive font size for title */}
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {/* Purple Lehenga Set With Hand Embroidered Blouse And Dupatta */}
                  {data?.body?.product_title}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                    <span className="ml-1 text-sm font-medium">{rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">1 Rating 320</span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  {/* CHANGE: Responsive font size for price */}
                  <span className="text-xl md:text-2xl font-bold text-gray-900">
                    ₹{data?.body?.discount_price}
                  </span>
                  <span className="text-base md:text-lg text-gray-500 line-through">
                    MRP ₹{data?.body?.product_price}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                    Save {data?.body?.save_in}%
                  </span>
                </div>
                <p className="text-sm text-gray-600">{data?.body?.taxes}</p>
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Color</h3>
                <div className="flex gap-3">
                  {colors?.map((color, index) => (
                    <button
                      key={index}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-orange-500 transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Select Size</h3>
                  <button className="text-sm text-orange-500 hover:text-orange-600">
                    Size Guide
                  </button>
                </div>
                <div className="flex gap-3">
                  {sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg border-2 transition-colors ${selectedSize === size
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-gray-300 hover:border-orange-500"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {quantity.toString().padStart(2, "0")}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 py-3 text-base font-medium"
                >
                  Add To Cart
                </Button>
                <Button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-base font-medium"
                >
                  Buy Now
                </Button>
              </div>

              {/* Delivery */}
              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-medium text-gray-900">Delivery</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  {" "}
                  {/* Stacks on small screens */}
                  <input
                    type="text"
                    placeholder="Enter Delivery Address"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6">
                    Check Now
                  </Button>
                </div>
              </div>
              <div className="mt-12 space-y-6">
                {/* Product Details Accordion */}
                <div className="rounded-lg">
                  <button
                    onClick={() => setShowProductDetails(!showProductDetails)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <h3 className="text-lg font-medium text-gray-900">
                      Product Details
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${showProductDetails ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {showProductDetails && (
                    <div className="px-4 pb-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 pt-4">
                        {productDetails.map((detail, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-gray-600">
                              {detail.label}
                            </span>
                            <span className="text-gray-900">
                              {detail.value}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600 leading-relaxed" 
                        dangerouslySetInnerHTML={{ __html: productDescription }}
                        >
                          {/* Embrace Effortless Elegance With Our Block-Printed
                          Shirt-Style Dress, Tailored In A Chic A-Line
                          Silhouette, Showcasing Distinctive Maroon Hues. This
                          Dress Is A Standout Piece, Made From Premium Rayon, It
                          Offers Exceptional{" "}
                          <button className="text-orange-500 hover:text-orange-600 font-medium">
                            Read More
                          </button> */}
                        </p>
                        
                      </div>
                    </div>
                  )}
                </div>

                {/* Audio Information Accordion */}
                <div className=" rounded-lg">
                  <button
                    onClick={() => setShowAudioInfo(!showAudioInfo)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <h3 className="text-lg font-medium text-gray-900">
                      Audio Information
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${showAudioInfo ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {showAudioInfo && (
                    <div className="px-4 pb-4 border-t">
                      <div className="pt-4">
                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                          <button className="p-2 bg-white rounded-full shadow-sm hover:shadow-md">
                            <Play className="h-5 w-5 text-gray-700" />
                          </button>
                          <div className="flex-1">
                            <div className="text-sm text-gray-600 mb-1">
                              0:30 / 0:05
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gray-800 h-2 rounded-full"
                                style={{ width: `${audioProgress * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <button className="p-2">
                            <Volume2 className="h-5 w-5 text-gray-700" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ratings & Reviews Accordion */}
                <div className=" rounded-lg">
                  <button
                    onClick={() => setShowRatingsReviews(!showRatingsReviews)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <h3 className="text-lg font-medium text-gray-900">
                      Ratings & Reviews
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${showRatingsReviews ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {showRatingsReviews && (
                    <div className="px-4 pb-4 border-t">
                      <div className="pt-6">
                        {/* Rating Summary */}
                        {/* CHANGE: Stacks vertically on mobile, row on sm+ */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-8">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <Star className="h-6 w-6 fill-orange-400 text-orange-400 mr-2" />
                              <span className="text-3xl font-bold text-gray-900">
                                {ratingsCount?.total_ratings || 0}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {/* 745 Verified Buyers */}
                              {ratingsCount?.total_buyers || 0}
                            </div>
                          </div>

                          {/* Rating Breakdown */}
                          <div className="w-full flex-1 space-y-2">
                            {ratingBreakdown?.map((rating) => (
                              <div
                                key={rating.stars}
                                className="flex items-center gap-3"
                              >
                                <span className="text-sm text-gray-600 w-4">
                                  {rating.stars}
                                </span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${rating.stars >= 4
                                        ? "bg-green-500"
                                        : rating.stars === 3
                                          ? "bg-yellow-500"
                                          : rating.stars === 2
                                            ? "bg-orange-500"
                                            : "bg-red-500"
                                      }`}
                                    style={{ width: `${rating.percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-8">
                                  {rating.count}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Customer Reviews */}
                        <div className="space-y-6">
                          <h4 className="text-lg font-medium text-gray-900">
                            Customers Feedback ({customerReviews?.length})
                          </h4>

                          {customerReviews?.map((review) => (
                            <div key={review.id} className="space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <p className="text-sm text-gray-700 flex-1">
                                  {review.comment}
                                </p>
                                <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                                  {review.rating} ★
                                </div>
                              </div>

                              {/* Review Images */}
                              <div className="flex gap-2">
                                {review.images.map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Review ${index + 1}`}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                ))}
                              </div>

                              <div className="text-xs text-gray-500">
                                {review.name} | {review.timeAgo}
                              </div>
                            </div>
                          ))}

                          {/* View All Reviews Button */}
                          <div className="text-center pt-4">
                            <button
                              onClick={handleViewAllReviews}
                              className="text-orange-500 hover:text-orange-600 font-medium"
                            >
                              View All 151 Reviews
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Similar Products
              </h2>
              <button className="px-3 py-1.5 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition-colors text-sm font-medium">
                View All
              </button>
            </div>

            {/* Grid - Already responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {productsData?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailsPage;
