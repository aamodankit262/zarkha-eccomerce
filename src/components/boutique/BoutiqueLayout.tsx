import { ReactNode } from "react";
// import Header from "./Header";
// import Footer from "./Footer";
import PeacockSection from "../sections/PeacockSection";
import { Footer } from "../common";
import BoutHeader from "./BoutHeader";

interface LayoutProps {
  children: ReactNode;
  onCategorySelect?: (category: string) => void;
}

const BoutiqueLayout = ({ children, onCategorySelect }: LayoutProps) => {
  return (
    <>
      <div className="min-h-screen bg-background">
        <BoutHeader />
        <main>{children}</main>
        <Footer />
      </div>
      <PeacockSection />
    </>
  );
};

export default BoutiqueLayout;
