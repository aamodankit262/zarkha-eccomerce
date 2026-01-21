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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { productService } from "@/services/productService";
import SizeChartDialog from "../SizeChart";
import { toast } from "sonner";
import WishlistButton from "../common/WishlistButton";
import { useAuthStore } from "@/store/authStore";

interface ProductDetailsPageProps {
  onClose: () => void;
}
const sizeChartData = [
  { size: "XS", bust: "32-34", waist: "26-28", hip: "36-38" },
  { size: "S", bust: "34-36", waist: "28-30", hip: "38-40" },
  { size: "M", bust: "36-38", waist: "30-32", hip: "40-42" },
  { size: "L", bust: "38-40", waist: "32-34", hip: "42-44" },
  { size: "XL", bust: "40-42", waist: "34-36", hip: "44-46" },
  { size: "XXL", bust: "42-44", waist: "36-38", hip: "46-48" },
];
const ProductDetailsPage = ({ onClose }: ProductDetailsPageProps) => {
  const navigate = useNavigate();
  // const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showProductDetails, setShowProductDetails] = useState(true);
  const [showAudioInfo, setShowAudioInfo] = useState(true);
  const [showProductInfo, setShowProductInfo] = useState(true);
  const [showRatingsReviews, setShowRatingsReviews] = useState(true);
  const [audioProgress, setAudioProgress] = useState(0.5);
  const [showRatingsPage, setShowRatingsPage] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const { isLogin } = useAuthStore();
  const [searchParams] = useSearchParams();

  // const [selectedImage, setSelectedImage] = useState<number>(0);
  const { openCart, addItem } = useCart();
  const id = useParams().id || "";
  const { data, request, error } = useApi(productService.getById);
  useEffect(() => {
    if (!id) return;
    request(id);
  }, [id]);
  // console.log(error, 'prductdetails')
 

  const selectedVariantId = searchParams.get("variant");
  // console.log(selectedVariantId, 'variantId')
  const productVariants = data?.body?.variants ?? [];
  const activeVariant = productVariants.find(
    (v) => v.item_code_id === selectedVariantId
  ) || productVariants[0];
  useEffect(() => {
    if (
      !selectedVariantId &&
      productVariants &&
      productVariants.length > 0
    ) {
      navigate(
        `/product/${id}?variant=${productVariants[0].item_code_id}`,
        { replace: true }
      );
    }
  }, [selectedVariantId, productVariants, id, navigate]);

  const capitalizeFirst = (text?: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const productData = data?.body
  // console.log("Product Data:", data);

  const productImages =
    activeVariant?.images?.length > 0
      ? activeVariant.images
      : data?.body?.images || [];
  const sizes = data?.body?.select_size?.map((size: any) => size) || [];
  // const colors = data?.body?.color.map((color: any) => color.color_code);
  const rating = data?.body?.ratings || 4.5;
  const shortDescription = data?.body?.product_details?.short_discription ?? "";
  const longDescription = data?.body?.product_details?.long_discription ?? "";

  const ratingsCount = data?.body?.ratings_and_reviews;
  const details = data?.body?.product_details;
  const similarProductsRaw = data?.body?.similar_products ?? [];

  // console.log("Ratings Count:", ratingsCount);

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
  // console.log(ratingBreakdown, 'ratingBreakdown')

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
  //  const totalReviews =  data?.body?.feedback?
  const productDetails = [
    { label: "Color", value: details?.color?.map((color, i) => color.color_name).join(",") || "-" },
    { label: "Work", value: details?.Work || "-" },
    { label: "Fabric", value: details?.fabric || "-" },
    // {
    //   label: "Pattern / Ideal For",
    //   value: details?.pattern || details?.ideal_for || "-",
    // },
    { label: "Fit Type", value: details?.fit_type || "-" },
    // { label: "Suitable For", value: details?.suitable_for || "-" },
  ];

  const productsData = similarProductsRaw?.map((product: any) => {
    const discount =
      product.mrp && product.product_price
        ? Math.round(
          ((product.mrp - product.product_price) / product.mrp) * 100
        )
        : 0;

    return {
      id: product.id,
      title: product.name,
      price: product.discount_price,
      originalPrice: product.mrp || product.product_price,
      discount, // percentage
      image: product?.images?.[0]?.url || "/assets/no_image.jpg",
      isNew: true,
      colors: product.color ? [product.color] : [], // FIXED
      size: product.size,
    };
  });

  const handleAddToCart = () => {
    if (!activeVariant) return;
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart.");
      return;
    }
    addItem({
      productId: id,
      variantId: activeVariant.item_code_id,
      size: activeVariant.size,
      quantity,
    });

    openCart();
  };
  const handleBuyNow = () => {
    if (!activeVariant) return;
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart.");
      return;
    }
    addItem({
      productId: id,
      variantId: activeVariant.item_code_id,
      size: activeVariant?.size,
      quantity,
    });
    navigate("/checkout");
    // openCart();
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
if (error) {
  return (
    <div className="text-center py-10">
      <h2 className="text-xl font-semibold">{error}</h2>
      <p className="text-gray-500">
        This product may have been removed or is unavailable.
      </p>
    </div>
  );
}

if (!data) {
  return null; // or fallback UI
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
              {details?.subcategory ?? details?.category}
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
                  src={productImages?.[activeImage]?.url || "/assets/no_image.jpg"}
                  alt={productImages?.[activeImage]?.alt_text || "Product image"}
                  //  {/* CHANGE: Responsive height for main image */}
                  className="w-full h-[400px] md:h-[500px] object-cover rounded-lg"
                />
                {/* New Arrivals Badge */}
                {details?.isNew === 1 && (
                  <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1 rounded">
                    New Arrivals
                  </div>
                )}

                {/* Action Icons */}
                {isLogin && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <WishlistButton productId={id} isWish={productData?.isWishList} />
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {/* CHANGE: Horizontal scroll on mobile for thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages?.map((image, index) => (
                  <button
                    key={index}
                    // onClick={() => setSelectedImage(image.id || index)}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${activeImage === index
                      ? "border-orange-500"
                      : "border-gray-200"
                      }`}
                  >
                    <img
                      src={image.url || '/assets/no_images.jpg'}
                      alt={image.alt_text}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4 md:space-y-6">
              {/* Title and Rating */}
              <div>
                {/* CHANGE: Responsive font size for title */}
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {/* Purple Lehenga Set With Hand Embroidered Blouse And Dupatta */}
                  {capitalizeFirst(data?.body?.product_title)}
                </h1>
                <div className="flex items-center gap-2">
                  {/* <div className="flex items-center">
                    <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                    <span className="ml-1 text-sm font-medium">{rating}</span>
                  </div> */}
                  {/* <span className="text-sm text-gray-500">1 Rating 320</span> */}
                  <span className="text-sm text-gray-500">{shortDescription ?? ''}</span>
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
                  <div className="flex gap-3">
                    {productVariants?.map((variant) => {
                      const isActive = activeVariant?.item_code_id === variant.item_code_id;

                      return (
                        <button
                          key={variant.item_code_id}
                          onClick={() =>
                            navigate(`/product/${id}?variant=${variant.item_code_id}`, {
                              replace: true,
                            })
                          }
                          className={`
        w-8 h-8 rounded-full border-2 transition-all
        ${isActive
                              ? "border-orange-500 ring-2 ring-orange-400 ring-offset-2 scale-110"
                              : "border-gray-300 hover:border-orange-400"}
      `}
                          style={{ backgroundColor: variant.color.color_code }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Select Size</h3>
                  <button
                    onClick={() => setShowSizeChart(true)}
                    className="text-sm text-orange-500 hover:text-orange-600">
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

              {/* Desktop Buttons */}
              <div className="space-y-3 hidden sm:block">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 py-3 text-base font-medium"
                >
                  Add To Cart
                </Button>

                <Button
                  onClick={handleBuyNow}
                  // onClick={() => navigate("/checkout")}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-base font-medium"
                >
                  Buy Now
                </Button>
              </div>


              {/* Mobile Sticky Footer */}
              <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t p-3 sm:hidden">
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 py-3 text-sm font-semibold"
                  >
                    Add To Cart
                  </Button>

                  <Button
                    onClick={() => navigate("/checkout")}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 text-sm font-semibold"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              {/* Delivery */}
              {/* <div className="space-y-3 pt-4 border-t">
                <h3 className="font-medium text-gray-900">Delivery</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  {" "}
                  <input
                    type="text"
                    placeholder="Enter Delivery Address"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6">
                    Check Now
                  </Button>
                </div>
              </div> */}
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
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-y-3 gap-x-8 pt-4 flex-wrap">
                        {productDetails?.map((detail, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-gray-600">
                              {detail.label}
                            </span>
                            <span className="text-gray-900">
                              {detail.value || "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                      {/* <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: longDescription }}
                        >
                          Embrace Effortless Elegance With Our Block-Printed
                          Shirt-Style Dress, Tailored In A Chic A-Line
                          Silhouette, Showcasing Distinctive Maroon Hues. This
                          Dress Is A Standout Piece, Made From Premium Rayon, It
                          Offers Exceptional{" "}
                          <button className="text-orange-500 hover:text-orange-600 font-medium">
                            Read More
                          </button>
                        </p>

                      </div> */}
                    </div>
                  )}
                </div>

                {/* Information Accordion */}
                {longDescription.length > 0 && (
                  <div className=" rounded-lg">
                    <button
                      onClick={() => setShowProductInfo(!showProductInfo)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        Product Descriptions
                      </h3>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${showProductInfo ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    {showProductInfo && (
                      <div className="px-4 pb-4 border-t">
                        <div className="mt-4 pt-4">
                          <p className="text-sm text-gray-600 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: longDescription }}
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
                )}
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
                                  {/* {console.log(rating.count)} */}
                                  {rating.count}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Customer Reviews */}
                        {/* <div className="space-y-6">
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

                              <div className="flex gap-2">
                                {review?.images?.map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={review.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                ))}
                              </div>

                              <div className="text-xs text-gray-500">
                                {review.name} | {review.timeAgo}
                              </div>
                            </div>
                          ))}

                          {customerReviews?.length > 3 && (
                            <div className="text-center pt-4">
                              <button
                                onClick={handleViewAllReviews}
                                className="text-orange-500 hover:text-orange-600 font-medium"
                              >
                                View All {customerReviews?.length} Reviews
                              </button>
                            </div>
                          )}
                            
                        </div> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {productsData.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 py-12">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Similar Products
                </h2>
                <button
                  onClick={() => navigate(`/products?industry=${details.industry_id}&category=${details?.category_id}&sub=${details?.subcategory_id}`)}
                  className="px-3 py-1.5 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition-colors text-sm font-medium">
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
          )}
        </div>
        <SizeChartDialog
          open={showSizeChart}
          onOpenChange={setShowSizeChart}
          sizeChart={sizeChartData}
          note={`* Model (height 5'8") is wearing size S`}
        />
      </div>
    </Layout>
  );
};

export default ProductDetailsPage;
