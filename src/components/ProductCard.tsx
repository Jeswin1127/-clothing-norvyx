import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { soundFx } from '../utils/audio';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setQuickViewProduct 
  } = useShop();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const isLiked = isInWishlist(product.id);

  const handleQuickAdd = (size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, size, selectedColor, 1);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const handleCardClick = () => {
    soundFx.playClick();
    setQuickViewProduct(product);
  };

  return (
    <div 
      className="group relative flex flex-col rounded-2xl overflow-hidden glass-card transition-all duration-300 hover:border-cyber-lime/40 hover:shadow-2xl hover:shadow-black/60"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Image Container */}
      <div 
        onClick={handleCardClick}
        className="relative aspect-[4/5] bg-obsidian-900 overflow-hidden cursor-pointer"
      >
        {/* Main Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            isHovered && product.images[1] ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          loading="lazy"
        />

        {/* Hover Secondary Image */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate angle`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            loading="lazy"
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className={`px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider rounded uppercase shadow-md ${
              product.badge === 'LIMITED DROP' 
                ? 'bg-cyber-lime text-black' 
                : product.badge === 'BESTSELLER' 
                ? 'bg-cyber-cobalt text-white' 
                : product.badge === 'LOW STOCK' 
                ? 'bg-cyber-crimson text-white' 
                : 'bg-white/90 text-black'
            }`}>
              {product.badge}
            </span>
          )}
          {product.stock <= 5 && (
            <span className="px-2 py-0.5 text-[9px] font-mono bg-obsidian-950/80 text-cyber-lime border border-cyber-lime/40 rounded">
              ONLY {product.stock} LEFT
            </span>
          )}
        </div>

        {/* Action Buttons Top Right: Wishlist & QuickView */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label="Toggle Wishlist"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isLiked 
                ? 'bg-cyber-crimson text-white shadow-cyber-crimson/30' 
                : 'bg-obsidian-950/70 text-slate-300 hover:text-white hover:bg-obsidian-900 border border-white/15'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playClick();
              setQuickViewProduct(product);
            }}
            title="Quick View"
            className="w-9 h-9 rounded-full bg-obsidian-950/70 hover:bg-cyber-lime hover:text-black text-slate-300 border border-white/15 flex items-center justify-center transition-all shadow-lg opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 duration-200"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Slide-Up Quick Size Selector Tray */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-obsidian-950 via-obsidian-950/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
          <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5 flex items-center justify-between">
            <span>QUICK ADD SIZE</span>
            {addedFeedback && <span className="text-cyber-lime font-bold flex items-center"><Check className="w-3 h-3 mr-0.5" /> ADDED</span>}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                onClick={(e) => handleQuickAdd(sz, e)}
                className="flex-1 min-w-[32px] py-1 bg-white/10 hover:bg-cyber-lime hover:text-black border border-white/15 rounded text-xs font-mono font-bold text-white transition-colors"
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono mb-1">
            <div className="flex items-center text-cyber-amber">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="font-bold text-slate-200">{product.rating.toFixed(1)}</span>
            <span className="text-slate-500">({product.reviewsCount})</span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={handleCardClick}
            className="font-display font-bold text-base text-white hover:text-cyber-lime cursor-pointer transition-colors line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="text-xs text-slate-400 font-light line-clamp-1 mt-0.5">
            {product.tagline}
          </p>
        </div>

        {/* Bottom row: Color dots & Price */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          
          {/* Color swatches */}
          <div className="flex items-center space-x-1.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playClick();
                  setSelectedColor(c.name);
                }}
                title={c.name}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColor === c.name 
                    ? 'scale-125 border-cyber-lime ring-1 ring-cyber-lime' 
                    : 'border-white/30 hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {/* Price */}
          <div className="text-right">
            {product.originalPrice && (
              <span className="text-xs text-slate-500 line-through mr-2 font-mono">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="font-mono font-bold text-sm text-cyber-lime">
              {formatPrice(product.price)}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
