export const productsData = (products: any[]) => products?.map((product: any) => {
  const discount =
    product.mrp && product.product_price
      ? Math.round(
        ((product.mrp - product.product_price) / product.mrp) * 100
      )
      : 0;

  return {
    id: product._id,
    title: product.product_title || product?.name,
    price: product.product_price || product?.msp,
    originalPrice: product.mrp,
    discount, // percentage
    image: product?.images?.[0]?.url || "/assets/no_image.jpg",
    isNew: product.isNew,
    isBestSeller: product.isBestSeller || false,
    isWish: product.isWishList || product.isWish,
    colors: product.color_codes ? [product.color_codes] : [], // FIXED
    size: product.size,
    variantId: product.item_code_ids?.[0]
  };
});
