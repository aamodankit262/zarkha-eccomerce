import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, TrendingUp, Package, CreditCard, ShoppingBag, Users, Star, ArrowRight } from "lucide-react";
import { logoImage } from "@/api/endpoints";

const BoutiqueLanding = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Package,
      title: "Curated Products",
      description: "Access to premium ethnic wear collection from top manufacturers"
    },
    {
      icon: TrendingUp,
      title: "Set Your Margins",
      description: "Freedom to set your own selling prices and maximize profits"
    },
    {
      icon: ShoppingBag,
      title: "Easy Ordering",
      description: "Simple dashboard to place orders and track inventory"
    },
    {
      icon: CreditCard,
      title: "Quick Payments",
      description: "Fast and secure payment releases every 15 days"
    }
  ];

  const stats = [
    { value: "500+", label: "Partner Boutiques" },
    { value: "10,000+", label: "Products Available" },
    { value: "₹50L+", label: "Monthly Sales" },
    { value: "98%", label: "Partner Satisfaction" }
  ];

  const categories = [
    "Kurta Sets", "Sarees", "Lehengas", "Anarkalis",
    "Palazzo Sets", "Salwar Suits", "Indo-Western", "Bridal Wear"
  ];

  const steps = [
    { step: 1, title: "Register", description: "Sign up with your boutique details" },
    { step: 2, title: "Browse Products", description: "Explore our curated collection" },
    { step: 3, title: "Set Prices", description: "Add your margins on products" },
    { step: 4, title: "Place Orders", description: "Order inventory for your store" },
    { step: 5, title: "Sell & Earn", description: "Sell to customers and track profits" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* <div className="flex items-center gap-2">
            <Store className="h-8 w-8 text-brand-orange" />
            <span className="text-xl font-bold text-warm-brown">Zarkhai Boutique Partner</span>
          </div> */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoImage}
              alt="Zarkha"
              className="h-8 w-auto cursor-pointer"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/boutique/login')}>
              Login
            </Button>
            <Button variant="brand" onClick={() => navigate('/boutique/login?signup=true')}>
              Join Now
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-orange/10 via-cream to-warm-brown/5 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-warm-brown mb-4 md:mb-6 leading-tight">
                Grow Your Boutique with India's Finest Ethnic Wear
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
                Partner with Zarkhai to access premium quality products, set your own margins,
                and grow your business with our trusted platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="brand" onClick={() => navigate('/boutique/login?signup=true')}>
                  Become a Partner <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/boutique/login')}>
                  Existing Partner? Login
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <img
                src="/assets/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png"
                alt="Boutique Partner"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 md:py-12 bg-warm-brown text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">{stat.value}</div>
                <div className="text-xs md:text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-warm-brown mb-8 md:mb-12">
            Why Partner With Us?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 bg-brand-orange/10 rounded-full flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 md:h-8 md:w-8 text-brand-orange" />
                  </div>
                  <h3 className="font-semibold text-warm-brown mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-cream/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-warm-brown mb-8 md:mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {steps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 bg-brand-orange text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-warm-brown mb-1 text-sm md:text-base">{item.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-warm-brown mb-8 md:mb-12">
            Product Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {categories.map((category, index) => (
              <span
                key={index}
                className="px-4 md:px-6 py-2 md:py-3 bg-warm-brown/5 rounded-full text-warm-brown font-medium text-sm md:text-base hover:bg-brand-orange hover:text-white transition-colors cursor-pointer"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-brand-orange/10 to-warm-brown/10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-warm-brown mb-8 md:mb-12">
            Partner Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {[
              { name: "Priya Fashion Store", location: "Mumbai", quote: "Zarkhai partnership doubled our revenue in 6 months!" },
              { name: "Elegance Boutique", location: "Delhi", quote: "Quality products and amazing support. Highly recommended!" },
              { name: "Ethnic Trends", location: "Bangalore", quote: "The best platform for boutique owners. Easy to use dashboard." }
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-brand-orange text-brand-orange" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm md:text-base">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-warm-brown">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-warm-brown text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Grow Your Boutique?</h2>
          <p className="text-white/80 mb-6 md:mb-8 text-sm md:text-base">
            Join hundreds of successful boutique partners and start earning more today.
          </p>
          <Button
            size="lg"
            className="bg-white text-warm-brown hover:bg-white/90"
            onClick={() => navigate('/boutique/login?signup=true')}
          >
            Start Your Partnership <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 md:py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 Zarkhai. All rights reserved.</p>
          <div className="flex justify-center gap-4 md:gap-6 mt-4">
            <a href="/terms" className="hover:text-brand-orange">Terms</a>
            <a href="/privacy-policy" className="hover:text-brand-orange">Privacy</a>
            <a href="/contact-us" className="hover:text-brand-orange">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BoutiqueLanding;
