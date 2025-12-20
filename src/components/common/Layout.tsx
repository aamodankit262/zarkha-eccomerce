import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import PeacockSection from "../sections/PeacockSection";

interface LayoutProps {
  children: ReactNode;
  onCategorySelect?: (category: string) => void;
}

const Layout = ({ children, onCategorySelect }: LayoutProps) => {
  return (
    <>
      <div className="min-h-screen bg-background">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>

      <PeacockSection />
    </>
  );
};

export default Layout;
