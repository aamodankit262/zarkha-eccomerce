import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <div className="bg-warm-beige py-2 px-4 hidden md:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-warm-brown">🚚 Free Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-warm-brown">🔄 Easy Return</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-brand-orange font-medium">Spring Forward in Style! Shop New Arrivals</span>
          <span className="text-brand-orange">→</span>
        </div>
        <div className="flex items-center gap-4 text-warm-brown">
          {/* <span>Wholesale</span>
          <span>|</span> */}
          <Link to={"/affiliate"}>
          <span>Become A Partner</span>
          </Link>
          <span>|</span>
          <span>Help And Support</span>
          {/* <span>|</span>
          <span>App Download</span> */}
        </div>
      </div>
    </div>
  );
};

export default TopBar;