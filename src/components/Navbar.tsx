import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  Layers
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CurrencyCode, ProductCategory } from '../types';
import { CURRENCIES } from '../data/products';
import { soundFx } from '../utils/audio';

import { BRAND_CONFIG } from '../data/brandConfig';

interface NavbarProps {
  onNavigateToStyleLab: () => void;
  onNavigateToProducts: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateToStyleLab, onNavigateToProducts }) => {
  const { 
    cartCount, 
    wishlistCount, 
    setIsCartOpen, 
    setIsWishlistOpen,
    currency, 
    setCurrency, 
    soundEnabled, 
    toggleSound,
    isSearchOpen,
    setIsSearchOpen,
    selectedCategory,
    setSelectedCategory
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navCategories: { label: string; cat: ProductCategory }[] = [
    { label: 'ALL COLLECTIONS', cat: 'all' },
    { label: 'OUTERWEAR', cat: 'outerwear' },
    { label: 'HOODIES & TOPS', cat: 'hoodies-tops' },
    { label: 'CARGOS & BOTTOMS', cat: 'bottoms' },
    { label: 'FOOTWEAR', cat: 'footwear' },
    { label: 'ACCESSORIES', cat: 'accessories' },
  ];

  const handleCategoryClick = (cat: ProductCategory) => {
    soundFx.playClick();
    setSelectedCategory(cat);
    onNavigateToProducts();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled ? 'bg-obsidian-950/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50 py-3.5' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => {
              soundFx.playClick();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              soundFx.playClick();
              setSelectedCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-sm bg-black border border-white/20 flex items-center justify-center relative overflow-hidden group-hover:border-cyber-lime transition-all duration-300">
              <div className="absolute inset-0 bg-cyber-lime/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-3.5 h-3.5 rotate-45 bg-cyber-lime group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-display font-black text-xl sm:text-2xl tracking-tighter text-white group-hover:text-cyber-lime transition-colors">
                {BRAND_CONFIG.brandName}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 block -mt-1">
                {BRAND_CONFIG.subBrand}
              </span>
            </div>
          </a>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navCategories.map((item) => {
            const isActive = selectedCategory === item.cat;
            return (
              <button
                key={item.cat}
                onClick={() => handleCategoryClick(item.cat)}
                className={`px-3 py-1.5 text-xs font-mono tracking-wider transition-all duration-200 relative ${
                  isActive 
                    ? 'text-cyber-lime font-bold' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-cyber-lime rounded-full" />
                )}
              </button>
            );
          })}

          {/* Style Lab Interactive Feature Link */}
          <button
            onClick={() => {
              soundFx.playClick();
              onNavigateToStyleLab();
            }}
            className="ml-2 flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-cyber-lime/10 border border-cyber-lime/30 text-cyber-lime text-xs font-mono tracking-wider hover:bg-cyber-lime hover:text-black transition-all duration-300 group"
          >
            <Layers className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
            <span className="font-bold">STYLE LAB</span>
            <span className="bg-cyber-lime text-black text-[9px] font-black px-1.5 py-0.2 rounded-full group-hover:bg-black group-hover:text-cyber-lime">
              NEW
            </span>
          </button>
        </div>

        {/* Right: Utility Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Luxury Tactile Audio'}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyber-lime" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                soundFx.playClick();
                setCurrencyDropdownOpen(!currencyDropdownOpen);
              }}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded text-xs font-mono bg-white/5 border border-white/10 hover:border-white/20 text-slate-200 transition-colors"
            >
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-28 py-1 rounded-md glass-dropdown shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((cCode) => (
                  <button
                    key={cCode}
                    onClick={() => {
                      setCurrency(cCode);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-mono flex items-center justify-between hover:bg-white/10 transition-colors ${
                      currency === cCode ? 'text-cyber-lime font-bold' : 'text-slate-300'
                    }`}
                  >
                    <span>{cCode}</span>
                    <span className="text-slate-500">{CURRENCIES[cCode].symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => {
              soundFx.playClick();
              setIsSearchOpen(!isSearchOpen);
            }}
            className="p-2 text-slate-300 hover:text-cyber-lime transition-colors"
            title="Search products"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              setIsWishlistOpen(true);
            }}
            className="p-2 text-slate-300 hover:text-cyber-crimson transition-colors relative"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-cyber-crimson text-white font-mono text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Bag Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              setIsCartOpen(true);
            }}
            className="flex items-center space-x-2 bg-white/10 hover:bg-cyber-lime hover:text-black border border-white/15 px-3 py-1.5 rounded-full transition-all duration-300 group"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-cyber-lime group-hover:bg-black group-hover:text-cyber-lime text-black font-mono text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-mono font-bold hidden sm:inline">
              BAG {cartCount > 0 ? `(${cartCount})` : ''}
            </span>
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-obsidian-900/98 backdrop-blur-2xl px-6 py-6 space-y-4 shadow-2xl">
          <div className="space-y-1">
            <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2">Collections</p>
            {navCategories.map((item) => (
              <button
                key={item.cat}
                onClick={() => handleCategoryClick(item.cat)}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-mono tracking-wider transition-colors flex items-center justify-between ${
                  selectedCategory === item.cat ? 'bg-cyber-lime/10 text-cyber-lime font-bold' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                {selectedCategory === item.cat && <span className="text-cyber-lime text-xs">●</span>}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10">
            <button
              onClick={() => {
                soundFx.playClick();
                setIsMobileMenuOpen(false);
                onNavigateToStyleLab();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-cyber-lime/10 border border-cyber-lime/30 text-cyber-lime font-mono text-sm font-bold"
            >
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>INTERACTIVE STYLE LAB</span>
              </div>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
