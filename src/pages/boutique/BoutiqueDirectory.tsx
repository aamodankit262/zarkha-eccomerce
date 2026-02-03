import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Store, MapPin, Star, Search, ArrowRight, Filter
} from "lucide-react";

// Mock boutiques data
const allBoutiques = [
  {
    id: 'elegance-boutique',
    name: 'Elegance Boutique',
    category: 'Women Ethnic Wear',
    location: 'Mumbai, Maharashtra',
    rating: 4.8,
    reviews: 256,
    image: '/assets/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png',
    products: 45,
    featured: true
  },
  {
    id: 'royal-fashion',
    name: 'Royal Fashion House',
    category: 'Designer Wear',
    location: 'Delhi, NCR',
    rating: 4.6,
    reviews: 189,
    image: '/assets/8e7b5ac5-809f-4968-9838-2b60e5952347.png',
    products: 62,
    featured: true
  },
  {
    id: 'traditional-threads',
    name: 'Traditional Threads',
    category: 'Sarees & Lehengas',
    location: 'Jaipur, Rajasthan',
    rating: 4.7,
    reviews: 143,
    image: '/assets/beea47d5-6ae4-460a-a065-76f4befc19cb.png',
    products: 38,
    featured: false
  },
  {
    id: 'chic-collection',
    name: 'Chic Collection',
    category: 'Fusion Wear',
    location: 'Bangalore, Karnataka',
    rating: 4.5,
    reviews: 98,
    image: '/assets/a75cb8b8-9eaa-400c-b4bc-8e4201532a4c.png',
    products: 55,
    featured: false
  },
  {
    id: 'ethnic-elegance',
    name: 'Ethnic Elegance',
    category: 'Women Ethnic Wear',
    location: 'Ahmedabad, Gujarat',
    rating: 4.4,
    reviews: 76,
    image: '/assets/18b38e61-a1b9-470b-b5f8-9440d6e07cbf.png',
    products: 41,
    featured: false
  },
  {
    id: 'modern-classics',
    name: 'Modern Classics',
    category: 'Indo-Western',
    location: 'Pune, Maharashtra',
    rating: 4.3,
    reviews: 54,
    image: '/assets/15ff49d2-e060-4344-956a-c6030caf0a58.png',
    products: 33,
    featured: false
  }
];

const BoutiqueDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const categories = [...new Set(allBoutiques.map(b => b.category))];
  const locations = [...new Set(allBoutiques.map(b => b.location.split(',')[1]?.trim() || b.location))];

  const filteredBoutiques = allBoutiques.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || b.category === categoryFilter;
    const matchesLocation = locationFilter === "all" || b.location.includes(locationFilter);
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const sortedBoutiques = [...filteredBoutiques].sort((a, b) => {
    switch(sortBy) {
      case "rating": return b.rating - a.rating;
      case "reviews": return b.reviews - a.reviews;
      case "products": return b.products - a.products;
      case "name": return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const featuredBoutiques = sortedBoutiques.filter(b => b.featured);
  const regularBoutiques = sortedBoutiques.filter(b => !b.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-orange to-warm-brown text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Store className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Discover Boutiques</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Explore curated collections from trusted boutique partners across India
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search boutiques by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="products">Most Products</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured Boutiques */}
        {featuredBoutiques.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" /> Featured Boutiques
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredBoutiques.map((boutique) => (
                <Card key={boutique.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-48 h-40 sm:h-auto relative overflow-hidden">
                      <img 
                        src={boutique.image} 
                        alt={boutique.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 left-2 bg-yellow-500">Featured</Badge>
                    </div>
                    <CardContent className="flex-1 p-4">
                      <h3 className="text-lg font-bold mb-1">{boutique.name}</h3>
                      <Badge variant="outline" className="mb-2">{boutique.category}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4" />
                        {boutique.location}
                      </div>
                      <div className="flex items-center gap-4 text-sm mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{boutique.rating}</span>
                          <span className="text-muted-foreground">({boutique.reviews})</span>
                        </div>
                        <span className="text-muted-foreground">{boutique.products} products</span>
                      </div>
                      <Button variant="brand" size="sm" asChild>
                        <Link to={`/boutique/store/${boutique.id}`}>
                          Visit Store <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Boutiques */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            {searchQuery || categoryFilter !== "all" || locationFilter !== "all" 
              ? `${sortedBoutiques.length} boutiques found` 
              : 'All Boutiques'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularBoutiques.map((boutique) => (
              <Card key={boutique.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={boutique.image} 
                    alt={boutique.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-1">{boutique.name}</h3>
                  <Badge variant="outline" className="mb-2 text-xs">{boutique.category}</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3" />
                    {boutique.location}
                  </div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{boutique.rating}</span>
                      <span className="text-muted-foreground">({boutique.reviews})</span>
                    </div>
                    <span className="text-muted-foreground">{boutique.products} products</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to={`/boutique/store/${boutique.id}`}>
                      View Store <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {sortedBoutiques.length === 0 && (
          <div className="text-center py-12">
            <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No boutiques found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
              setLocationFilter("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoutiqueDirectory;
