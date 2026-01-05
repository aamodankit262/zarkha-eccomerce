import { useEffect, useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { BusinessCategorySection as OldCategorySection } from "../business";
import Layout from "../common/Layout";
import BestSellers from "../sections/BestSellers";
import ExclusiveCollectionCarousel from "../sections/ExclusiveCarousel";
import FeaturesSection from "../sections/FeaturesSection";
import HeroSection from "../sections/HeroSection";
import MonthStartSpecial from "../sections/MonthStartPlan";
import MostWantedBanner from "../sections/MostWantedBanner";
import NewArrivals from "../sections/NewArrivals";
import NewArrivalsSection from "../sections/NewArrivalsSection";
import PerfectBottomWear from "../sections/PerfectBottomWear";
import UnmissableDeals from "../sections/UnbeatableDeals";
import { useApi } from "@/hooks/useApi";
import { HomeService } from "@/services/homeService";
// const auth = localStorage.getItem("zarkha-auth");

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showProductListing, setShowProductListing] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  // const { products, loading } = useProducts();

  const { data, loading, request } = useApi(HomeService.getHomeData);

  useEffect(() => {
    request();
  }, []);
  const HomData = data?.body
  const heroSlides = HomData?.banners || [];
  const dealsData = HomData?.offers || [];
  const getNewArrivals = HomData?.newArrivals || [];
  const getBestSelling = HomData?.bestSelling || [];
  const getExclusiveCollections = HomData?.exclusiveCollections || [];
  //  console.log("Home Data:", HomData); 
  const handleSubcategorySelect = (category: string, subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setShowProductListing(true);
    setSelectedCategory("");
  };

  const handleCloseProductListing = () => {
    setShowProductListing(false);
    setSelectedSubcategory("");
  };

  // if(loading){
  //     return <GlobalLoader/>;
  //   }
  return (
    <Layout onCategorySelect={setSelectedCategory}>
      {/* Dedicated Hero Section */}
      <div className="relative">
        <HeroSection slides={heroSlides} />
        <UnmissableDeals dealsData={dealsData} />
        {/* Category Section - Shows when category is selected */}
        {selectedCategory && (
          <div className="absolute top-0 left-0 right-0 z-20 bg-white shadow-lg">
            <div className="flex justify-center">
              <OldCategorySection
                category={selectedCategory}
                onCategorySelect={setSelectedCategory}
                onSubcategorySelect={handleSubcategorySelect}
              />
            </div>
          </div>
        )}
      </div>

      {/* Month Start Special Section */}
      <section className="py-8 md:py-4 bg-[#FAF6F2] relative">
        <MonthStartSpecial />
      </section>

      {/* Perfect Bottom Wear Banners */}
      <PerfectBottomWear />
      {!loading && getNewArrivals.length > 0 && (
        <section className="py-4 md:py-4 bg-[#FAF6F2] relative">
          <NewArrivals products={getNewArrivals} />
        </section>
      )}
      <MostWantedBanner />
      {!loading && getBestSelling.length > 0 && (
        <section className="py-4 md:py-4 bg-[#FAF6F2] relative">
          <BestSellers products={getBestSelling} />
        </section>
      )}
      {getExclusiveCollections?.length > 0 && (
        <ExclusiveCollectionCarousel collection={getExclusiveCollections} />
      )}
      <NewArrivalsSection />
      <FeaturesSection />
    </Layout>
  );
};

export default HomePage;
