import { FC, useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoImage from "/lovable-uploads/f28c5d70-6a6a-45f1-b4ca-cb9652dec39b.png";

import { useMegaMenuStores } from "@/store/megaMenuStore";
import HeaderMenuSkeleton from "../HeaderMenuSkeleton";
import MobileMenuSkeleton from "../MobileMenuSkeleton";

interface NavigationProps {
  onCategoryHover: (industryId: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  handleMegaMenuClose: () => void;
}

const Navigation: FC<NavigationProps> = ({
  onCategoryHover,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleMegaMenuClose,
}) => {
  const navigate = useNavigate();

  const {
    industries,
    categories,
    fetchIndustries,
    fetchCategories,
  } = useMegaMenuStores();

  const [expandedIndustryId, setExpandedIndustryId] = useState<string | null>(null);

  /* ---------------- Fetch industries once ---------------- */
  useEffect(() => {
    fetchIndustries();
  }, []);

  /* ---------------- Navigation helper ---------------- */
  const navigateToProducts = (params?: {
    industryId?: string;
    categoryId?: string;
  }) => {
    handleMegaMenuClose();
    setIsMobileMenuOpen(false);

    const search = new URLSearchParams();
    if (params?.industryId) search.set("industry", params.industryId);
    if (params?.categoryId) search.set("category", params.categoryId);

    navigate(`/products?${search.toString()}`);
  };

  /* ================= DESKTOP ================= */

  return (
    <>
      {!industries.length ? (
        <HeaderMenuSkeleton />
      ) : (
        <div className="bg-white border-b border-gray-200 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between w-full">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onMouseEnter={() => {
                    fetchCategories(industry.id);
                    onCategoryHover(industry.id);
                  }}
                  onClick={() =>
                    navigateToProducts({ industryId: industry.id })
                  }
                  className="text-gray-700 hover:text-orange-500 text-sm font-medium flex-1 py-3 flex justify-center items-center gap-1"
                >
                  {industry.industry_name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MOBILE ================= */}

      {isMobileMenuOpen && (
        !industries.length ? (
          <MobileMenuSkeleton />
        ) : (
          <div className="lg:hidden fixed top-0 left-0 w-full h-screen bg-white z-50 overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <img
                src={logoImage}
                alt="Zarkha"
                className="h-8 cursor-pointer"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/");
                }}
              />
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col">
              {industries.map((industry) => {
                const industryCategories = categories[industry.id] || [];

                return (
                  <div key={industry.id}>
                    <button
                      onClick={() => {
                        fetchCategories(industry.id);
                        setExpandedIndustryId(
                          expandedIndustryId === industry.id
                            ? null
                            : industry.id
                        );
                      }}
                      className="p-4 border-b flex justify-between w-full text-gray-700"
                    >
                      <span>{industry.industry_name}</span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${expandedIndustryId === industry.id ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {expandedIndustryId === industry.id && (
                      <div className="bg-gray-50">
                        {industryCategories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() =>
                              navigateToProducts({
                                industryId: industry.id,
                                categoryId: cat.id,
                              })
                            }
                            className="pl-8 pr-4 py-3 border-b text-sm text-gray-600 text-left w-full"
                          >
                            {cat.category_name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Navigation;
