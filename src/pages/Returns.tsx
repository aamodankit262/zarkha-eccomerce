import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, FileText, Package, RotateCcw, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCms } from "@/hooks/useCms";
import { CMS_TYPES } from "@/services/cms.service";

const Returns = () => {
  const navigate = useNavigate();
  const { data, loading } = useCms(CMS_TYPES.RETURN);
  if (loading) return null;
  
  const sidebarItems = [
    { id: "privacy", label: "Privacy And Policy", icon: Shield },
    { id: "about", label: "About Us", icon: Info },
    { id: "terms", label: "Terms And Conditions", icon: FileText },
    { id: "shipping", label: "Shipping Policy", icon: Package },
    { id: "returns", label: "Return And Cancellation", icon: RotateCcw, active: true },
  ];

  const handleNavigation = (id: string) => {
    if (id === "returns") return;
    navigate(`/${id === "privacy" ? "privacy-policy" : id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{data?.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="lg:col-span-1 h-fit">
            <CardContent className="p-4">
              {/* <div className="text-sm text-muted-foreground mb-4">
                Hello, Dear
                <div className="font-semibold text-foreground">+91 8888899999</div>
              </div>
               */}
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${item.active
                        ? "bg-brand-orange text-white"
                        : "text-muted-foreground hover:bg-muted"
                      }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-foreground">{data?.title}</h2>

              <div className="space-y-6 text-muted-foreground">
                <div dangerouslySetInnerHTML={{ __html: data?.content }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Returns;