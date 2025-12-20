import { useNavigate } from "react-router-dom";
import ProductDetailsPage from "@/components/ecommerce/ProductDetails";

const ProductDetails = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  return <ProductDetailsPage onClose={handleClose} />;
};

export default ProductDetails;