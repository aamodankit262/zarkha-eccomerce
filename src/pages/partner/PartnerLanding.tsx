import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Store, TrendingUp, Package, Star, ArrowRight,
  Percent, Wallet, Gift, ShoppingBag, CheckCircle,
  Users, Sparkles, Award, HeartHandshake, ChevronRight
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { logoImage } from "@/api/endpoints";
import { useAffiliate } from "@/contexts/AffiliateContext";
import { useBoutique } from "@/contexts/BoutiqueContext";

const PartnerLanding = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isLoggedIn: affiliateLoggedIn, } = useAffiliate();
  const { isLoggedIn: boutiqueLoggedIn } = useBoutique();

  const partnerTypes = [
    {
      id: 'affiliate',
      title: 'Affiliate Partner',
      description: 'Earn commissions by sharing products with your audience',
      icon: Percent,
      features: ['Up to 20% commission', 'Unique referral codes', 'Real-time tracking', 'Monthly payouts'],
      cta: 'Start Earning',
      color: 'bg-primary',
      link: '/partner/login?type=affiliate',
      gradient: 'from-primary/20 to-primary/5'
    },
    {
      id: 'boutique',
      title: 'Boutique Partner',
      description: 'Access wholesale products and set your own margins',
      icon: Store,
      features: ['Wholesale pricing', 'Set your margins', 'Bulk ordering', 'Quick payments'],
      cta: 'Start Selling',
      color: 'bg-brand-orange',
      link: '/partner/login?type=boutique',
      gradient: 'from-brand-orange/20 to-brand-orange/5'
    }
  ];

  const stats = [
    { value: "5000+", label: "Active Partners", icon: Users },
    { value: "₹1Cr+", label: "Partner Earnings", icon: Wallet },
    { value: "10,000+", label: "Products", icon: Package },
    { value: "98%", label: "Satisfaction", icon: Award }
  ];

  const benefits = [
    {
      icon: <Wallet className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Flexible Earnings",
      description: "Choose your path - commissions or margins"
    },
    {
      icon: <Package className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Premium Products",
      description: "Access to authentic ethnic wear collection"
    },
    {
      icon: <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Growth Support",
      description: "Dedicated support and analytics dashboard"
    },
    {
      icon: <Gift className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Exclusive Benefits",
      description: "Early access, special discounts & rewards"
    }
  ];

  const steps = [
    { step: 1, title: "Choose Your Path", description: "Select affiliate or boutique partner program" },
    { step: 2, title: "Quick Registration", description: "Simple signup in under 2 minutes" },
    { step: 3, title: "Get Your Tools", description: "Access dashboard, links & marketing materials" },
    { step: 4, title: "Start Earning", description: "Share products and earn commissions or margins" }
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Fashion Influencer", quote: "Doubled my passive income in 3 months!", avatar: "PS" },
    { name: "Elegance Boutique", role: "Boutique Partner", quote: "Best wholesale platform with amazing margins.", avatar: "EB" },
    { name: "Rahul Verma", role: "Content Creator", quote: "Easy to use dashboard and quick payouts!", avatar: "RV" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/"
            className="flex items-center gap-2"
          //  className="flex items-center gap-2 group"
          >
            <img
              src={logoImage}
              alt="Zarkha"
              className="h-8 w-auto cursor-pointer"
            />
            {/* <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-brand-orange to-warm-brown rounded-lg flex items-center justify-center">
               <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
             </div> */}
            {/* <div className="flex flex-col">
               <span className="text-sm sm:text-lg font-bold text-warm-brown leading-tight">Zarkhai</span>
               <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight">Partner Program</span>
             </div> */}
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">

            {(!affiliateLoggedIn || !boutiqueLoggedIn) && (
              <>
                <Link to="/partner/login">
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm">Login</Button>
                </Link>
                <Link to="/partner/login?signup=true">
                  <Button variant="brand" size="sm" className="text-xs sm:text-sm shadow-lg shadow-brand-orange/20">
                    Join Now
                  </Button>
                </Link>
              </>
            )}
            {affiliateLoggedIn  && (
              <>
                <Link to="/affiliate/dashboard">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">Affiliate Dashboard</Button>
                </Link>
                {/* <Link to="/boutique/dashboard">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">Boutique Dashboard</Button>
                </Link> */}
              </>
            )}
            {boutiqueLoggedIn && (
              <>
                <Link to="/boutique/dashboard">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">Boutique Dashboard</Button>
                </Link>
              </>
            )}


          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 via-cream to-warm-brown/5" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-12 sm:py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-orange/20 to-warm-brown/20 text-brand-orange rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              Partner Program 2024
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-warm-brown mb-4 sm:mb-6 leading-tight">
              Partner with India's
              <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-warm-brown"> #1 Ethnic Fashion</span>
              <span className="block">Platform</span>
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Join our growing network of partners earning commissions and profits with premium ethnic wear.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
              <Button
                size={isMobile ? "default" : "lg"}
                variant="brand"
                className="shadow-xl shadow-brand-orange/30"
                onClick={() => navigate('/partner/login?signup=true')}
              >
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size={isMobile ? "default" : "lg"}
                variant="outline"
                onClick={() => navigate('/partner/login')}
              >
                Already a Partner? Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-10 sm:py-16 relative z-20 -mt-6 sm:-mt-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {partnerTypes.map((type) => (
              <Card
                key={type.id}
                className={`overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-brand-orange/30 bg-gradient-to-br ${type.gradient} group cursor-pointer`}
                onClick={() => navigate(type.link)}
              >
                <CardContent className="p-5 sm:p-8">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${type.color} rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <type.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-warm-brown mb-2">{type.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base">{type.description}</p>
                  <ul className="space-y-2 mb-5 sm:mb-6">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="brand" className="w-full group-hover:shadow-lg transition-shadow">
                    {type.cta} <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-warm-brown via-warm-brown to-warm-brown/90 text-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 bg-white/10 rounded-full flex items-center justify-center">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-brand-orange" />
                </div>
                <div className="text-xl sm:text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 sm:py-16 bg-gradient-to-b from-background to-cream/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-warm-brown mb-2 sm:mb-3">How It Works</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Get started in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {steps.map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-brand-orange to-warm-brown text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg sm:text-xl font-bold shadow-lg">
                  {item.step}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-5 sm:top-7 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-brand-orange/50 to-transparent" />
                )}
                <h3 className="text-xs sm:text-base font-semibold text-warm-brown mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-[10px] sm:text-sm leading-tight">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-10 sm:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-warm-brown mb-2 sm:mb-3">Why Partner With Us?</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Benefits that help you grow</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 group border-0 bg-gradient-to-b from-card to-card/50">
                <CardContent className="pt-6 pb-6 px-3 sm:px-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-brand-orange/20 to-brand-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-brand-orange group-hover:scale-110 transition-transform">
                    {benefit.icon}
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-warm-brown mb-1 sm:mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 sm:py-16 bg-gradient-to-br from-cream/50 to-brand-orange/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-warm-brown mb-2 sm:mb-3">Partner Success Stories</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Hear from our thriving partner community</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-1 mb-3 sm:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-brand-orange text-brand-orange" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-orange to-warm-brown flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-warm-brown text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-warm-brown via-warm-brown to-brand-orange text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/20 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-white/10 rounded-full flex items-center justify-center">
            <HeartHandshake className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">Ready to Grow Together?</h2>
          <p className="text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Join our partner network today and start your journey to success!
          </p>
          <Button
            size={isMobile ? "default" : "lg"}
            variant="secondary"
            className="shadow-xl text-base sm:text-lg px-6 sm:px-10"
            onClick={() => navigate('/partner/login?signup=true')}
          >
            Become a Partner <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">&copy; 2024 Zarkhai. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-3 sm:mt-4">
            <Link to="/terms" className="text-sm hover:text-brand-orange transition-colors">Terms</Link>
            <Link to="/privacy-policy" className="text-sm hover:text-brand-orange transition-colors">Privacy</Link>
            <Link to="/contact-us" className="text-sm hover:text-brand-orange transition-colors">Contact</Link>
            <Link to="/" className="text-sm hover:text-brand-orange transition-colors">Shop</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PartnerLanding;