import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

type ProductFiltersProps = {
    categories?: any[];
    subcategories?: any[];
    priceRange?: [number, number];
    setPriceRange?: (value: [number, number]) => void;

    categoryFilter?: string;
    setCategoryFilter?: (value: string) => void;

    subcategoryFilter?: string;
    setSubcategoryFilter?: (value: string) => void;

    discountFilter?: string;
    setDiscountFilter?: (value: string) => void;

    stockFilter?: string;
    setStockFilter?: (value: string) => void;

    clearFilters?: () => void;
};
const ProductFilters = ({
    categories,
    subcategories,
    priceRange,
    setPriceRange,
    categoryFilter,
    setCategoryFilter,
    subcategoryFilter,
    setSubcategoryFilter,
    discountFilter,
    setDiscountFilter,
    stockFilter,
    setStockFilter,
    clearFilters,
}: ProductFiltersProps) => {
    return (
        <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
                <span className="font-medium">Filters</span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" /> Clear All
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">

                {/* Category */}
                <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                        value={categoryFilter}
                        onValueChange={(v) => {
                            setCategoryFilter(v);
                            setSubcategoryFilter("all"); // reset subcategory
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories?.map((cat: any) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.category_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Subcategory */}
                <div className="space-y-2">
                    <Label>Subcategory</Label>
                    <Select
                        value={subcategoryFilter}
                        onValueChange={setSubcategoryFilter}
                        disabled={categoryFilter === "all"}
                    >
                        <SelectTrigger>
                            <SelectValue
                                placeholder={
                                    categoryFilter === "all"
                                        ? "Select category first"
                                        : "All Subcategories"
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Subcategories</SelectItem>
                            {subcategories?.map((sub: any) => (
                                <SelectItem key={sub.id} value={sub.id}>
                                    {sub.subcategory_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                    <Label>
                        Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                    </Label>
                    <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={0}
                        max={10000}
                        step={100}
                        className="mt-2"
                    />
                </div>

                {/* Discount */}
                {discountFilter && (

                    <div className="space-y-2">
                        <Label>Discount</Label>
                        <Select value={discountFilter} onValueChange={setDiscountFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Any Discount" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any Discount</SelectItem>
                                <SelectItem value="10">10% and above</SelectItem>
                                <SelectItem value="20">20% and above</SelectItem>
                                <SelectItem value="30">30% and above</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Stock */}
                {stockFilter && (
                    <div className="space-y-2">
                        <Label>Stock Status</Label>
                        <Select value={stockFilter} onValueChange={setStockFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Stock" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Products</SelectItem>
                                <SelectItem value="in_stock">In Stock</SelectItem>
                                <SelectItem value="low_stock">Low Stock (≤10)</SelectItem>
                                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductFilters;