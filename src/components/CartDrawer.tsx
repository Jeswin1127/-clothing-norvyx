import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Tag, 
  Check, 
  ShieldCheck, 
  Sparkles,
  MessageSquare 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { soundFx } from '../utils/audio';
import { BRAND_CONFIG } from '../data/brandConfig';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    cartCount, 
    cartSubtotal, 
    cartDiscount, 
    cartTotal, 
    freeShippingThreshold, 
    freeShippingProgress,
    removeFromCart, 
    updateQuantity, 
    formatPrice,
    discountCode,
    appliedDiscount,
    discountError,
    applyPromoCode,
    removePromoCode,
    setIsCheckoutOpen 
  } = useShop();

  const [inputCode, setInputCode] = useState('');

  if (!isCartOpen) return null;

  const handleClose = () => {
    soundFx.playClick();
    setIsCartOpen(false);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyPromoCode(inputCode)) {
      setInputCode('');
    }
  };

  const handleProceedCheckout = () => {
    soundFx.playClick();
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppCheckout = () => {
    soundFx.playClick();
    const itemsSummary = cart
      .map(
        item =>
          `• ${item.product.name} (Size: ${item.selectedSize}, Color: ${item.selectedColor}, Qty: ${item.quantity}) - $${item.product.price * item.quantity}`
      )
      .join('\n');
    const message = `Hi ${BRAND_CONFIG.brandName}! I'd like to place an order for the following items:\n\n${itemsSummary}\n\nTotal Due: $${cartTotal}\n\nPlease confirm availability and payment options!`;
    window.open(`https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

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
              <ShoppingBag className="w-5 h-5 text-cyber-lime" />
              <h2 className="font-display font-black text-xl text-white tracking-tight">
                SHOPPING BAG
              </h2>
              <span className="text-xs font-mono text-slate-400">({cartCount})</span>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="p-4 bg-obsidian-900 border-b border-white/10">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="flex items-center space-x-1.5 text-slate-300">
                <Truck className="w-3.5 h-3.5 text-cyber-lime" />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Add <strong className="text-cyber-lime">{formatPrice(remainingForFreeShipping)}</strong> for Free Express Shipping
                  </span>
                ) : (
                  <span className="text-cyber-lime font-bold">
                    You've unlocked Complimentary Express Delivery!
                  </span>
                )}
              </span>
              <span className="text-slate-400">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyber-lime transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div 
                  key={item.id}
                  className="p-3.5 rounded-2xl glass-card flex items-center space-x-3 border border-white/10"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-20 object-cover rounded-xl bg-black border border-white/10 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-sm text-white truncate">
                      {item.product.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400 mt-0.5">
                      <span>Size: {item.selectedSize}</span>
                      <span>•</span>
                      <span className="truncate max-w-[100px]">{item.selectedColor}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Stepper */}
                      <div className="flex items-center border border-white/15 rounded-lg bg-white/5 text-xs font-mono">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-white font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <span className="font-mono font-bold text-sm text-cyber-lime">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-500 hover:text-cyber-crimson transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">YOUR BAG IS EMPTY</h3>
                  <p className="text-xs font-mono text-slate-400 mt-1">Explore our latest drops and curate your fit.</p>
                </div>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-cyber-lime text-black font-mono text-xs font-bold uppercase hover:bg-white transition-colors"
                >
                  DISCOVER THE DROP
                </button>
              </div>
            )}
          </div>

          {/* Footer with promo code & checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-obsidian-900/95 space-y-4">
              
              {/* Promo Code Input */}
              <div>
                {appliedDiscount ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyber-lime/10 border border-cyber-lime/30 text-xs font-mono">
                    <div className="flex items-center space-x-2 text-cyber-lime">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="font-bold">{discountCode}: {appliedDiscount.name}</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-slate-400 hover:text-white"
                      title="Remove promo code"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="PROMO CODE (e.g. TRENDY20)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyber-lime uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white/10 hover:bg-cyber-lime hover:text-black text-slate-200 rounded-xl text-xs font-mono font-bold transition-colors"
                    >
                      APPLY
                    </button>
                  </form>
                )}
                {discountError && (
                  <p className="text-[11px] font-mono text-cyber-crimson mt-1">{discountError}</p>
                )}
              </div>

              {/* Price Calculation Lines */}
              <div className="space-y-1.5 font-mono text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-cyber-lime font-bold">
                    <span>Discount Savings</span>
                    <span>-{formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{remainingForFreeShipping === 0 ? 'FREE' : formatPrice(20)}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline text-white">
                  <span className="font-display font-bold text-sm">TOTAL DUE</span>
                  <span className="font-mono font-black text-xl text-cyber-lime">
                    {formatPrice(cartTotal + (remainingForFreeShipping === 0 ? 0 : 20))}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedCheckout}
                className="w-full py-4 bg-cyber-lime hover:bg-white text-black font-display font-black text-sm tracking-wider uppercase rounded-xl flex items-center justify-center space-x-2 shadow-xl shadow-cyber-lime/20 transition-all hover:scale-[1.01] active:scale-[0.99] group"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {BRAND_CONFIG.enableWhatsappOrdering && (
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:text-white rounded-xl text-xs font-mono tracking-wider flex items-center justify-center space-x-2 transition-all group"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>CHECKOUT VIA WHATSAPP</span>
                </button>
              )}

              <div className="flex items-center justify-center space-x-4 text-[11px] font-mono text-slate-400">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyber-lime" />
                  <span>256-Bit Encrypted</span>
                </span>
                <span>•</span>
                <span>Complimentary Returns</span>
              </div>

            </div>
          )}

        </motion.div>
      </div>

    </div>
  );
};
