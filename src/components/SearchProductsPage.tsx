// src/pages/SearchProductsPage.tsx
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import HeaderOtherPages from "@/components/common/HeaderOtherPages";
import { ProductCard } from "@/components/common/ProductCard";
import { productService } from "@/services/productService";

// Assume you have a search API endpoint
const searchProductsApi = async (query: string) => {
  // Replace with your actual API endpoint
  const response = await fetch(`/web/products/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("Failed to search");
  return response.json();
};

const SearchProductsPage = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, loading, error, request } = useApi(productService.getAll);

  // Debounce search query
  useEffect(() => {
    if (!debouncedQuery) return;

    request({
      search: debouncedQuery,
      page: 1,
      limit: 20,
    });
  }, [debouncedQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Trigger search when debounced query changes
  // useEffect(() => {
  //   if (debouncedQuery) {
  //     request(debouncedQuery);
  //   }
  // }, [debouncedQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const products = data?.body || []; // Adjust based on your API response structure

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery("");
    setDebouncedQuery("");
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F2]">
      <HeaderOtherPages />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div ref={searchRef} className="relative max-w-3xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => debouncedQuery && setShowSuggestions(true)}
              placeholder="Search for products, brands, and more..."
              className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
              autoFocus
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (loading || products.length > 0 || error) && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
              {loading && (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">Searching products...</p>
                </div>
              )}

              {!loading && error && (
                <div className="p-8 text-center text-gray-600">
                  Something went wrong. Please try again.
                </div>
              )}

              {!loading && !error && products.length === 0 && debouncedQuery && (
                <div className="p-8 text-center text-gray-600">
                  <p className="text-lg font-medium">No products found</p>
                  <p className="text-sm mt-2">Try searching with different keywords</p>
                </div>
              )}

              {!loading && products.length > 0 && (
                <>
                  <div className="max-h-96 overflow-y-auto">
                    {products.slice(0, 8).map((product: any) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="w-full text-left px-6 py-4 hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-0 flex items-center gap-4"
                      >
                        <img
                          src={product.image || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-orange-600 font-semibold">₹{product.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {/* {data?.pagination?.totalPages > 1 && (
                    <div className="flex justify-center gap-4 mt-10">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-2 border rounded"
                      >
                        Prev
                      </button>

                      <span>
                        Page {page} of {data.pagination.totalPages}
                      </span>

                      <button
                        disabled={page === data.pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 border rounded"
                      >
                        Next
                      </button>
                    </div>
                  )} */}

                </>

              )}
            </div>
          )}
        </div>

        {/* Main Results Grid */}
        <div>
          {loading && !showSuggestions && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Search Results for "{debouncedQuery}" ({products.length} items)
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products?.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}

          {!loading && products?.length === 0 && debouncedQuery && (
            <div className="text-center py-20">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We couldn't find any products matching "{debouncedQuery}". Try different keywords or check spelling.
              </p>
            </div>
          )}

          {!debouncedQuery && (
            <div className="text-center py-20">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Start searching for products
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Type in the search bar above to find dresses, kurtas, sarees, and more!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchProductsPage;