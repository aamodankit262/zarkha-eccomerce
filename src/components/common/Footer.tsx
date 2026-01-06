import React from "react";
import { Facebook, Instagram, Phone, Youtube } from "lucide-react";
import { footerData } from "@/data/constant";
import { useNavigate } from "react-router-dom";


const Footer = () => {
const navigate = useNavigate()
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Categories */}
        <div className="pt-12 mb-8">
          <h2 className="text-2xl font-bold text-warm-brown mb-6">
            Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(footerData.categories).map(([category, items]) => (
              <div key={category} className="space-y-2">
                <h3 className="font-semibold text-warm-brown">{category}</h3>
                {items.map((item) => (
                  <p
                    key={item}
                    className="text-muted-foreground hover:text-brand-orange cursor-pointer text-sm"
                  >
                    {item}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* New Section with Company, For Consumers, Follow Us, Download App */}
        <div className="border-t pt-6 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Company */}
            <div className="border-r border-gray-200 pr-6">
              <h3 className="font-semibold text-gray-800 mb-3">Company</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                  Seller
                </p>
                <p className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer" onClick={() => navigate('/about')}>
                  About
                </p>
                <p className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer" onClick={() => navigate('/contact-us')}>
                  Contact Us
                </p>
                <p className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer" onClick={() => navigate('/faq')}>
                  FAQs
                </p>
              </div>
            </div>

            {/* For Consumers */}
            <div className="border-r border-gray-200 pr-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                For Consumers
              </h3>
              <div className="space-y-2">
                <p
                onClick={() => navigate('/privacy-policy')}
                  className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                  Privacy
                </p>
                <p 
                onClick={() => navigate('/terms')}
                className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                  Terms
                </p>
                 <p 
                onClick={() => navigate('/shipping')}
                className="text-muted-foreground hover:text-brand-orange cursor-pointer text-sm"
              >
                Shipping Policy
              </p>
                <p className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                  Security
                </p>
                {/* <p className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                  Mobile App
                </p> */}
              </div>
            </div>

            {/* Follow Us */}
            <div className="border-r border-gray-200 pr-6">
              <h3 className="font-semibold text-gray-800 mb-3">Follow Us</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                  <Facebook className="h-4 w-4" />
                  <span>Facebook</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                  <Instagram className="h-4 w-4" />
                  <span>Instagram</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                  <Phone className="h-4 w-4" />
                  <span>WhatsApp</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                  <Youtube className="h-4 w-4" />
                  <span>Youtube</span>
                </div>
              </div>
            </div>

            {/* Download App */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Download App</h3>
              <div className="space-y-2">
                <div className="w-28 h-8 bg-black rounded flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                  <div className="text-white text-xs">
                    <div className="text-[7px] opacity-80">
                      Available on the
                    </div>
                    <div className="font-semibold text-[9px]">App Store</div>
                  </div>
                </div>
                <div className="w-28 h-8 bg-black rounded flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                  <div className="text-white text-xs">
                    <div className="text-[7px] opacity-80">Get it on</div>
                    <div className="font-semibold text-[9px]">Google Play</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </footer>
  );
};

export default Footer;
