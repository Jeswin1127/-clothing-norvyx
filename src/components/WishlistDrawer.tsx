import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { soundFx } from '../utils/audio';

export const WishlistDrawer: React.FC = () => {
  const { 
    isWishlistOpen, 
    setIsWishlistOpen, 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    formatPrice,
    setQuickViewProduct 
  } = useShop();

  if (!isWishlistOpen) return null;

  const handleClose = () => {
    soundFx.playClick();
    setIsWishlistOpen(false);
  };

  const wishlistedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  const handleMoveToCart = (product: typeof wishlistedProducts[0]) => {
    addToCart(product);
    toggleWishlist(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-obsidian-950 border-l border-white/10 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-cyber-crimson fill-current" />
              <h2 className="font-display font-black text-xl text-white tracking-tight">
                WISHLIST
              </h2>
              <span className="text-xs font-mono text-slate-400">({wishlist.length})</span>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistedProducts.length > 0 ? (
              wishlistedProducts.map((product) => (
                <div 
                  key={product.id}
                  className="p-3.5 rounded-2xl glass-card flex items-center space-x-3 border border-white/10"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    onClick={() => {
                      soundFx.playClick();
                      setQuickViewProduct(product);
                    }}
                    className="w-16 h-20 object-cover rounded-xl bg-black border border-white/10 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 
                      onClick={() => {
                        soundFx.playClick();
                        setQuickViewProduct(product);
                      }}
                      className="font-display font-bold text-sm text-white truncate cursor-pointer hover:text-cyber-lime transition-colors"
                    >
                      {product.name}
                    </h4>
                    <p className="text-xs font-mono font-bold text-cyber-lime mt-1">
                      {formatPrice(product.price)}
                    </p>

                    <div className="mt-3 flex items-center space-x-2">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="flex-1 py-1.5 px-3 bg-cyber-lime hover:bg-white text-black text-xs font-mono font-bold rounded-lg transition-colors flex items-center justify-center space-x-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>MOVE TO BAG</span>
                      </button>

                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-1.5 text-slate-400 hover:text-cyber-crimson transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">NO SAVED PIECES</h3>
                  <p className="text-xs font-mono text-slate-400 mt-1">Heart any item to save it for later review.</p>
                </div>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase transition-colors"
                >
                  START BROWSING
                </button>
              </div>
            )}
          </div>

        </motion.div>
      </div>

    </div>
  );
};
