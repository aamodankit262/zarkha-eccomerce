import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, Star, Heart, Share2, ShoppingBag, Truck, Shield,
  RotateCcw, ChevronDown, ChevronUp, Minus, Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBoutique } from "@/contexts/BoutiqueContext";
import { useApi } from "@/hooks/useApi";
import { boutiqueService } from "@/boutiqueServices/boutiqueService";
import { NO_IMAGE } from "@/api/endpoints";
import { logger } from "@/helper/logger";

// Same product data as brand page - in real app from API
// const catalogProducts = [
//   { id: '1', name: 'Embroidered Silk Kurta Set', category: 'Kurta Sets', adminPrice: 1800, sellingPrice: 2499, mrp: 3500, image: '/lovable-uploads/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png', discount: 29, rating: 4.5, reviews: 45, inStock: true, description: 'Beautifully embroidered silk kurta set featuring intricate thread work and premium quality fabric. Perfect for festive occasions and celebrations.', fabric: 'Pure Silk', occasion: 'Festive, Party', work: 'Embroidery, Thread Work', wash: 'Dry Clean Only', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
//   { id: '2', name: 'Printed Cotton Anarkali', category: 'Anarkalis', adminPrice: 1200, sellingPrice: 1799, mrp: 2500, image: '/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png', discount: 28, rating: 4.3, reviews: 32, inStock: true, description: 'Elegant printed cotton anarkali with flared silhouette. Comfortable and stylish for everyday and casual wear.', fabric: 'Cotton', occasion: 'Casual, Daily Wear', work: 'Printed', wash: 'Machine Washable', sizes: ['S', 'M', 'L', 'XL'] },
//   { id: '3', name: 'Designer Lehenga Choli', category: 'Lehengas', adminPrice: 4500, sellingPrice: 6499, mrp: 9000, image: '/lovable-uploads/beea47d5-6ae4-460a-a065-76f4befc19cb.png', discount: 28, rating: 4.7, reviews: 67, inStock: true, description: 'Stunning designer lehenga choli with heavy embroidery and mirror work. Perfect for weddings and grand celebrations.', fabric: 'Georgette, Net', occasion: 'Wedding, Bridal', work: 'Heavy Embroidery, Mirror Work', wash: 'Dry Clean Only', sizes: ['S', 'M', 'L', 'XL'] },
//   { id: '4', name: 'Banarasi Silk Saree', category: 'Sarees', adminPrice: 3200, sellingPrice: 4500, mrp: 6000, image: '/lovable-uploads/a75cb8b8-9eaa-400c-b4bc-8e4201532a4c.png', discount: 25, rating: 4.6, reviews: 89, inStock: true, description: 'Authentic Banarasi silk saree with rich zari work and traditional motifs. A timeless addition to your wardrobe.', fabric: 'Banarasi Silk', occasion: 'Wedding, Festive', work: 'Zari, Weaving', wash: 'Dry Clean Only', sizes: ['Free Size'] },
//   { id: '5', name: 'Palazzo Suit Set', category: 'Palazzo Sets', adminPrice: 1500, sellingPrice: 2200, mrp: 3000, image: '/lovable-uploads/18b38e61-a1b9-470b-b5f8-9440d6e07cbf.png', discount: 27, rating: 4.4, reviews: 23, inStock: false, description: 'Trendy palazzo suit set with modern prints and comfortable fit. Ideal for office and casual outings.', fabric: 'Rayon', occasion: 'Casual, Office', work: 'Printed', wash: 'Machine Washable', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
//   { id: '6', name: 'Festive Salwar Kameez', category: 'Salwar Suits', adminPrice: 2000, sellingPrice: 2800, mrp: 3800, image: '/lovable-uploads/15ff49d2-e060-4344-956a-c6030caf0a58.png', discount: 26, rating: 4.5, reviews: 56, inStock: true, description: 'Elegant festive salwar kameez with detailed embroidery and premium fabric quality. Perfect for festivals and special occasions.', fabric: 'Chanderi Silk', occasion: 'Festive, Party', work: 'Embroidery', wash: 'Dry Clean Only', sizes: ['S', 'M', 'L', 'XL'] },
// ];

