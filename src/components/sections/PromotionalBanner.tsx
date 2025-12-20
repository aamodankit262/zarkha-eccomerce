import { Button } from "@/components/ui/button";

interface PromotionalBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  onButtonClick?: () => void;
  alignment?: "left" | "center" | "right";
}

const PromotionalBanner = ({
  title,
  subtitle,
  description,
  buttonText = "Shop Now",
  backgroundImage,
  backgroundColor = "bg-gradient-to-r from-amber-50 to-amber-100",
  textColor = "text-warm-brown",
  onButtonClick,
  alignment = "center"
}: PromotionalBannerProps) => {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  return (
    <div className={`relative ${backgroundColor} rounded-lg overflow-hidden h-64`}>
      {backgroundImage && (
        <div className="absolute inset-0">
          <img 
            src={backgroundImage} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      )}
      
      <div className={`relative z-10 h-full flex items-center justify-center p-8`}>
        <div className={alignmentClasses[alignment]}>
          {subtitle && (
            <p className={`text-lg ${textColor} mb-2 opacity-80`}>{subtitle}</p>
          )}
          <h3 className={`text-2xl font-bold ${textColor} mb-2`}>{title}</h3>
          {description && (
            <p className={`text-lg ${textColor} mb-4 opacity-80`}>{description}</p>
          )}
          <Button 
            variant="brand" 
            size="sm"
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;