import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Ruler, 
  Layers, 
  ChevronDown,
  MessageSquare 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { soundFx } from '../utils/audio';
import { BRAND_CONFIG } from '../data/brandConfig';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist 
  } = useShop();

  if (!quickViewProduct) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(quickViewProduct.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(quickViewProduct.colors[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'materials' | 'fit' | 'shipping'>('materials');
  const [isAdded, setIsAdded] = useState(false);

  const isLiked = isInWishlist(quickViewProduct.id);

  const handleClose = () => {
    soundFx.playClick();
    setQuickViewProduct(null);
  };

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWhatsAppInquiry = () => {
    soundFx.playClick();
    const text = `Hi ${BRAND_CONFIG.brandName}! I would like to order / inquire about "${quickViewProduct.name}" (Size: ${selectedSize}, Color: ${selectedColor}, Qty: ${quantity}, Price: $${quickViewProduct.price}). Could you please share availability and ordering steps?`;
    window.open(`https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-obsidian-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col md:flex-row my-auto"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-obsidian-900/80 hover:bg-white text-slate-300 hover:text-black border border-white/10 flex items-center justify-center transition-colors shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="md:w-1/2 bg-obsidian-900 flex flex-col justify-between p-4 sm:p-6">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black/50 border border-white/10">
            <img
              src={quickViewProduct.images[activeImageIdx] || quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover object-center"
            />

            {quickViewProduct.badge && (
              <span className="absolute top-3 left-3 px-3 py-1 text-[10px] font-mono font-bold bg-cyber-lime text-black rounded uppercase shadow-lg">
                {quickViewProduct.badge}
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {quickViewProduct.images.length > 1 && (
            <div className="flex items-center space-x-3 mt-4">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveImageIdx(idx);
                  }}
                  className={`relative w-16 h-20 rounded-xl overflow-hidden border transition-all ${
                    activeImageIdx === idx 
                      ? 'border-cyber-lime ring-2 ring-cyber-lime/40 scale-105' 
                      : 'border-white/15 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Specs & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[85vh] space-y-6">
          
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-2">
              <span className="text-cyber-lime uppercase font-bold tracking-widest">// {quickViewProduct.category}</span>
              <span>•</span>
              <div className="flex items-center text-cyber-amber">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="ml-1 text-slate-200 font-bold">{quickViewProduct.rating.toFixed(1)}</span>
                <span className="ml-1 text-slate-500">({quickViewProduct.reviewsCount} reviews)</span>
              </div>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
              {quickViewProduct.name}
            </h2>

            <p className="text-xs text-slate-400 font-light mt-1">
              {quickViewProduct.tagline}
            </p>

            <div className="mt-4 flex items-baseline space-x-3">
              <span className="font-mono font-black text-2xl text-cyber-lime">
                {formatPrice(quickViewProduct.price)}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="font-mono text-sm text-slate-500 line-through">
                  {formatPrice(quickViewProduct.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {quickViewProduct.description}
          </p>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              COLORWAY: <span className="text-white font-bold">{selectedColor}</span>
            </label>
            <div className="flex items-center space-x-2">
              {quickViewProduct.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedColor(c.name);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center space-x-2 transition-all ${
                    selectedColor === c.name 
                      ? 'border-cyber-lime bg-white/10 text-white font-bold' 
                      : 'border-white/15 bg-transparent text-slate-400 hover:border-white/30'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-slate-400 uppercase tracking-wider">
                SELECT SIZE: <span className="text-white font-bold">{selectedSize}</span>
              </span>
              <span className="text-cyber-lime flex items-center space-x-1 cursor-pointer hover:underline">
                <Ruler className="w-3 h-3" />
                <span>SIZE GUIDE</span>
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {quickViewProduct.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedSize(sz);
                  }}
                  className={`py-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                    selectedSize === sz 
                      ? 'bg-cyber-lime text-black border-cyber-lime shadow-lg' 
                      : 'bg-white/5 border-white/15 text-slate-200 hover:border-white/40'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center space-x-3 pt-2">
            
            {/* Stepper */}
            <div className="flex items-center border border-white/15 rounded-xl bg-white/5 p-1 font-mono text-xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300"
              >
                +
              </button>
            </div>

            {/* Add to Bag Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 bg-cyber-lime hover:bg-white text-black font-display font-black text-sm tracking-wider uppercase rounded-xl flex items-center justify-center space-x-2 transition-all shadow-xl shadow-cyber-lime/20"
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>ADDED TO BAG!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO BAG</span>
                </>
              )}
            </button>

            {/* Wishlist Toggle */}
            <button
              onClick={() => toggleWishlist(quickViewProduct.id)}
              className={`p-3.5 rounded-xl border transition-all ${
                isLiked 
                  ? 'bg-cyber-crimson text-white border-cyber-crimson' 
                  : 'bg-white/5 border-white/15 text-slate-300 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* WhatsApp Direct Inquiry/Order */}
          {BRAND_CONFIG.enableWhatsappOrdering && (
            <button
              onClick={handleWhatsAppInquiry}
              className="w-full py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:text-white rounded-xl text-xs font-mono tracking-wider flex items-center justify-center space-x-2 transition-all group"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>ORDER / INQUIRE VIA WHATSAPP</span>
            </button>
          )}

          {/* Collapsible Tabs */}
          <div className="pt-4 border-t border-white/10 space-y-3 font-mono text-xs">
            <div className="flex border-b border-white/10 pb-2 space-x-4">
              <button
                onClick={() => setActiveTab('materials')}
                className={`pb-1 transition-colors ${activeTab === 'materials' ? 'text-cyber-lime border-b-2 border-cyber-lime font-bold' : 'text-slate-400'}`}
              >
                FABRIC SPEC
              </button>
              <button
                onClick={() => setActiveTab('fit')}
                className={`pb-1 transition-colors ${activeTab === 'fit' ? 'text-cyber-lime border-b-2 border-cyber-lime font-bold' : 'text-slate-400'}`}
              >
                FIT & MODEL
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-1 transition-colors ${activeTab === 'shipping' ? 'text-cyber-lime border-b-2 border-cyber-lime font-bold' : 'text-slate-400'}`}
              >
                SHIPPING & CARE
              </button>
            </div>

            {activeTab === 'materials' && (
              <p className="text-slate-300 leading-relaxed">{quickViewProduct.materials}</p>
            )}
            {activeTab === 'fit' && (
              <p className="text-slate-300 leading-relaxed">{quickViewProduct.fit}</p>
            )}
            {activeTab === 'shipping' && (
              <p className="text-slate-300 leading-relaxed">
                Free standard shipping worldwide on orders above $250. Hand-finished atelier packaging with numbered certificate of authenticity. Machine wash cold inside out, hang dry.
              </p>
            )}
          </div>

        </div>

      </motion.div>

    </div>
  );
};
