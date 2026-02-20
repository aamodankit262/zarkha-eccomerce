interface Product {
  _id: string;
  product_id: string;
  product_title: string;
  short_description: string;
  category: string;
  subcategory: string;
  category_id: string;
  image: string;
  stock: number| null;
  design_code: string;
  base_cost_price: number | any;
  category_percentage: number | any;
  boutique_cost_price: number | any;
  selling_price: number | any;
  profit:  number |any;
  mrp: any;
  selling_price_updated_at:  string | any;
}
export const productsData = (products: any[]) => products?.map((product: any) => {
  // const discount =
  //   product.mrp && product.product_price
  //     ? Math.round(
  //       ((product.mrp - product.product_price) / product.mrp) * 100
  //     )
  //     : 0;

  return {
    id: product._id || product.id,
    title: product.product_title || product?.name,
    price: product.product_price || product?.msp,
    originalPrice: product.mrp,
    discount : product.save_in || 0, 
    image: product?.images?.[0]?.url || "/assets/no_image.jpg",
    isNew: product.isNew,
    isBestSeller: product.isBestSeller || false,
    isWish: product?.isWishList ||  product?.isWishlist,
    colors: product.color_codes ? [product.color_codes] : [], // FIXED
    size: product.size,
    variantId: product.item_code_ids?.[0],
  };
});

export  const boutiqueProducts = (products: any[]) => products?.map((p:Product) => {
    // const priceInfo = getProductPrice(p.product_id);
    return {
      id: p._id,
      product_id: p.product_id,
      name: p.product_title,
      image: p.image,
      category: p.category,
      subcategory: p?.subcategory,
      adminPrice: p.boutique_cost_price,
      mrp:  p?.mrp || "not available",
      sellingPrice: p?.selling_price || 0,
      discount: p?.category_percentage || 0,
      stock: p.stock || 0,
      profit: p?.profit || 0,
      lastUpdated: p.selling_price_updated_at || "N/A",

    }
  })