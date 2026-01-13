import { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/common/Layout";
import { CMS_TYPES } from "@/services/cms.service";
import { useCms } from "@/hooks/useCms";
import { faqService } from "@/services/faqService";
import { useApi } from "@/hooks/useApi";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const {data, request} = useApi(faqService.list);
  const getQuestions = data?.body|| [];
  // const allQuestions = getQuestions.flatMap((category: any) => 
  //   category.questions.map((q: any) => ({ ...q, category: category.category }))
  // );
  console.log(getQuestions );
//   const loadFaqs = async () => {
//   const res = await faqService.list({ search: "order" });
//   console.log(res.data);
// };
// const { data, loading } = useCms(CMS_TYPES.FAQ);

//   if (loading) return null;
useEffect(() => {
    request();
}, []);
  const faqCategories = [
    {
      category: "Orders & Payment",
      icon: "💳",
      questions: [
        {
          id: "order-1",
          question: "How do I place an order?",
          answer: "To place an order, browse our products, select your desired items, choose size and color, add to cart, and proceed to checkout. You'll need to provide shipping information and payment details to complete your purchase."
        },
        {
          id: "order-2",
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI payments, net banking, and cash on delivery (COD) for eligible orders. All payments are processed securely."
        },
        {
          id: "order-3",
          question: "Can I cancel or modify my order?",
          answer: "Orders can be cancelled or modified within 1 hour of placement. After this time, please contact our customer service team. If your order has already been processed or shipped, cancellation may not be possible."
        },
        {
          id: "order-4",
          question: "Do you offer EMI options?",
          answer: "Yes, we offer EMI options on orders above ₹3,000 through select credit cards and payment partners. EMI tenure options range from 3 to 12 months depending on your bank."
        }
      ]
    },
    {
      category: "Shipping & Delivery",
      icon: "🚚",
      questions: [
        {
          id: "shipping-1",
          question: "How long does shipping take?",
          answer: "Standard shipping takes 5-7 business days, while express shipping takes 2-3 business days. Delivery times may vary based on your location and product availability."
        },
        {
          id: "shipping-2",
          question: "What are the shipping charges?",
          answer: "Standard shipping is free on orders above ₹1,999. For orders below ₹1,999, shipping charges are ₹99. Express shipping costs ₹199 regardless of order value."
        },
        {
          id: "shipping-3",
          question: "Do you ship internationally?",
          answer: "Currently, we only ship within India. We're working on expanding to international markets and will update customers when this service becomes available."
        },
        {
          id: "shipping-4",
          question: "How can I track my order?",
          answer: "Once your order ships, you'll receive a tracking number via email and SMS. You can track your order status on our website by entering your order number on the 'Track Order' page."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      icon: "↩️",
      questions: [
        {
          id: "returns-1",
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy from the date of delivery. Items must be in their original condition with tags attached. Some items like intimate wear and customized products are not eligible for returns."
        },
        {
          id: "returns-2",
          question: "How do I initiate a return?",
          answer: "To initiate a return, log into your account, go to 'My Orders', select the item you want to return, and click 'Return Item'. You can also contact our customer service team for assistance."
        },
        {
          id: "returns-3",
          question: "Who pays for return shipping?",
          answer: "Return shipping is free if the item is defective or if we sent the wrong item. For other returns like size exchanges or change of mind, customers are responsible for return shipping costs."
        },
        {
          id: "returns-4",
          question: "How long does it take to process refunds?",
          answer: "Once we receive your returned item, refunds are processed within 5-7 business days. The refund will be credited to your original payment method."
        }
      ]
    },
    {
      category: "Products & Sizing",
      icon: "👗",
      questions: [
        {
          id: "product-1",
          question: "How do I determine my size?",
          answer: "Please refer to our detailed Size Guide page which includes measurement charts for different product categories. Each product page also has specific sizing information. When in doubt, we recommend ordering a size up."
        },
        {
          id: "product-2",
          question: "Are the colors accurate on the website?",
          answer: "We make every effort to display colors accurately. However, colors may appear slightly different due to monitor settings and lighting conditions. If you're not satisfied with the color, you can return the item within our return policy."
        },
        {
          id: "product-3",
          question: "Do you offer custom sizing?",
          answer: "Currently, we don't offer custom sizing for regular products. However, some of our premium collections offer tailoring services. Check individual product pages for availability."
        },
        {
          id: "product-4",
          question: "How should I care for my garments?",
          answer: "Care instructions are provided on each product page and on the garment labels. Generally, we recommend dry cleaning for delicate items and gentle machine wash for others. Always check the specific care label."
        }
      ]
    },
    {
      category: "Account & Membership",
      icon: "👤",
      questions: [
        {
          id: "account-1",
          question: "Do I need an account to place an order?",
          answer: "You can browse and add items to cart as a guest, but you'll need to create an account to complete your purchase. Having an account also helps you track orders and manage returns easily."
        },
        {
          id: "account-2",
          question: "How do I reset my password?",
          answer: "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a reset link. If you don't receive the email, check your spam folder or contact customer service."
        },
        {
          id: "account-3",
          question: "Can I change my email address?",
          answer: "Yes, you can update your email address by going to 'My Account' > 'Profile Settings'. You'll need to verify the new email address before the change takes effect."
        },
        {
          id: "account-4",
          question: "How do I delete my account?",
          answer: "To delete your account, please contact our customer service team. Note that deleting your account will permanently remove your order history and saved information."
        }
      ]
    }
  ];

  const allQuestions = getQuestions.flatMap(category => 
    category.questions.map(q => ({ ...q, category: category.category }))
  );

  const filteredQuestions = searchQuery 
    ? allQuestions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allQuestions;

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
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
            <HelpCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find quick answers to common questions about our products, orders, and policies.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {searchQuery ? (
            // Search Results
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Search Results ({filteredQuestions.length})
              </h2>
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No questions found matching your search.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuestions.map((question) => (
                    <Card key={question.id}>
                      <Collapsible 
                        open={openItems[question.id]}
                        onOpenChange={() => toggleItem(question.id)}
                      >
                        <CollapsibleTrigger className="w-full">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-left">
                              <Badge variant="secondary" className="mb-2">
                                {question.category}
                              </Badge>
                              <CardTitle className="text-base">{question.question}</CardTitle>
                            </div>
                            {openItems[question.id] ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            <p className="text-muted-foreground">{question.answer}</p>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) 
          : (
            <div className="space-y-8">
              {getQuestions?.map((category) => (
                <Card key={category.category}>
                  {/* <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      {category.category}
                    </CardTitle>
                  </CardHeader> */}
                  <CardContent>
                    <div className="space-y-4">
                      {category.questions.map((question) => (
                        <Collapsible 
                          key={question.id}
                          open={openItems[question.id]}
                          onOpenChange={() => toggleItem(question.id)}
                        >
                          <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                            <span className="font-medium text-foreground">{question.question}</span>
                            {openItems[question.id] ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent className="p-4 text-muted-foreground">
                            {question.answer}
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
          }
        </div>

        {/* Still Need Help */}
        <div className="bg-muted/50 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our customer service team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/contact-us'}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md"
              >
                Contact Us
              </button>
              <button 
                onClick={() => window.location.href = '/customer-service'}
                className="border border-primary text-primary hover:bg-primary/5 px-6 py-3 rounded-md"
              >
                Customer Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;