import { useState } from "react";
import { Ruler, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/common/Layout";

const SizeGuide = () => {
  const [openTips, setOpenTips] = useState<Record<string, boolean>>({});

  const sizeCharts = {
    kurti: {
      name: "Kurtis & Tops",
      sizes: [
        { size: "XS", bust: "32", waist: "26", hip: "34", length: "44" },
        { size: "S", bust: "34", waist: "28", hip: "36", length: "44" },
        { size: "M", bust: "36", waist: "30", hip: "38", length: "44" },
        { size: "L", bust: "38", waist: "32", hip: "40", length: "45" },
        { size: "XL", bust: "40", waist: "34", hip: "42", length: "45" },
        { size: "XXL", bust: "42", waist: "36", hip: "44", length: "46" },
        { size: "3XL", bust: "44", waist: "38", hip: "46", length: "46" }
      ]
    },
    bottomwear: {
      name: "Pants & Bottoms",
      sizes: [
        { size: "XS", waist: "26", hip: "34", length: "39" },
        { size: "S", waist: "28", hip: "36", length: "39" },
        { size: "M", waist: "30", hip: "38", length: "39" },
        { size: "L", waist: "32", hip: "40", length: "39" },
        { size: "XL", waist: "34", hip: "42", length: "39" },
        { size: "XXL", waist: "36", hip: "44", length: "39" },
        { size: "3XL", waist: "38", hip: "46", length: "39" }
      ]
    },
    lehenga: {
      name: "Lehengas",
      sizes: [
        { size: "XS", bust: "32", waist: "26", hip: "34", skirtLength: "42" },
        { size: "S", bust: "34", waist: "28", hip: "36", skirtLength: "42" },
        { size: "M", bust: "36", waist: "30", hip: "38", skirtLength: "42" },
        { size: "L", bust: "38", waist: "32", hip: "40", skirtLength: "42" },
        { size: "XL", bust: "40", waist: "34", hip: "42", skirtLength: "42" },
        { size: "XXL", bust: "42", waist: "36", hip: "44", skirtLength: "42" },
        { size: "3XL", bust: "44", waist: "38", hip: "46", skirtLength: "42" }
      ]
    },
    saree: {
      name: "Saree Blouses",
      sizes: [
        { size: "XS", bust: "32", waist: "26", length: "14" },
        { size: "S", bust: "34", waist: "28", length: "14" },
        { size: "M", bust: "36", waist: "30", length: "15" },
        { size: "L", bust: "38", waist: "32", length: "15" },
        { size: "XL", bust: "40", waist: "34", length: "15" },
        { size: "XXL", bust: "42", waist: "36", length: "16" },
        { size: "3XL", bust: "44", waist: "38", length: "16" }
      ]
    }
  };

  const measurementTips = [
    {
      id: "bust",
      title: "How to measure Bust",
      content: "Wrap the measuring tape around the fullest part of your chest, keeping the tape parallel to the ground. Make sure the tape is snug but not tight, and you can breathe comfortably."
    },
    {
      id: "waist",
      title: "How to measure Waist",
      content: "Find your natural waistline (the narrowest point of your torso, usually just above your belly button). Wrap the tape around your waist, ensuring it's level all around."
    },
    {
      id: "hip",
      title: "How to measure Hip",
      content: "Stand with your feet together and measure around the fullest part of your hips and buttocks, keeping the tape parallel to the ground."
    },
    {
      id: "length",
      title: "How to measure Length",
      content: "For tops and kurtis, measure from the highest point of your shoulder down to where you want the garment to end. For bottoms, measure from your waist to your desired length."
    }
  ];

  const toggleTip = (id: string) => {
    setOpenTips(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Ruler className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Size Guide</h1>
            <p className="text-lg text-muted-foreground">
              Find your perfect fit with our comprehensive size charts and measurement guide.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Important Notice */}
          <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> All measurements are in inches. For the best fit, we recommend taking your measurements with a soft measuring tape while wearing well-fitted undergarments. When in doubt between two sizes, choose the larger size.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Measurement Tips */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>How to Measure</CardTitle>
                  <CardDescription>
                    Follow these steps for accurate measurements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {measurementTips.map((tip) => (
                      <Collapsible 
                        key={tip.id}
                        open={openTips[tip.id]}
                        onOpenChange={() => toggleTip(tip.id)}
                      >
                        <CollapsibleTrigger className="flex justify-between items-center w-full p-3 text-left bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                          <span className="font-medium text-foreground text-sm">{tip.title}</span>
                          {openTips[tip.id] ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-3 text-sm text-muted-foreground">
                          {tip.content}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Pro Tips:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Measure yourself, don't rely on clothing sizes</li>
                      <li>• Stand straight and breathe normally</li>
                      <li>• Ask someone to help you measure</li>
                      <li>• Take measurements over form-fitting clothes</li>
                      <li>• Round up to the nearest half inch</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Size Charts */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Size Charts</CardTitle>
                  <CardDescription>
                    Select a category to view detailed size measurements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="kurti" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                      <TabsTrigger value="kurti">Kurtis</TabsTrigger>
                      <TabsTrigger value="bottomwear">Bottoms</TabsTrigger>
                      <TabsTrigger value="lehenga">Lehengas</TabsTrigger>
                      <TabsTrigger value="saree">Blouses</TabsTrigger>
                    </TabsList>

                    {Object.entries(sizeCharts).map(([key, chart]) => (
                      <TabsContent key={key} value={key} className="mt-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-foreground">{chart.name}</h3>
                          <p className="text-sm text-muted-foreground">All measurements in inches</p>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="font-semibold">Size</TableHead>
                                {key === 'kurti' && (
                                  <>
                                    <TableHead className="text-center">Bust</TableHead>
                                    <TableHead className="text-center">Waist</TableHead>
                                    <TableHead className="text-center">Hip</TableHead>
                                    <TableHead className="text-center">Length</TableHead>
                                  </>
                                )}
                                {key === 'bottomwear' && (
                                  <>
                                    <TableHead className="text-center">Waist</TableHead>
                                    <TableHead className="text-center">Hip</TableHead>
                                    <TableHead className="text-center">Length</TableHead>
                                  </>
                                )}
                                {key === 'lehenga' && (
                                  <>
                                    <TableHead className="text-center">Bust</TableHead>
                                    <TableHead className="text-center">Waist</TableHead>
                                    <TableHead className="text-center">Hip</TableHead>
                                    <TableHead className="text-center">Skirt Length</TableHead>
                                  </>
                                )}
                                {key === 'saree' && (
                                  <>
                                    <TableHead className="text-center">Bust</TableHead>
                                    <TableHead className="text-center">Waist</TableHead>
                                    <TableHead className="text-center">Length</TableHead>
                                  </>
                                )}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {chart.sizes.map((size) => (
                                <TableRow key={size.size} className="hover:bg-muted/50">
                                  <TableCell className="font-medium">{size.size}</TableCell>
                                  {Object.entries(size).map(([measurement, value]) => {
                                    if (measurement === 'size') return null;
                                    return (
                                      <TableCell key={measurement} className="text-center">
                                        {String(value)}"
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fit Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Regular Fit</h4>
                    <p className="text-sm text-muted-foreground">
                      Our standard fit with room for comfortable movement. Follow the size chart exactly.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Relaxed Fit</h4>
                    <p className="text-sm text-muted-foreground">
                      Loose-fitting styles for maximum comfort. You may want to size down for a more fitted look.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Slim Fit</h4>
                    <p className="text-sm text-muted-foreground">
                      Close-fitting styles that follow your body shape. Consider sizing up if you prefer more room.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Still Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Can't find your size or need personalized assistance? Our customer service team is here to help you find the perfect fit.
                </p>
                <div className="space-y-2">
                  <button 
                    onClick={() => window.location.href = '/customer-service'}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm"
                  >
                    Contact Customer Service
                  </button>
                  <button 
                    onClick={() => window.location.href = '/contact-us'}
                    className="w-full border border-primary text-primary hover:bg-primary/5 px-4 py-2 rounded-md text-sm"
                  >
                    Send Us a Message
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SizeGuide;