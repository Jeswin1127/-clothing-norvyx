import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  Search, 
  ArrowDownUp, 
  X, 
  Sparkles,
  RefreshCcw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { PRODUCTS } from '../data/products';
import { ProductCategory } from '../types';
import { useShop } from '../context/ShopContext';
import { soundFx } from '../utils/audio';

export const ProductGrid: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    formatPrice
  } = useShop();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(450);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedBadge, setSelectedBadge] = useState<string>('all');

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'outerwear', label: 'Outerwear' },
    { id: 'hoodies-tops', label: 'Hoodies & Tops' },
    { id: 'bottoms', label: 'Cargos & Bottoms' },
    { id: 'footwear', label: 'Footwear' },
    { id: 'accessories', label: 'Accessories' },
  ];

  // Filtering and Sorting logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Price filter
      if (item.price > maxPrice) {
        return false;
      }
      // Badge filter
      if (selectedBadge !== 'all' && item.badge !== selectedBadge) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTag = item.tagline.toLowerCase().includes(q);
        const matchesMat = item.materials.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTag && !matchesMat) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured first, then id
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [selectedCategory, maxPrice, selectedBadge, searchQuery, sortBy]);

  const resetFilters = () => {
    soundFx.playClick();
    setSelectedCategory('all');
    setMaxPrice(450);
    setSelectedBadge('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <section id="products-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyber-lime font-mono text-xs uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SEASONAL CAPSULE</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            THE CATALOG
          </h2>
          <p className="text-sm text-slate-400 font-light mt-1">
            Carefully curated architectural silhouettes, luxury fabrics, and brutalist accessories.
          </p>
        </div>

        {/* Search Bar & Filter Toggle */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pieces, fabric, style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyber-lime/60 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              setShowFilters(!showFilters);
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-mono border transition-all ${
              showFilters 
                ? 'bg-cyber-lime text-black border-cyber-lime font-bold' 
                : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">FILTERS</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 scrollbar-none mb-6">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? 'bg-white text-black font-bold border-white shadow-lg shadow-white/10 scale-105'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Expandable Advanced Filter Tray */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="p-5 rounded-2xl glass-panel space-y-6 border border-white/15">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Max Price Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400">MAX PRICE</span>
                    <span className="text-cyber-lime font-bold">{formatPrice(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="450"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-cyber-lime h-1 bg-white/20 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>{formatPrice(50)}</span>
                    <span>{formatPrice(450)}</span>
                  </div>
                </div>

                {/* Badge Filter */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-2">EDITION FILTER</label>
                  <select
                    value={selectedBadge}
                    onChange={(e) => {
                      soundFx.playClick();
                      setSelectedBadge(e.target.value);
                    }}
                    className="w-full px-3 py-2 bg-obsidian-900 border border-white/15 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyber-lime"
                  >
                    <option value="all">All Editions</option>
                    <option value="LIMITED DROP">Limited Drops Only</option>
                    <option value="BESTSELLER">Bestsellers</option>
                    <option value="NEW SEASON">New Season</option>
                    <option value="EXCLUSIVE">Atelier Exclusives</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-2">SORT BY</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      soundFx.playClick();
                      setSortBy(e.target.value as any);
                    }}
                    className="w-full px-3 py-2 bg-obsidian-900 border border-white/15 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyber-lime"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

              </div>

              {/* Reset filters */}
              <div className="flex justify-end pt-2 border-t border-white/10">
                <button
                  onClick={resetFilters}
                  className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-cyber-lime transition-colors"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span>RESET ALL FILTERS</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Meta Information */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-6">
        <span>SHOWING {filteredProducts.length} PIECES</span>
        {searchQuery && (
          <span>
            MATCHING QUERY: <span className="text-cyber-lime font-bold">"{searchQuery}"</span>
          </span>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl glass-panel p-8 max-w-md mx-auto space-y-4">
          <p className="font-display font-bold text-xl text-white">NO PIECES FOUND</p>
          <p className="text-xs font-mono text-slate-400">
            No items matched your current filter criteria or search query.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-xl bg-cyber-lime text-black font-mono text-xs font-bold uppercase hover:bg-white transition-colors shadow-lg"
          >
            CLEAR ALL FILTERS
          </button>
        </div>
      )}

    </section>
  );
};
