# E-commerce Platform

A modern, component-based e-commerce platform built with React, TypeScript, and Tailwind CSS.

## 🏗️ Architecture

### Component Structure

```
src/
├── components/
│   ├── auth/                 # Authentication components
│   │   └── SignupModal.tsx
│   ├── business/             # Business logic components
│   │   ├── AddressBook.tsx
│   │   ├── AddressForm.tsx
│   │   ├── CategorySection.tsx
│   │   └── DealsSection.tsx
│   ├── common/               # Common layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── Navigation.tsx
│   │   └── TopBar.tsx
│   ├── ecommerce/            # Core e-commerce components
│   │   ├── CartSlider.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── ProductGrid.tsx
│   │   └── ProductListing.tsx
│   ├── pages/                # Page components
│   │   └── HomePage.tsx
│   ├── sections/             # UI sections
│   │   ├── BrandStorySection.tsx
│   │   ├── CategorySection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── NewsletterSection.tsx
│   │   ├── PromotionalBanner.tsx
│   │   ├── TestimonialSection.tsx
│   │   └── TrendingSection.tsx
│   └── ui/                   # Base UI components (shadcn)
├── contexts/                 # React contexts
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── hooks/                    # Custom hooks
│   └── useProducts.ts
├── pages/                    # Route pages
└── types/                    # TypeScript types
    └── index.ts
```

## 🚀 Features

- **Component-based Architecture**: Modular, reusable components
- **Mobile-first Authentication**: Phone number + OTP login
- **Shopping Cart**: Full cart functionality with quantity management
- **Product Management**: Product listings, details, and filtering
- **Responsive Design**: Mobile-optimized layout
- **Type Safety**: Full TypeScript support

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Build Tool**: Vite

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ddd8cdb2-69f7-42ea-b64b-702fb16bb259) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
