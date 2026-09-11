import React, { useRef, useEffect } from 'react';
import { Search, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { soundFx } from '../utils/audio';

export const SearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    searchQuery, 
    setSearchQuery, 
    formatPrice, 
    setQuickViewProduct 
  } = useShop();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const handleClose = () => {
    soundFx.playClick();
    setIsSearchOpen(false);
  };

  const matchingProducts = searchQuery.trim() === ''
    ? []
    : PRODUCTS.filter(p => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }).slice(0, 6);

  const trendingTags = ['Heavyweight Hoodie', 'Bomber', 'Cargo Pants', 'Cuban Chain', 'Derby', 'Sunglasses'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="relative w-full max-w-2xl bg-obsidian-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10"
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center space-x-3 bg-obsidian-900">
          <Search className="w-5 h-5 text-cyber-lime" />
          <input
            ref={inputRef}
            type="text"
            placeholder="SEARCH PIECES, FABRIC, SILHOUETTES..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base font-mono text-white placeholder-slate-500 focus:outline-none uppercase"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleClose}
            className="text-xs font-mono px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-300 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Trending Searches */}
          <div>
            <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2.5 flex items-center space-x-1.5">
              <Sparkles className="w-3 h-3 text-cyber-lime" />
              <span>POPULAR SEARCHES</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    soundFx.playClick();
                    setSearchQuery(tag);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyber-lime hover:text-black border border-white/10 text-xs font-mono text-slate-300 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Instant Search Results */}
          {searchQuery.trim() !== '' && (
            <div className="space-y-3">
              <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                MATCHING PIECES ({matchingProducts.length})
              </p>

              {matchingProducts.length > 0 ? (
                <div className="space-y-2">
                  {matchingProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        soundFx.playClick();
                        setIsSearchOpen(false);
                        setQuickViewProduct(p);
                      }}
                      className="p-3 rounded-xl glass-card flex items-center space-x-3 cursor-pointer hover:border-cyber-lime/40 transition-colors group"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-12 h-14 object-cover rounded-lg bg-black border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-mono text-cyber-lime uppercase">{p.category}</span>
                        <h4 className="font-display font-bold text-sm text-white truncate group-hover:text-cyber-lime transition-colors">
                          {p.name}
                        </h4>
                        <p className="text-xs font-mono font-bold text-slate-300">{formatPrice(p.price)}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyber-lime transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 font-mono text-xs">
                  No pieces found matching "{searchQuery}".
                </div>
              )}
            </div>
          )}

        </div>
      </motion.div>

    </div>
  );
};
