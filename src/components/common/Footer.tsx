import React, { useEffect } from "react";
import { Facebook, Instagram, Phone, Youtube } from "lucide-react";
import { footerData } from "@/data/constant";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { industryService } from "@/services/industryService";


const Footer = () => {
  const navigate = useNavigate()
  // const { data, request } = useApi(industryService.getCatSubList)
  // useEffect(() => {
  //   request();
  // }, []);
  // const footerData = data?.data || [];
  const DUMMY_LINKS = {
    facebook: "https://example.com/facebook",
    instagram: "https://www.instagram.com/officialzarkha?igsh=MXFhNGJreXN3OGszZQ==",
    whatsapp: "https://wa.me/9821985611",
  };
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Categories */}
        {/* <div className="pt-12 mb-8">
          <h2 className="text-2xl font-bold text-warm-brown mb-6">
            Categories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {footerData.map((category) => (
              <div key={category._id} className="space-y-2">
                <h3 className="font-semibold text-warm-brown">
                  {category.name}
                </h3>

                {category.subcategories?.map((sub) => (
                  <p
                    key={sub._id}
                    className="text-muted-foreground hover:text-brand-orange cursor-pointer text-sm"
                    // onClick={() => navigate(`/category/${sub.slug}`)}
                    onClick={() =>
                      navigate(
                        `/products?industry=${category.industry_id}&category=${category._id}&sub=${sub._id}`
                      )
                    }

                  >
                    {sub.name}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div> */}


        {/* New Section with Company, For Consumers, Follow Us, Download App */}
        <div className="border-t pt-6 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Company */}
            <div className="border-r border-gray-200 pr-6">
              <h3 className="font-semibold text-gray-800 mb-3">Company</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer" onClick={() => navigate('/affiliate')} >
                  Become a partner
                </p>
                <p className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer" onClick={() => navigate('/boutique')} >
                  Boutique
                </p>
                <p className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer" onClick={() => navigate('/about')}>
                  About Us
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
                {/* <p className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                  Security
                </p> */}
                {/* <p className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                  Mobile App
                </p> */}
              </div>
            </div>

            {/* Follow Us */}
            <div className="border-r border-gray-200 pr-6">
              <h3 className="font-semibold text-gray-800 mb-3">Follow Us</h3>
              <div className="border-r border-gray-200 pr-6">
                <div className="space-y-2">
                  <a
                    href={DUMMY_LINKS.facebook}
                    onClick={(e) => e.preventDefault()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    <Facebook className="h-4 w-4" />
                    <span>Facebook</span>
                  </a>

                  <a
                    href={DUMMY_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    <Instagram className="h-4 w-4" />
                    <span>Instagram</span>
                  </a>

                  <a
                    href={DUMMY_LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    <Phone className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Download App */}
            {/* <div>
              <h3 className="font-semibold text-gray-800 mb-3">Company Details</h3>
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
            </div> */}
            {/* Company Details */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Company Details</h3>

              <div className="text-sm text-gray-600 space-y-1 leading-relaxed">
                <p className="font-medium text-gray-800">
                  ZARKHA INNOVATION & COMMERCE LLP
                </p>

                <p>Floor No.: 1/27 BLOCK 1</p>
                <p>Building: Old Double Story (Ground Floor)</p>
                <p>Road/Street: Amar Colony</p>
                <p>Near Shiv Shakti Mandir</p>
                <p>Locality: Lajpat Nagar IV</p>
                <p>City: New Delhi</p>
                <p>District: South East Delhi</p>
                <p>State: Delhi</p>
                <p className="font-medium">PIN Code: 110024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
