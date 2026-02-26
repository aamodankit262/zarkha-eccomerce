import { logoImage } from "@/api/endpoints";
import { LogOut, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useBoutiqueCart } from "@/contexts/BoutiqueCartContext";
import { Badge } from "../ui/badge";
import { toast, useToast } from "@/hooks/use-toast";
import { useBoutique } from "@/contexts/BoutiqueContext";
import { useState } from "react";
import BoutiqueCart from "./BoutiqueCart";

const BoutHeader = () => {
    const navigate = useNavigate();
    const { addItem, getTotalItems, items, fetchCart } = useBoutiqueCart();
    const { isLoggedIn, user, orders, sales, logout, placeOrder, profile, toggleProductDisplay } = useBoutique();
    const { toast } = useToast();
    const [showCart, setShowCart] = useState(false);

    const handleLogout = () => {
        logout();
        toast({ title: "Logged out", description: "See you soon!" });
        navigate('/boutique');
    };
    return (
        <>
            <header className="border-b border-border bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 md:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2">
                            {/* <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground">Ethnic Store</span> */}
                            <img
                                // src={profile?.brand_logo || logoImage}
                                src={logoImage}
                                alt="Zarkha"
                                className="h-8 w-auto cursor-pointer"
                                onClick={() => navigate("/")}
                            />
                        </Link>

                        <Badge
                            variant="secondary"
                            className="hidden sm:flex">
                            {profile?.store_name ? profile?.store_name : "Boutique Partner"}
                        </Badge>
                        {/* <Badge variant="secondary" className="hidden sm:flex">Boutique Partner</Badge> */}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="relative" onClick={() => setShowCart(true)}>
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Cart</span>
                            {getTotalItems() > 0 && (
                                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-brand-orange">
                                    {getTotalItems()}
                                </Badge>
                            )}
                        </Button>
                        <Link to="/boutique/dashboard">
                            <Button variant="outline" size="sm" className="text-xs sm:text-sm">Boutique Dashboard</Button>
                        </Link>
                        {/* <Button variant="outline" size="sm" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-1 md:mr-2" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button> */}
                    </div>
                </div>
            </header>
            <BoutiqueCart isOpen={showCart} onClose={() => setShowCart(false)} />

        </>
    );
}

export default BoutHeader;