import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Search, ExternalLink, Filter, X } from "lucide-react";
import { toast } from "sonner";
import { useAffiliate } from "@/contexts/AffiliateContext";
import { useApi } from "@/hooks/useApi";
import { AffiliateProduct, affiliateService } from "@/services/affiliateService";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "../ecommerce/Pagination";
import { NO_IMAGE } from "@/api/endpoints";
import { Label } from "@radix-ui/react-label";
import { industryService } from "@/services/industryService";
import { Slider } from "@/components/ui/slider";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AffiliateProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<any>("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [discountFilter, setDiscountFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [stockFilter, setStockFilter] = useState("all");
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [page, setPage] = useState(1);
  const limit = 30;
  // const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const { data: categories, request: fetchCategories } = useApi(industryService.getCat);
  const { data: subcategories, request: fetchSubCategories } = useApi(industryService.getSubCat);
  // const { data, request, loading } = useApi(
  //   affiliateService.productCategoryList
  // );
  const {
    data: productRes,
    request: fetchProducts,
    loading: productLoading,
  } = useApi(affiliateService.productList);

  // useEffect(() => {
  //   request();
  // }, []);
  useEffect(() => {
    fetchProducts({
      // search: debouncedSearch,
      // category_id: categoryFilter,
      // page,
      // limit,
      page,
      limit,
      category_id: categoryFilter === "all" ? undefined : categoryFilter,
      subcategory_id: subcategoryFilter === "all" ? undefined : subcategoryFilter,
      search: debouncedSearch || undefined,
      min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
      max_price: priceRange[1] < 10000 ? priceRange[1] : undefined,
    });
  }, [debouncedSearch, , 
    page, 
    categoryFilter,
    subcategoryFilter,
    debouncedSearch,
  ]);
  useEffect(() => {
    if (showFilters) {
      fetchCategories();
    }
  }, [showFilters]);

  useEffect(() => {
    if (categoryFilter !== "all") fetchSubCategories(categoryFilter);
  }, [categoryFilter]);

  // useEffect(() => {
  //   if (productRes?.body) {
  //     setProducts(productRes.body || []);
  //   }
  // }, [productRes]);
  const clearFilters = () => {
    setCategoryFilter("all");
    setSubcategoryFilter("all");
    setPriceRange([0, 10000]);
    // setDiscountFilter("all");
    // setStockFilter("all");
    setSearchQuery("");
    // setSortBy("popular");
  };

  const products = productRes?.body || [];
  // const categories = data?.body
  // categories.unshift({ id: "all", name: "All Products" })
  // const categories = useMemo(() => {
  //   if (!data?.body) return [];

  //   return [
  //     { _id: "all", name: "All Products" },
  //     ...data.body,
  //   ];
  // }, [data]);

  // const filteredProducts = products;

  const copyProductLink = (productId: string) => {
    const link = `${window.location.origin}/product/${productId}`;
    // const link = `${window.location.origin}/product/${productId}?ref=${affiliate?.referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Product link copied!");
  };
  if (productLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">

      {/* <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Products</h2>
          <p className="text-muted-foreground">Browse and promote products to earn commission</p>
        </div>
      </div> */}

      {/* Filters */}
      {/* <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <CardTitle className="text-lg">Product catalogue</CardTitle>
            <p className="text-sm text-muted-foreground">{products?.length} products</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters with Subcategory */}
          {showFilters && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Filters</span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" /> Clear All
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  {/* <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setSubcategoryFilter("all"); }}> */}
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories?.map((cat: any) => <SelectItem key={cat.id} value={cat.id}>{cat?.category_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subcategory</Label>
                  <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter} disabled={categoryFilter === "all"}>
                    <SelectTrigger><SelectValue placeholder={categoryFilter === "all" ? "Select category first" : "All Subcategories"} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subcategories</SelectItem>
                      {subcategories?.map(sub => <SelectItem key={sub?.id} value={sub.id}>{sub?.subcategory_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price: ₹{priceRange[0]} - ₹{priceRange[1]}</Label>
                  <Slider value={priceRange}
                    onValueChange={setPriceRange}
                    onValueCommit={(value) => {
                      fetchProducts({
                        page: 1,
                        limit,
                        min_price: value[0],
                        max_price: value[1],

                      })
                    }}
                    min={0}
                    max={10000}
                    step={100}
                    className="mt-2" />
                </div>
                {/* <div className="space-y-2">
                  <Label>Discount</Label>
                  <Select value={discountFilter} onValueChange={setDiscountFilter}>
                    <SelectTrigger><SelectValue placeholder="Any Discount" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Discount</SelectItem>
                      <SelectItem value="10">10% and above</SelectItem>
                      <SelectItem value="20">20% and above</SelectItem>
                      <SelectItem value="30">30% and above</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
                {/* <div className="space-y-2">
                  <Label>Stock Status</Label>
                  <Select value={stockFilter} onValueChange={setStockFilter}>
                    <SelectTrigger><SelectValue placeholder="All Stock" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="low_stock">Low Stock (≤10)</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      {/* Category Pills */}
      {/* <div className="flex flex-wrap gap-2">
        {categories?.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat._id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat._id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
          >
            {cat?.name}
          </button>
        ))}
      </div> */}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative bg-secondary">
              <img
                src={product.images?.[0]?.url || NO_IMAGE}
                alt={product.images?.[0]?.alt || product.name}
                className="w-full h-full object-cover"
              />
              {/* <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-green-600 text-xs sm:text-sm">
                {product.commission_percentage}% Commission
              </Badge> */}
            </div>
            <CardContent className="p-3 sm:p-4">
              <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base line-clamp-1">{product.name}</h3>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-base sm:text-lg font-bold text-primary">₹{product.msp}</span>
                {/* <span className="text-xs sm:text-sm text-muted-foreground">⭐ {product.rating}</span> */}
              </div>
              {/* <div className="bg-secondary/50 rounded-lg p-2 mb-2 sm:mb-3">
                <p className="text-xs text-muted-foreground">Your Earning</p>
                <p className="font-bold text-green-600 text-sm sm:text-base">
                  ₹{product.earning_per_sale} per sale
                </p>
              </div> */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs sm:text-sm"
                  onClick={() => copyProductLink(product._id)}
                >
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Copy Link
                </Button>
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm" asChild>
                  <Link
                    // to={product?.product._id}
                    to={`/product/${product._id}`}
                  >
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    View Product
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria</p>
        </div>
      )}
      {productRes?.pagination.totalPages > 1 && (
        <Pagination
          currentPage={productRes?.pagination.currentPage}
          totalPages={productRes?.pagination.totalPages}
          onPageChange={setPage}
        // onPageChange={(page) => setPage(page)}
        />
      )}
    </div>
  );
};

export default AffiliateProducts;
