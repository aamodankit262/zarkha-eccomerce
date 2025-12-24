import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Heart,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  X,
} from "lucide-react";
import { Layout } from "../common";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProductStore } from "@/store/useProductStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useMegaMenuStores } from "@/store/megaMenuStore";
import { updateUrlFilters } from "@/helper/updateUrlFilters";
import { SORT_OPTIONS, SortOption } from "@/helper/sort";
import FilterSkeleton from "../FilterSkeleton";
import { NoProductsFound } from "../NoProductsFound";
import ProductCardSkeleton from "../ProductCardSkeleton";
import { ProductCompactSkeleton } from "../ProductCompactSkeleton";
type FilterKey = "category" | "subCategory";
type FilterSectionProps = {
  title: string;
  items: { label: string; value: string }[];
  filterKey: FilterKey;
};

const ProductListingPage = () => {
  // const [currentPage, setCurrentPage] = useState(1);
  // const [sortBy, setSortBy] = useState("Bestsellers");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const industryId = searchParams.get("industry");
  const subCategoryId = searchParams.get("sub");
  const { categories, subCategories, fetchCategories, fetchSubCategories, loadingCategories } = useMegaMenuStores();
  const sortBy = (searchParams.get("sort") as SortOption) || "all";
  const handleSortChange = (value: SortOption) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    params.set("page", "1");
    navigate(`/products?${params.toString()}`, { replace: true });
  };
  const {
    filters,
    setFilters,
    page,
    setPage,
    fetchProducts,
    totalPages,
    productsList,
    filterByName,
    loading,
  } = useProductStore();
  const pageTitle = useMemo(() => {
    if (loading) return "";

    if (subCategoryId) return filterByName?.subcategory;
    if (categoryId) return filterByName?.category;
    if (industryId) return filterByName?.industry;

    return "Products";
  }, [loading, subCategoryId, categoryId, industryId, filterByName]);

  const products = productsList?.map((p: any) => {
    return {
      id: p._id,
      image: p.images[0]?.url || '/assets/no_image.jpg',
      title: p.name,
      price: p.product_price,
      originalPrice: p.mrp ? `MRP ₹${p.mrp}` : undefined,
      discount: p.discount ? `Save ${p.discount}` : undefined,
      colors: p.color ? p.color.map((c: string) => {
        switch (c.toLowerCase()) {
          case "red": return "#FF0000";
          case "blue": return "#0000FF";
          case "green": return "#008000";
          case "yellow": return "#FFFF00";
          case "black": return "#000000";
          case "white": return "#FFFFFF";
          case "pink": return "#FFC0CB";
          case "purple": return "#800080";
        }  return "#808080"; // default gray for unknown colors
      }) : [],
      isNew: p.isNew || false,
      isBestSeller: p.isBestSeller || false,
      hasWishlist: false,
      rating: p.rating,
      reviews: p.reviews,
      selectedSize: p.size && p.size.length > 0 ? p.size[0] : "M",
      color: p.color && p.color.length > 0 ? p.color[0] : "Default",
      quantity: 1,
      createdAt: p.create_at
    };
  });


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    if (!industryId) return;

    if (!categories[industryId]) {
      fetchCategories(industryId);
    }
  }, [industryId]);

  useEffect(() => {
    if (!categoryId) return;

    if (!subCategories[categoryId]) {
      fetchSubCategories(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    setFilters({
      industry: industryId ? [industryId] : [],
      category: categoryId ? [categoryId] : [],
      subCategory: subCategoryId ? [subCategoryId] : [],
    });

    setPage(1); // reset pagination on filter change
  }, [industryId, categoryId, subCategoryId, setFilters, setPage]);


  useEffect(() => {
    fetchProducts();
  }, [debouncedFilters, page, fetchProducts]);

   const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    let result = [...products];

    switch (sortBy) {
      case "all":
        return result;
      case "bestseller":
        return result.filter(p => p.isBestSeller===1);

      case "price_asc":
        return result.sort((a, b) => a.price - b.price);

      case "price_desc":
        return result.sort((a, b) => b.price - a.price);

      case "newest":
        return result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

      case "rating":
        return result.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      default:
        return result;
    }
  }, [products, sortBy]);


  const filterData = useMemo(() => {
    const data: {
      title: string;
      key: "category" | "subCategory";
      items: { label: string; value: string }[];
    }[] = [];

    // 1️⃣ CATEGORY (depends on industry)
    if (industryId && categories[industryId]) {
      data.push({
        title: "Category",
        key: "category",
        items: categories[industryId].map((cat: any) => ({
          label: cat.category_name,
          value: cat.id,
        })),
      });
    }

    // 2️⃣ SUBCATEGORY (depends on category)
    if (filters.category.length > 0) {
      const selectedCategoryId = filters.category[0];
      const subs = subCategories[selectedCategoryId] || [];

      data.push({
        title: "Sub Category",
        key: "subCategory",
        items: subs.map((sub: any) => ({
          label: sub.subcategory_name,
          value: sub.id,
        })),
      });
    }

    return data;
  }, [industryId, filters.category, categories, subCategories]);




  const FilterSection = ({ title, items, filterKey }: FilterSectionProps) => {
    // const [isOpen, setIsOpen] = useState(true);
    const { filters, setFilters } = useProductStore();

    const selectedValues = filters[filterKey];

    const isCategory = filterKey === "category";
    const isSubCategory = filterKey === "subCategory";

    const hasCategorySelected = filters.category.length > 0;

    const isDisabled = isSubCategory && !hasCategorySelected;

    const noCategoryData = isCategory && items.length === 0;
    const noSubCategoryData =
      isSubCategory && hasCategorySelected && items.length === 0;



    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleChange = (value: string, checked: boolean) => {
      if (filterKey === "category") {
        updateUrlFilters(navigate, searchParams, {
          category: checked ? value : undefined,
          sub: undefined, // reset subcategory
        });
      }

      if (filterKey === "subCategory") {
        updateUrlFilters(navigate, searchParams, {
          sub: checked ? value : undefined,
        });
      }
    };
    return (
      <div className="pb-4 mb-4 border-b border-gray-100">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900"
        >
          {title}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {isOpen && (
          <div className="mt-3 space-y-2">
            {noCategoryData && (
              <p className="text-sm text-gray-400">
                No categories available
              </p>
            )}

            {noSubCategoryData && (
              <p className="text-sm text-gray-400">
                No subcategories available for this category
              </p>
            )}

            {!noCategoryData && !noSubCategoryData &&
              items.map((item) => (
                <label
                  key={item.value}
                  className={`flex items-center space-x-2 p-1 rounded
                  ${isDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-gray-50"
                    }`}
                >
                  <input
                    type="checkbox"
                    disabled={isDisabled}
                    checked={selectedValues.includes(item.value)}
                    onChange={(e) =>
                      handleChange(item.value, e.target.checked)
                    }
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {item.label}
                  </span>
                </label>
              ))}

            {isDisabled && (
              <p className="text-xs text-gray-400 mt-2">
                Select a category first
              </p>
            )}
          </div>
        )}
      </div>
    );
  };



  const handleProductClick = (productId: number) => {
    window.location.href = `/product/${productId}`;
  };

  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const ProductCard = ({ product }: { product: (typeof products)[0] }) => {
    const handleAddToCart = (e: React.MouseEvent) => {
      e.stopPropagation();
      // addItem({
      //   id: product.id,
      //   name: product.title,
      //   image: product.image,
      //   size: product.selectedSize,
      //   color: product.color,
      //   price: +product.price,
      //   quantity: product.quantity,
      // });
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart`,
      });
    };

    if (viewMode === "compact") {
      return (
        <div
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleProductClick(product.id)}
        >
          <div className="flex p-3 sm:p-4 gap-3 sm:gap-4">
            {/* Image Section */}
            <div className="relative flex-shrink-0">
              <img
                src={product.image}
                alt={product.title}
                className="w-24 h-28 sm:w-32 sm:h-40 object-cover rounded-lg"
              />
              {/* === CHANGE: Badges container for left alignment and stacking === */}
              <div className="absolute top-1 left-1 flex flex-col items-start gap-y-1">
                {product.isNew && (
                  <div className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
                    New
                  </div>
                )}
                {product.isBestSeller && (
                  <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                    Bestseller
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-sm text-gray-600 mr-2">Colors:</span>
                  {product.colors.map((color: string, index: number) => (
                    <div
                      key={index}
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    {product.price}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {product.originalPrice}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    {product.discount}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="flex-1 mr-3 border border-orange-500 text-orange-500 py-2 px-4 rounded text-sm font-medium hover:bg-orange-50 transition-colors"
                  onClick={handleAddToCart}
                >
                  Add To Cart
                </button>
                <button
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Grid view
    return (
      <div
        className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => handleProductClick(product?.id)}
      >
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 sm:h-56 lg:h-64 object-cover"
          />
          {/* === CHANGE: Badges container for left alignment and stacking === */}
          <div className="absolute top-2 left-2 flex flex-col items-start gap-y-1.5">
            {product.isNew && (
              <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                New Arrivals
              </div>
            )}
            {product.isBestSeller && (
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                Best Seller
              </div>
            )}
          </div>
          {product.hasWishlist && (
            <button
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>

        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            {product.colors.map((color: string, index: number) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              {product.price}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {product.originalPrice}
            </span>
            <span className="text-sm text-green-600 font-medium">
              {product.discount}
            </span>
          </div>
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>
          <button
            className="w-full border border-orange-500 text-orange-500 py-2 px-4 rounded text-sm font-medium hover:bg-orange-50 transition-colors"
            onClick={handleAddToCart}
          >
            Add To Cart
          </button>
        </div>
      </div>
    );
  };

  const FilterModal = () => (
    <div
      className={`fixed inset-0 z-50 ${showFilters ? "block" : "hidden"
        } lg:hidden`}
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => setShowFilters(false)}
      />

      <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                // setFilters({
                //   category: [],
                //   subCategory: [],
                //   discount: [],
                //   price: [],
                //   size: [],
                //   color: [],
                //   fabric: [],
                // })
                updateUrlFilters(navigate, searchParams, {
                  industry: industryId,
                  category: undefined,
                  sub: undefined,
                })
              }
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              Clear all
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4 h-full overflow-y-auto pb-20">
          {filterData?.map((filter) => (
            <FilterSection
              key={filter.title}
              title={filter.title}
              items={filter.items} // [{label, value}]
              filterKey={filter.key}
            />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button
            onClick={() => setShowFilters(false)}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {(industryId || categoryId) && (

            <div
              className="hidden lg:block w-64 bg-white rounded-lg shadow-sm h-fit sticky top-4"
              style={{ top: "11rem" }}
            >
              { }
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Filter
                  </h2>
                </div>
                <button
                  onClick={() =>
                    setFilters({
                      category: [],
                      subCategory: [],
                      discount: [],
                      price: [],
                      size: [],
                      color: [],
                      fabric: [],
                    })
                  }
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  Clear all
                </button>
              </div>
              <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* {filterData.map((f) => (
                  <FilterSection
                    key={f.key}
                    title={f.title}
                    items={f.items}
                    filterKey={f.key}
                  />
                ))} */}
                {industryId && loadingCategories[industryId] ? (
                  <FilterSkeleton />
                ) : (
                  filterData.map((f) => (
                    <FilterSection
                      key={f.key}
                      title={f.title}
                      items={f.items}
                      filterKey={f.key}
                    />
                  ))
                )}
              </div>
            </div>
            )}
          {(industryId || categoryId) && (

            <FilterModal />
          ) }

            <div className="flex-1">
              <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4 lg:mb-0">
                  <h1 className="text-xl font-semibold text-gray-900 min-h-[28px]">
                    {loading ? (
                      <span className="inline-block w-52 h-6 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      pageTitle
                    )}
                  </h1>


                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-1 border border-gray-300 rounded p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 ${viewMode === "grid"
                          ? "bg-orange-500 text-white rounded"
                          : "text-gray-500 hover:text-gray-700"
                          }`}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("compact")}
                        className={`p-1.5 ${viewMode === "compact"
                          ? "bg-orange-500 text-white rounded"
                          : "text-gray-500 hover:text-gray-700"
                          }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                      <span className="text-sm text-gray-600">Sort By:</span>
                      <select
                        value={sortBy}
                        // onChange={(e) => setSortBy(e.target.value)}
                        onChange={(e) => handleSortChange(e.target.value as SortOption)}
                        className="border border-gray-300 px-3 py-1 text-sm bg-white rounded focus:ring-2 focus:ring-orange-500 flex-1 sm:flex-initial"
                      >
                        
                        {SORT_OPTIONS?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6"
                      : "space-y-4 mb-6"
                  }
                >
                  {[...Array(9)].map((_, i) =>
                    viewMode === "grid" ? (
                      <ProductCardSkeleton key={i} />
                    ) : (
                      <ProductCompactSkeleton key={i} />
                    )
                  )}
                </div>
              ) : sortedProducts.length === 0 ? (
                <NoProductsFound />
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6"
                      : "space-y-4 mb-6"
                  }
                >
                  {sortedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}

              {!loading && sortedProducts.length !== 0 && (
                <div className="bg-white shadow-sm rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2">

                    {/* Previous */}
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .slice(Math.max(0, page - 2), page + 1)
                      .map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`px-3 py-2 text-sm rounded ${page === p
                            ? "bg-orange-500 text-white"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                        >
                          {p}
                        </button>
                      ))}

                    {/* Next */}
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductListingPage;