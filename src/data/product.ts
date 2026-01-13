 export const productsData = (products: any[]) => products?.map((product: any) => {
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
      isNew: product.isNew,
      isWish: product.isWish,
      colors: product.color ? [product.color] : [], // FIXED
      size: product.size,
      variantId: product.item_code_ids?.[0]
    };
  });
// export const productsData = [
//   {
//     id: 1,
//     title: "Purple Lehenga Set With Hand Embroidered Blouse And Dupatta",
//     price: 800,
//     originalPrice: 1000,
//     discount: 20,
//     image: "/product-1.webp",
//     isNew: true,
//     colors: ["#800080", "#000080", "#8B0000"], // Purple, Navy, Dark Red
//   },
//   {
//     id: 2,
//     title: "Purple Lehenga Set With Hand Embroidered Blouse And Dupatta",
//     price: 800,
//     originalPrice: 1000,
//     discount: 20,
//     image: "/product-2.webp",
//     isNew: true,
//     colors: ["#FFD700", "#000080", "#228B22"], // Gold, Navy, Green
//   },
//   {
//     id: 3,
//     title: "Purple Lehenga Set With Hand Embroidered Blouse And Dupatta",
//     price: 800,
//     originalPrice: 1000,
//     discount: 20,
//     image: "/product-3.webp",
//     isNew: true,
//     colors: ["#8B0000", "#FFD700", "#800080"], // Dark Red, Gold, Purple
//   },
//   {
//     id: 4,
//     title: "Purple Lehenga Set With Hand Embroidered Blouse And Dupatta",
//     price: 800,
//     originalPrice: 1000,
//     discount: 20,
//     image: "/product-4.webp",
//     isNew: true,
//     colors: ["#000080", "#800080", "#228B22"], // Navy, Purple, Green
//   },
// ];