import { FC, useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MegaMenuSkeleton from "../MegaMenuSkeleton";
import { useMegaMenuStores } from "@/store/megaMenuStore";

interface MegaMenuProps {
  industryId: string;
}

const MegaMenu: FC<MegaMenuProps> = ({ industryId }) => {
  const navigate = useNavigate();

  const {
    categories,
    subCategories,
    loadingCategories,
    loadingSubCategories,
    fetchCategories,
    fetchSubCategories,
  } = useMegaMenuStores();

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  /* ---------------- Fetch categories when industry changes ---------------- */
  useEffect(() => {
    if (!industryId) return;

    fetchCategories(industryId);
    setActiveCategoryId(null);
  }, [industryId]);

  const industryCategories = categories[industryId] || [];

  /* ---------------- Set first category active ---------------- */
  useEffect(() => {
    if (industryCategories.length) {
      const firstId = industryCategories[0].id;
      setActiveCategoryId(firstId);
      fetchSubCategories(firstId);
    }
  }, [industryCategories]);

  const activeSubCategories =
    (activeCategoryId && subCategories[activeCategoryId]) || [];

  const navigateToProducts = ({
    industryId,
    categoryId,
    subCategoryId,
  }: {
    industryId?: string;
    categoryId?: string;
    subCategoryId?: string;
  }) => {
    const params = new URLSearchParams();

    if (industryId) params.set("industry", industryId);
    if (categoryId) params.set("category", categoryId);
    if (subCategoryId) params.set("sub", subCategoryId);

    navigate(`/products?${params.toString()}`);
  };


  /* ---------------- Loading state ---------------- */
  if (loadingCategories[industryId]) {
    return <MegaMenuSkeleton />;
  }

  if (!industryId) return null;

  /* ===================== JSX ===================== */

  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ================= LEFT (Categories) ================= */}
          <div className="col-span-1 lg:col-span-3">
            <div className="h-[350px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
              {industryCategories.map((cat) => (
                <button
                  key={cat.id}
                  onMouseEnter={() => {
                    setActiveCategoryId(cat.id);
                    fetchSubCategories(cat.id);
                  }}
                  // onClick={() => navigateToProducts(cat.id)}
                  onClick={() => navigateToProducts({
                    industryId,
                    categoryId: cat.id,
                  })}
                  className={`w-full flex justify-between items-center px-3 py-2 text-sm text-left rounded transition-colors
                    ${activeCategoryId === cat.id
                      ? "bg-orange-100/50 text-orange-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <span>{cat.category_name}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* ================= RIGHT (Sub Categories) ================= */}
          {activeCategoryId && (
            <div className="col-span-1 lg:col-span-9">
              <h3 className="text-base font-semibold text-gray-800 mb-5 ml-3">
                {
                  industryCategories.find(c => c.id === activeCategoryId)
                    ?.category_name
                }
              </h3>

              {loadingSubCategories[activeCategoryId] ? (
                <MegaMenuSkeleton />
              ) : activeSubCategories.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {activeSubCategories.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => navigateToProducts({
                        industryId,
                        categoryId: activeCategoryId,
                        subCategoryId: sub.id,
                      })
                      }
                      // onClick={() => navigateToProducts(activeCategoryId)}
                      className="flex flex-col items-center text-center cursor-pointer group"
                    >
                      <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden mb-2.5 group-hover:scale-105 transition-all">
                        <img
                          src={sub.image || "/assets/no_image.jpg"}
                          alt={sub.subcategory_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {sub.subcategory_name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 ml-3">
                  No subcategories found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* scrollbar style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; }
      `}</style>
    </div>
  );
};

export default MegaMenu;
