import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Search, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useAffiliate } from "@/contexts/AffiliateContext";
import { useApi } from "@/hooks/useApi";
import { AffiliateProduct, affiliateService } from "@/services/affiliateService";
import { useDebounce } from "@/hooks/useDebounce";
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 text-sm border rounded
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:bg-gray-100"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm border rounded
              ${page === currentPage
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
              }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 text-sm border rounded
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:bg-gray-100"
      >
        Next
      </button>
    </div>
  );
};


const AffiliateProducts = () => {
  const { affiliate } = useAffiliate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [page, setPage] = useState(1);
  const limit = 10;
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const { data, request, loading } = useApi(
    affiliateService.productCategoryList
  );
  const {
    data: productRes,
    request: fetchProducts,
    loading: productLoading,
  } = useApi(affiliateService.productList);

  useEffect(() => {
    request();
  }, []);
  useEffect(() => {
    fetchProducts({
      search: debouncedSearch,
      category_id: selectedCategory,
      page,
      limit,
    });
  }, [debouncedSearch, selectedCategory, page]);

  useEffect(() => {
    if (productRes?.body) {
      setProducts(productRes.body || []);
    }
  }, [productRes]);

  // const categories = data?.body
  // categories.unshift({ id: "all", name: "All Products" })
  const categories = useMemo(() => {
    if (!data?.body) return [];

    return [
      { _id: "all", name: "All Products" },
      ...data.body,
    ];
  }, [data]);

  const filteredProducts = products;

  const copyProductLink = (link: string) => {
    // const link = `${window.location.origin}/product/${productId}?ref=${affiliate?.referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Product link copied!");
  };
  // const copyProductLink = (productId: number) => {
  //   const link = `${window.location.origin}/product/${productId}?ref=${affiliate?.referralCode}`;
  //   navigator.clipboard.writeText(link);
  //   toast.success("Product link copied!");
  // };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Products</h2>
          <p className="text-muted-foreground">Browse and promote products to earn commission</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
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
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
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
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts?.map((product) => (
          <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative bg-secondary">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-green-600 text-xs sm:text-sm">
                {product.commission_percentage}% Commission
              </Badge>
            </div>
            <CardContent className="p-3 sm:p-4">
              <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base line-clamp-1">{product.name}</h3>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-base sm:text-lg font-bold text-primary">₹{product.msp}</span>
                {/* <span className="text-xs sm:text-sm text-muted-foreground">⭐ {product.rating}</span> */}
              </div>
              <div className="bg-secondary/50 rounded-lg p-2 mb-2 sm:mb-3">
                <p className="text-xs text-muted-foreground">Your Earning</p>
                <p className="font-bold text-green-600 text-sm sm:text-base">
                  ₹{product.earning_per_sale} per sale
                  {/* ₹{Math.round(product.msp * product.commission / 100).toLocaleString()} per sale */}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs sm:text-sm"
                  onClick={() => copyProductLink(product?.share_link)}
                >
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Copy Link
                </Button>
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm" asChild>
                  <Link
                    // to={product?.share_link}
                  to={`/product/${product._id}?affiliate=${affiliate?._id}`}
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria</p>
        </div>
      )}
      {productRes?.pagination.totalPages > 1 && (
      <Pagination
        currentPage={productRes?.pagination.currentPage}
        totalPages={productRes?.pagination.totalPages}
        onPageChange={(page) => setPage(page)}
      />
      )}
    </div>
  );
};

export default AffiliateProducts;
