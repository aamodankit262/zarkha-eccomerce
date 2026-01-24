 export const productsData = (products: any[]) => products?.map((product: any) => {
    const discount =
      product.mrp && product.product_price
        ? Math.round(
          ((product.mrp - product.product_price) / product.mrp) * 100
        )
        : 0;

    return {
      id: product._id,
      title: product.product_title,
      price: product.product_price,
      originalPrice: product.mrp,
      discount, // percentage
      image: product?.images?.[0]?.url || "/assets/no_image.jpg",
      isNew: product.isNew,
      isWish: product.isWishList || product.isWish,
      colors: product.color ? [product.color] : [], // FIXED
      size: product.size,
      variantId: product.item_code_ids?.[0]
    };
  });
