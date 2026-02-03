import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  Users,
  TrendingUp,
  Gift,
  CheckCircle,
  ArrowRight,
  Percent,
  ShoppingBag,
  Wallet
} from "lucide-react";
import { logoImage } from "@/api/endpoints";
import { useAffiliate } from "@/contexts/AffiliateContext";

const AffiliateLanding = () => {
  const { affiliate, isLoggedIn, logout } = useAffiliate();

  const benefits = [
    {
      icon: <Percent className="h-8 w-8" />,
      title: "High Commissions",
      description: "Earn up to 20% commission on every sale through your referral link"
    },
    {
      icon: <Gift className="h-8 w-8" />,
      title: "Exclusive Coupons",
      description: "Get unique discount codes to share with your audience"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Real-time Tracking",
      description: "Track your sales, clicks, and earnings in real-time dashboard"
    },
    {
      icon: <Wallet className="h-8 w-8" />,
      title: "Monthly Payouts",
      description: "Get paid monthly directly to your bank account"
    }
  ];

  const stats = [
    { value: "5000+", label: "Active Affiliates" },
    { value: "₹50L+", label: "Paid to Affiliates" },
    { value: "20%", label: "Top Commission Rate" },
    { value: "48hrs", label: "Quick Approval" }
  ];

  const steps = [
    { step: 1, title: "Sign Up", description: "Create your free affiliate account in minutes" },
    { step: 2, title: "Get Your Link", description: "Receive your unique referral code and links" },
    { step: 3, title: "Share & Promote", description: "Share products with your audience" },
    { step: 4, title: "Earn Money", description: "Earn commission on every successful sale" }
  ];

  const categories = [
    "Fashion Influencer",
    "Lifestyle Blogger",
    "Social Media Creator",
    "YouTube Reviewer",
    "Website Owner",
    "Email Marketer"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoImage}
              alt="Zarkha"
              className="h-8 w-auto cursor-pointer"
            />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            {isLoggedIn ? (
              <Link to="/affiliate/dashboard">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">Go To Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/affiliate/login">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">Login</Button>
                </Link>
                <Link to="/affiliate/login?signup=true">
                  <Button className="bg-primary hover:bg-primary/90 text-xs sm:text-sm" size="sm">Join Now</Button>
                </Link>
              </>
            )}

          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/20 text-primary rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              Affiliate Program
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Turn Your Influence Into
              <span className="text-primary"> Income</span>
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-2">
              Join our affiliate program and earn up to 20% commission on every sale.
              Share beautiful ethnic fashion with your audience and get rewarded.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link to="/affiliate/login?signup=true">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-sm sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                  Start Earning Today
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link to="/affiliate/login">
                <Button size="lg" variant="outline" className="text-sm sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                  Already a Partner? Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 sm:py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-base text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Why Partner With Us?</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to succeed as an affiliate partner
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-4 pb-4 sm:pt-8 sm:pb-6 px-3 sm:px-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-primary">
                    <div className="scale-75 sm:scale-100">{benefit.icon}</div>
                  </div>
                  <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">How It Works</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Get started in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {steps.map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl font-bold">
                  {item.step}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-5 sm:top-6 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
                <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Who Can Join?</h2>
            <p className="text-sm sm:text-base text-muted-foreground">We welcome all types of content creators and marketers</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-6 sm:py-3 bg-card border border-border rounded-full"
              >
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-xs sm:text-base text-foreground font-medium">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-4 sm:mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-sm sm:text-base text-primary-foreground/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of affiliates who are already earning with us.
            Sign up today and get your first commission within days!
          </p>
          <Link to="/affiliate/login?signup=true">
            <Button size="lg" variant="secondary" className="text-sm sm:text-lg px-6 sm:px-10">
              Join Affiliate Program
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Ethnic Store. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link to="/terms" className="hover:text-primary">Terms</Link>
            <Link to="/privacy-policy" className="hover:text-primary">Privacy</Link>
            <Link to="/contact-us" className="hover:text-primary">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AffiliateLanding;
