import React from 'react';
import { ShopProvider } from './context/ShopContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { StyleLab } from './components/StyleLab';
import { LookbookHotspots } from './components/LookbookHotspots';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';

const AppContent: React.FC = () => {
  const scrollToProducts = () => {
    const el = document.getElementById('products-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToStyleLab = () => {
    const el = document.getElementById('style-lab');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col selection:bg-cyber-lime selection:text-black">
      {/* Top Announcements Ticker */}
      <AnnouncementBar />

      {/* Sticky Glass Navbar */}
      <Navbar
        onNavigateToStyleLab={scrollToStyleLab}
        onNavigateToProducts={scrollToProducts}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <Hero
          onExploreClick={scrollToProducts}
          onStyleLabClick={scrollToStyleLab}
        />

        {/* Product Catalog & Filtering */}
        <ProductGrid />

        {/* Interactive Style Lab Outfit Studio */}
        <StyleLab />

        {/* Editorial Hotspots Lookbook */}
        <LookbookHotspots />

        {/* Customer Social Proof & Testimonials */}
        <ReviewsSection />
      </main>

      {/* Brand Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <CheckoutModal />
      <SearchModal />
    </div>
  );
};

export function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}

export default App;
