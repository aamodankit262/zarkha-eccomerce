import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import {
  ChevronDown,
  Minus,
  Pause,
  Play,
  Plus,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { productsData } from "@/data/product";
import { measurements } from "@/types";
import ProductImages from "../product/ProductImages";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import GlobalLoader from "../GlobalLoader";

interface ProductDetailsPageProps {
  onClose: () => void;
}
// const sizeChartData = [
//   { size: "XS", bust: "32-34", waist: "26-28", hip: "36-38" },
//   { size: "S", bust: "34-36", waist: "28-30", hip: "38-40" },
//   { size: "M", bust: "36-38", waist: "30-32", hip: "40-42" },
//   { size: "L", bust: "38-40", waist: "32-34", hip: "42-44" },
//   { size: "XL", bust: "40-42", waist: "34-36", hip: "44-46" },
//   { size: "XXL", bust: "42-44", waist: "36-38", hip: "46-48" },
// ];
const ProductDetailsPage = ({ onClose }: ProductDetailsPageProps) => {
  const navigate = useNavigate();
  // const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showProductDetails, setShowProductDetails] = useState(true);
  const [showAudioInfo, setShowAudioInfo] = useState(false);
  const [showProductInfo, setShowProductInfo] = useState(true);
  const [showRatingsReviews, setShowRatingsReviews] = useState(true);
  const [showRatingsPage, setShowRatingsPage] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [sizeChartData, setSizeChartData] = useState<measurements[]>(null);
  // const { isLogin } = useAuthStore();
  const [searchParams] = useSearchParams();
  const { openCart, addItem } = useCart();
  const id = useParams().id || "";
  //  const {affiliate, isLoggedIn, logout } = useAffiliate();

  const { data, request, error, loading } = useApi(productService.getById);
  const { data: ChartList, request: fetchChartList, error: chartError } = useApi(productService.getSizeChartList);
  const selectedVariantId = searchParams.get("variant");
  const affiliateId = searchParams.get("affiliate");

  const product = data?.body;

  const productVariants = useMemo(
    () => product?.variants ?? [],
    [product]
  );

  const activeVariant = useMemo(() => {
    if (!productVariants.length) return null;
    return (
      // productVariants.find(v => v.item_code_id === selectedVariantId) 
      productVariants.find(v => v.item_code_id === selectedVariantId) ??
      productVariants[0]
    );
  }, [productVariants, selectedVariantId]);
  const details = product?.product_details;

  const productImages = useMemo(
    () =>
      activeVariant?.images?.length > 0
        ? activeVariant.images
        : product?.images ?? [],
    [activeVariant, product]
  );
  const sizes = product?.select_size?.map((size: any) => size) || [];
  const rating = product?.ratings || 4.5;
  const shortDescription = product?.product_details?.short_discription ?? "";
  const longDescription = product?.product_details?.long_discription ?? "";

  const ratingsCount = product?.ratings_and_reviews;
  const similarProductsRaw = product?.similar_products ?? [];
  // const audioSrc =
  //   product?.audio?.trim()
      
  const audioSrc =
    product?.audio?.trim()
      ? product.audio
      : "/assets/file_example.mp3";

  const {
    audioRef,
    isPlaying,
    progress,
    currentTime,
    duration,
    toggle } = useAudioPlayer(audioSrc, showAudioInfo);

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
    product?.feedback?.feedback_list?.map(
      (item: any, index: number) => ({
        id: index + 1,
        name: item.customer_name,
        timeAgo: item.time,
        comment: item.comments,
        rating: item.customer_rating,
        images: item.feedback_image ?? [],
      })
    ) ?? [];

  const productDetails = [
    { label: "Color", value: details?.color?.map((color, i) => color.color_name).join(",") || "-" },
    { label: "Work", value: details?.work || "N/A" },
    { label: "Fabric", value: details?.fabric.join(",") || "N/A" },
    { label: "Fit Type", value: details?.fit_type || "N/A" },
  ];
  useEffect(() => {
    if (affiliateId) {
      localStorage.setItem("affiliate_id", affiliateId);
    }
  }, [affiliateId]);

  // useEffect(() => {
  //   if (!id) return;
  //   request(id);
  // }, [id]);
  useEffect(() => {
    request({
      productId: id!,
      itemId: selectedVariantId ?? undefined,
      affiliateId: affiliateId ?? undefined,
    });
  }, [id, selectedVariantId]);
 
  useEffect(() => {
    if (!showSizeChart || ChartList) return;
    fetchChartList({
      category_id: "",
      subcategory_id: "",
      status: "",
      page: 1,
      limit: 10,
    });
  }, [showSizeChart, ChartList]);

  useEffect(() => {
    if (ChartList?.body?.length > 0) {
      setSizeChartData(ChartList?.body[0]?.measurements); // ✅ first chart
    }
  }, [ChartList]);

  // useEffect(() => {
  //   if (!selectedVariantId && productVariants.length > 0) {
  //     const params = new URLSearchParams(searchParams);
  //     params.set("variant", productVariants[0].item_code_id);

  //     navigate(`/product/${id}?${params.toString()}`, {
  //       replace: true,
  //     })
  //   }
  // }, [selectedVariantId, productVariants, id, navigate, searchParams])
  // useEffect(() => {
  //   if (
  //     !selectedVariantId &&
  //     productVariants &&
  //     productVariants.length > 0
  //   ) {
  //     navigate(
  //       `/product/${id}?variant=${productVariants[0].item_code_id}`,
  //       { replace: true }
  //     );
  //   }
  // }, [selectedVariantId, productVariants, id, navigate]);

  const formatTime = (time: number) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  const capitalizeFirst = (text?: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };


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
  {loading && (
  <div className="fixed inset-0 bg-white/60 z-50 flex items-center justify-center">
    <p>Loading...</p>
  </div>
)}

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
            <ProductImages
              images={productImages}
              activeIndex={activeImage}
              onChange={setActiveImage}
              productId={product?.id || product?._id}
              isWishList={product?.isWishList}
              isNew={product?.isNew}
            />

            <div className="space-y-4 md:space-y-6">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {capitalizeFirst(product?.product_title)}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{shortDescription ?? ''}</span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-xl md:text-2xl font-bold text-gray-900">
                    ₹{product?.discount_price}
                  </span>
                  <span className="text-base md:text-lg text-gray-500 line-through">
                    MRP ₹{product?.product_price}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                    Save {product?.save_in}%
                  </span>
                </div>
                <p className="text-sm text-gray-600">{product?.taxes}</p>
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
                          key={variant?.item_code_id}
                          // onClick={() =>
                          //   navigate(`/product/${id}?variant=${variant.item_code_id}`, {
                          //     replace: true,
                          //   })
                          // }
                          onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set("variant", variant.item_code_id);

                            navigate(`/product/${id}?${params.toString()}`, {
                              replace: true,
                            });
                          }}
                          className={`
                               w-8 h-8 rounded-full border-2 transition-all
                              ${isActive
                              ? "border-orange-500  ring-orange-400 ring-offset-2 scale-110"
                              : "border-gray-300 hover:border-orange-400"}`}
                          style={{ backgroundColor: variant.color.color_code }}
                           aria-label={variant.color.name}
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

              <div className="mt-12 space-y-6">
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
                              {detail.value.length > 50 ? detail?.value.slice(0, 50) + "..." : detail?.value || "N/A"}
                              {/* {detail?.value || "N/A"} */}
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
                {audioSrc && (
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
                      <>
                        <audio
                          ref={audioRef}
                          src={audioSrc} // fallback
                          preload="metadata"
                        />

                        <div className="px-4 pb-4 border-t">
                          <div className="pt-4">
                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">

                              {/* PLAY BUTTON */}
                              <button
                                onClick={toggle}
                                className="p-2 bg-white rounded-full shadow-sm hover:shadow-md"
                              >
                                {isPlaying ? (
                                  <Pause className="h-5 w-5 text-gray-700" />
                                ) : (
                                  <Play className="h-5 w-5 text-gray-700" />
                                )}
                              </button>

                              {/* PROGRESS */}
                              <div className="flex-1">
                                <div className="text-sm text-gray-600 mb-1">
                                  {formatTime(currentTime)} / {formatTime(duration)}
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gray-800 h-2 rounded-full transition-all"
                                    style={{ width: `${progress * 100}%` }}
                                  />
                                </div>
                              </div>

                              {/* <Volume2 className="h-5 w-5 text-gray-700" /> */}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  </div>
                )}
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
          {productsData(similarProductsRaw)?.length > 0 && (
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
                {productsData(similarProductsRaw)?.map((product) => (
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