const BoutiqueBrandProductDetail = () => {
  const { boutiqueId, productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { productPrices } = useBoutique();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showSpecs, setShowSpecs] = useState(true);
  const [showDelivery, setShowDelivery] = useState(false);

  // const product = catalogProducts.find(p => p.id === productId);
  const { data: productRes, request: fetchProduct } = useApi(boutiqueService.brandProductDetail);
  // const priceInfo = productPrices.find(pp => pp.productId === productId);

  useEffect(() => {
    if (productId && boutiqueId) {
      fetchProduct({
        partnerId: boutiqueId,
        productId: productId,
      });
    }
  }, [productId, boutiqueId]);
  const product = productRes?.body;
  logger.log("product:", product);
  const product_details = product?.product_details;
  // Product only visible if display price is set
  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Product Not Available</h2>
            <p className="text-muted-foreground mb-4">This product is not currently listed. The boutique may not have set a display price yet.</p>
            <Button variant="brand" onClick={() => navigate(`/shop/${boutiqueId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // const displayPrice = priceInfo.sellingPrice;
  // const discountPercent = Math.round((1 - displayPrice / product.mrp) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(`/shop/${boutiqueId}`)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Shop</span>
          </button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast({ title: "Link Copied!" });
            }}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          {/* Image */}
          <div className="space-y-3">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              {/* <img src={product.images[0] || NO_IMAGE} alt={product?.product_title} className="w-full h-full object-cover" /> */}
              <img
                src={product?.images?.[0]?.url || NO_IMAGE}
                alt={product?.product_title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <Badge variant="secondary" className="mb-2">{product_details?.category}</Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-warm-brown mb-2">{product?.product_title}</h1>
              <p className="text-muted-foreground leading-relaxed">{product_details?.short_description}</p>
              {/* <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-sm">
                  <Star className="h-3 w-3 fill-white" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">{product.reviews} Reviews</span>
              </div> */}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-brand-orange">₹{product?.selling_price}</span>
              {/* <span className="text-lg text-muted-foreground line-through">₹{product.mrp.toLocaleString()}</span> */}
              {/* <Badge className="bg-green-600">{discountPercent}% OFF</Badge> */}
            </div>
            <p className="text-xs text-muted-foreground">{product?.taxes ?? "Inclusive of all taxes"}</p>
            <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Color</h3>
                <div className="flex gap-3">
                  <div className="flex gap-3">
                    {product?.variants?.map((variant) => {
                      // const isActive = activeVariant?.item_code_id === variant.item_code_id;

                      return (
                        <button
                          key={variant?.item_code_id}
                          // onClick={() =>
                          //   navigate(`/product/${id}?variant=${variant.item_code_id}`, {
                          //     replace: true,
                          //   })
                          // }
                          // onClick={() => {
                          //   const params = new URLSearchParams(searchParams);
                          //   params.set("variant", variant.item_code_id);

                          //   navigate(`/product/${id}?${params.toString()}`, {
                          //     replace: true,
                          //   });
                          // }}
                          className={`
                               w-8 h-8 rounded-full border-2 transition-all
                          `}
                          // className={`
                          //      w-8 h-8 rounded-full border-2 transition-all
                          //     ${isActive
                          //     ? "border-orange-500  ring-orange-400 ring-offset-2 scale-110"
                          //     : "border-gray-300 hover:border-orange-400"}`}
                          style={{ backgroundColor: variant.color.color_code }}
                          aria-label={variant.color.name}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            <Separator />

            {/* Size Selection */}
            {product?.select_size?.map((size) => (
              <button
                key={size}
                // onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium`}
                // className={`px-4 py-2 rounded-lg border text-sm font-medium ${selectedSize === size
                //     ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                //     : "border-border hover:border-brand-orange"
                //   }`}
              >
                {size}
              </button>
            ))}
            {/* <div>
              <h3 className="font-semibold mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selectedSize === size
                        ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                        : 'border-border hover:border-brand-orange'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Quantity */}
            {/* <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div> */}

            {/* <Separator /> */}

            {/* Actions */}
            {/* <div className="flex gap-3">
              <Button
                variant="brand"
                className="flex-1"
                disabled={!product.inStock}
                onClick={() => {
                  if (!selectedSize) {
                    toast({ title: "Please select a size", variant: "destructive" });
                    return;
                  }
                  toast({ title: "Added to Cart!", description: `${product.name} (${selectedSize}) x${quantity}` });
                }}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => toast({ title: "Added to Wishlist!" })}>
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </Button>
            </div> */}

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product_details?.long_description}</p>

            {/* Specifications */}
            <div className="border rounded-lg">
              <button
                onClick={() => setShowSpecs(!showSpecs)}
                className="w-full flex items-center justify-between p-4 font-semibold"
              >
                Product Specifications
                {showSpecs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showSpecs && (
                <div className="px-4 pb-4 space-y-2 text-sm">
                  {/* <div className="flex justify-between py-2 border-t"><span className="text-muted-foreground"> Fabric</span><span className="font-medium">{product_details?.fabric.join(",")}</span></div> */}
                  {/* {product_details?.top_fabric && ( */}
                  <div className="flex justify-between py-2 border-t"><span className="text-muted-foreground">Top Fabric</span><span className="font-medium">{product_details?.top_fabric ?? "N/A"}</span></div>
                  {/* )} */}
                  {/* {product_details?.bottom_fabric && ( */}
                  <div className="flex justify-between py-2 border-t"><span className="text-muted-foreground">Bottom Fabric</span><span className="font-medium">{product_details?.bottom_fabric ?? "N/A"}</span></div>
                  {/* )} */}
                  {/* {product_details?.dupatta_fabric && ( */}
                  <div className="flex justify-between py-2 border-t"><span className="text-muted-foreground">Dupatta Fabric</span><span className="font-medium">{product_details?.dupatta_fabric ?? "N/A"}</span></div>
                  {/* )} */}
                  {/* {product_details?.work && (  */}
                  <div className="flex justify-between py-2 border-t"><span className="text-muted-foreground">Work</span><span className="font-medium">{product_details?.work ?? "N/A"}</span></div>
                  {/* )} */}
                  {/* {product_details?.wash_care && ( */}
                  <div className="flex justify-between py-2 border-t"><span className="text-muted-foreground">Wash Care</span><span className="font-medium">{product_details?.wash_care ?? "N/A"}</span></div>
                  {/* )} */}
                  {/* {product_details?.stitch && ( */}
                  <div className="flex justify-between py-2 border-t"><span className="text-muted-foreground">Stitch</span><span className="font-medium">{product_details?.stitch ?? "N/A"}</span></div>
                  {/* )} */}
                  {/* {product_details?.fit_type && ( */}
                  <div className="flex justify-between py-2 border-t"><span className="text-muted-foreground">Fit Type</span><span className="font-medium">{product_details?.fit_type ?? "N/A"}</span></div>
                  {/* )} */}
                  {/* <div className="flex justify-between py-2 border-t"><span className="text-muted-foreground">Boutique Brand</span><span className="font-medium">{product?.boutique_name}</span></div> */}
                </div>
              )}
            </div>

            {/* Delivery Info */}
            {/* <div className="border rounded-lg">
              <button
                onClick={() => setShowDelivery(!showDelivery)}
                className="w-full flex items-center justify-between p-4 font-semibold"
              >
                Delivery & Returns
                {showDelivery ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showDelivery && (
                <div className="px-4 pb-4 space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-brand-orange" />
                    <div><p className="font-medium">Free Delivery</p><p className="text-muted-foreground">On orders above ₹999</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RotateCcw className="h-5 w-5 text-brand-orange" />
                    <div><p className="font-medium">Easy Returns</p><p className="text-muted-foreground">7-day return policy</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-brand-orange" />
                    <div><p className="font-medium">100% Authentic</p><p className="text-muted-foreground">Quality guaranteed</p></div>
                  </div>
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoutiqueBrandProductDetail;
