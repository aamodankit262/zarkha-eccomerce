import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Plus, FolderOpen, Edit, Trash2, Share2, Download,
  Eye, Package, Layers, Filter, X, Search, FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { useApi } from "@/hooks/useApi";
import { boutiqueService } from "@/boutiqueServices/boutiqueService";
import { logger } from "@/helper/logger";
import dayjs from "dayjs";
import { useBoutique } from "@/contexts/BoutiqueContext";
import { NO_IMAGE } from "@/api/endpoints";
import Pagination from "../ecommerce/Pagination";

export interface Curation {
  _id: string;
  name: string;
  product_count?: number;
  description: string;
  product_ids: string[];
  product_details?: string[];
  created_at?: string;
  coverImage?: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  adminPrice: number;
  mrp: number;
  image: string;
  stock: number;
  discount: number;
}

const SUBCATEGORIES: Record<string, string[]> = {
  "Kurta Sets": ["Cotton Kurta", "Silk Kurta", "Embroidered Kurta", "Printed Kurta"],
  "Anarkalis": ["Floor Length", "Short Anarkali", "Net Anarkali", "Georgette Anarkali"],
  "Lehengas": ["Bridal Lehenga", "Party Wear", "A-Line Lehenga", "Circular Lehenga"],
  "Sarees": ["Banarasi", "Silk Saree", "Cotton Saree", "Chiffon Saree"],
  "Palazzo Sets": ["Printed Palazzo", "Plain Palazzo", "Embroidered Palazzo"],
  "Salwar Suits": ["Patiala", "Churidar", "Straight Suit", "Pakistani Suit"],
  "Gowns": ["Party Gown", "Evening Gown", "Indo-Western Gown"],
};

interface BoutiqueCurationsProps {
  products: Product[];
}

const BoutiqueCurations = ({ products }: BoutiqueCurationsProps) => {
  const { toast } = useToast();
  const { isLoggedIn } = useBoutique();

  const [curations, setCurations] = useState<Curation[]>(() => {
    const stored = localStorage.getItem('boutique_curations');
    return stored ? JSON.parse(stored) : [];
  });
  const { data: curationRes, request: fetchCurationList } = useApi(boutiqueService.getCurationsList)
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCuration, setEditingCuration] = useState<Curation | null>(null);
  const [newCuration, setNewCuration] = useState({ name: '', description: '', productIds: [] as string[] });
  const [viewingCuration, setViewingCuration] = useState<Curation | null>(null);

  // Product selection filters
  const [selectionSearch, setSelectionSearch] = useState("");
  const [selectionCategory, setSelectionCategory] = useState("all");
  const [selectionSubcategory, setSelectionSubcategory] = useState("all");
  const [selectionPriceRange, setSelectionPriceRange] = useState([0, 15000]);
  const [showSelectionFilters, setShowSelectionFilters] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const orderLimit = 10;

  const categories = [...new Set(products.map(p => p.category))];
  const availableSubcategories = selectionCategory !== "all" ? (SUBCATEGORIES[selectionCategory] || []) : [];

  const filteredSelectionProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(selectionSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(selectionSearch.toLowerCase());
    const matchesCategory = selectionCategory === "all" || p.category === selectionCategory;
    const matchesSubcategory = selectionSubcategory === "all" || p.subcategory === selectionSubcategory;
    const matchesPrice = p.adminPrice >= selectionPriceRange[0] && p.adminPrice <= selectionPriceRange[1];
    return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice;
  });
  useEffect(() => {
    if (isLoggedIn) {
      fetchCurationList({
        page: orderPage,
        limit: orderLimit,
      });
    }
  }, [isLoggedIn, orderPage]);

  useEffect(() => {
    if (!curationRes?.body) return;
    setCurations(body);
  }, [curationRes])
  const body = curationRes?.body || []
  const pagination = curationRes?.pagination
  // logger.log('curationList,' , body)
  const clearSelectionFilters = () => {
    setSelectionSearch("");
    setSelectionCategory("all");
    setSelectionSubcategory("all");
    setSelectionPriceRange([0, 15000]);
  };

  // const saveCurations = (updated: Curation[]) => {
  //   setCurations(updated);
  //   localStorage.setItem('boutique_curations', JSON.stringify(updated));
  // };

  const handleCreate = async () => {
    if (!newCuration.name) {
      toast({ title: "Error", description: "Please enter a curation name", variant: "destructive" });
      return;
    }
    if (newCuration.productIds.length === 0) {
      toast({ title: "Error", description: "Select at least one product", variant: "destructive" });
      return;
    }
    // const curation: Curation = {
    //   _id: `CUR${Date.now()}`,
    //   name: newCuration.name,
    //   description: newCuration.description,
    //   product_ids: newCuration.productIds,
    //   // product_count: newCuration.productIds,
    //   // product_details: newCuration.pr,
    //   created_at: new Date().toISOString().split('T')[0],
    //   coverImage: products.find(p => p.id === newCuration.productIds[0])?.image
    // };

    try {
      const payload = {
        name: newCuration.name,
        description: newCuration.description,
        product_ids: newCuration.productIds,
      }
      const res: any = await boutiqueService.CurationsAdd(payload)
      logger.log('curation add', res);
      const { success, message, body } = res
      if (success) {
        setCurations([...curations, body]);
        toast({
          title: `${message}` || "Curation Created!",
          description: `"${newCuration.name}" with ${newCuration.productIds.length} products.`
        });
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: error.response.data.error || error.response.data.message
      });
    }

    if (editingCuration) {
      // saveCurations(curations?.map(c => c._id === editingCuration._id ? { ...curation, _id: editingCuration._id, createdAt: editingCuration.created_at } : c));
      toast({ title: "Curation Updated!", description: `"${newCuration.name}" has been updated.` });
    } else {
      // saveCurations([...curations, curation]);
      toast({ title: "Curation Created!", description: `"${newCuration.name}" with ${newCuration.productIds.length} products.` });
    }

    setShowCreateDialog(false);
    setEditingCuration(null);
    setNewCuration({ name: '', description: '', productIds: [] });
    clearSelectionFilters();
  };

  const handleEdit = (curation: Curation) => {
    setEditingCuration(curation);
    setNewCuration({ name: curation.name, description: curation.description, productIds: curation.product_ids });
    clearSelectionFilters();
    setShowCreateDialog(true);
  };

  const handleDelete = (id: string) => {
    // saveCurations(curations.filter(c => c._id !== id));
    toast({ title: "Deleted", description: "Curation removed." });
  };

  const toggleProduct = (productId: string) => {
    setNewCuration(prev => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter(id => id !== productId)
        : [...prev.productIds, productId]
    }));
  };

  const handleShareCuration = (curation: Curation) => {
    const text = `Check out my "${curation.name}" collection - ${curation.product_ids.length} products!`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Curation link copied to clipboard." });
  };

  const generatePDF = (curation: Curation) => {
    const curationProducts = products.filter(p => curation.product_ids.includes(p.id));
    const doc = new jsPDF();

    // Title
    doc.setFontSize(22);
    doc.setTextColor(139, 69, 19);
    doc.text(curation.name, 105, 20, { align: "center" });

    if (curation.description) {
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(curation.description, 105, 30, { align: "center" });
    }

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);

    let y = 45;
    const pageHeight = 280;

    curationProducts.forEach((product, index) => {
      if (y > pageHeight) {
        doc.addPage();
        y = 20;
      }

      // Product entry
      doc.setFontSize(13);
      doc.setTextColor(50, 50, 50);
      doc.text(`${index + 1}. ${product.name}`, 20, y);
      y += 7;

      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text(`Category: ${product.category}${product.subcategory ? ' > ' + product.subcategory : ''}`, 25, y);
      y += 6;

      doc.text(`Price: ₹${product.adminPrice.toLocaleString()}  |  MRP: ₹${product.mrp.toLocaleString()}  |  Discount: ${product.discount}%`, 25, y);
      y += 6;

      doc.text(`Stock: ${product.stock > 0 ? product.stock + ' units available' : 'Out of Stock'}`, 25, y);
      y += 4;

      doc.setDrawColor(230, 230, 230);
      doc.line(20, y, 190, y);
      y += 8;
    });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${new Date().toLocaleDateString()} | ${curationProducts.length} products`, 105, 290, { align: "center" });

    doc.save(`${curation.name.replace(/\s+/g, '-').toLowerCase()}-catalogue.pdf`);
    toast({ title: "PDF Downloaded!", description: `"${curation.name}" catalogue saved.` });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand-orange" />
              My Curations
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Create custom product catalogues</p>
          </div>
          <Button variant="brand" size="sm" onClick={() => { setEditingCuration(null); setNewCuration({ name: '', description: '', productIds: [] }); clearSelectionFilters(); setShowCreateDialog(true); }}>
            <Plus className="h-4 w-4 mr-1" /> New Curation
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {curations?.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium text-muted-foreground">No curations yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first product catalogue</p>
            <Button variant="outline" className="mt-4" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-1" /> Create Curation
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {curations?.map(curation => {
              const curationProducts = curation.product_details;
              // const curationProducts = products.filter(p => curation.product_ids.includes(p.id));
              return (
                <Card key={curation._id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video relative bg-muted">
                    {curationProducts?.length > 0 ? (
                      <div className="grid grid-cols-2">
                        {curationProducts.slice(0, 4).map((p: any) => (
                          <img key={p._id} src={p.image || NO_IMAGE} alt={p.product_title} className="w-full h-full object-cover" />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <Badge className="absolute top-2 right-2 bg-brand-orange">
                      {curation?.product_count} items
                    </Badge>
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <h4 className="font-semibold text-sm">{curation.name}</h4>
                    {curation.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{curation.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Created: {dayjs(curation.created_at).format('DD/MM/YYYY')}</p>
                    <div className="flex gap-1 pt-1">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setViewingCuration(curation)}>
                        <Eye className="h-3 w-3 mr-1" /> View
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEdit(curation)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleShareCuration(curation)}>
                        <Share2 className="h-3 w-3" />
                      </Button>
                      <Button variant="brand" size="icon" className="h-8 w-8" onClick={() => generatePDF(curation)} title="Download PDF Catalogue">
                        <FileText className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(curation._id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>

                </Card>
              );
            })}

          </div>
        )}
      </CardContent>
      {pagination?.totalPages > 1 && (
        <Pagination
          currentPage={pagination?.currentPage}
          totalPages={pagination?.totalPages}
          onPageChange={setOrderPage}
        />
      )}
      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCuration ? 'Edit Curation' : 'Create New Curation'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Curation Name *</Label>
              <Input
                placeholder="e.g. Wedding Collection, Festive Specials"
                value={newCuration.name}
                onChange={(e) => setNewCuration(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe this collection..."
                value={newCuration.description}
                onChange={(e) => setNewCuration(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[60px]"
              />
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Select Products ({newCuration.productIds.length} selected)</Label>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowSelectionFilters(!showSelectionFilters)}>
                    <Filter className="h-4 w-4 mr-1" /> Filters
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setNewCuration(prev => ({ ...prev, productIds: prev.productIds.length === filteredSelectionProducts.length ? [] : filteredSelectionProducts.map(p => p.id) }))}>
                    {newCuration.productIds.length === filteredSelectionProducts.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={selectionSearch}
                  onChange={(e) => setSelectionSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filters */}
              {showSelectionFilters && (
                <div className="bg-muted/50 p-3 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Filters</span>
                    <Button variant="ghost" size="sm" onClick={clearSelectionFilters}>
                      <X className="h-3 w-3 mr-1" /> Clear
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Category</Label>
                      <Select value={selectionCategory} onValueChange={(v) => { setSelectionCategory(v); setSelectionSubcategory("all"); }}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Subcategory</Label>
                      <Select value={selectionSubcategory} onValueChange={setSelectionSubcategory} disabled={selectionCategory === "all"}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={selectionCategory === "all" ? "Select category" : "All"} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subcategories</SelectItem>
                          {availableSubcategories.map(sub => <SelectItem key={sub} value={sub}>{sub}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Price: ₹{selectionPriceRange[0]} - ₹{selectionPriceRange[1]}</Label>
                      <Slider value={selectionPriceRange} onValueChange={setSelectionPriceRange} min={0} max={15000} step={100} className="mt-1" />
                    </div>
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">{filteredSelectionProducts.length} products shown</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                {filteredSelectionProducts.map(product => (
                  <div
                    key={product.id}
                    className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${newCuration.productIds.includes(product.id) ? 'border-brand-orange bg-brand-orange/5' : 'hover:bg-muted'}`}
                    onClick={() => toggleProduct(product.id)}
                  >
                    <Checkbox checked={newCuration.productIds.includes(product.id)} />
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}{product.subcategory ? ` > ${product.subcategory}` : ''} • ₹{product.adminPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button variant="brand" className="flex-1" onClick={handleCreate}>
                {editingCuration ? 'Update' : 'Create'} Curation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Curation Dialog */}
      <Dialog open={!!viewingCuration} onOpenChange={() => setViewingCuration(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {viewingCuration && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>{viewingCuration.name}</DialogTitle>
                  <Button variant="brand" size="sm" onClick={() => generatePDF(viewingCuration)}>
                    <FileText className="h-4 w-4 mr-1" /> Download PDF
                  </Button>
                </div>
              </DialogHeader>
              {viewingCuration.description && (
                <p className="text-sm text-muted-foreground">{viewingCuration.description}</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products.filter(p => viewingCuration.product_ids.includes(p.id)).map(product => (
                  <Card key={product.id} className="overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
                    <CardContent className="p-2">
                      <p className="text-xs font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                      <p className="text-xs text-brand-orange font-bold">₹{product.adminPrice}</p>
                      <p className="text-xs text-muted-foreground">Stock: {product.stock > 0 ? product.stock : 'Out'}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BoutiqueCurations;
