import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Sparkles, 
  ArrowRight, 
  Printer, 
  Lock,
  Calendar,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { soundFx } from '../utils/audio';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartTotal, 
    cartSubtotal, 
    cartDiscount, 
    freeShippingThreshold, 
    formatPrice, 
    clearCart 
  } = useShop();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState({
    firstName: 'Devon',
    lastName: 'Vance',
    email: 'devon.vance@atelier.studio',
    address: '742 Evergreen Terrace, Soho Loft 4B',
    city: 'New York',
    state: 'NY',
    zip: '10012',
    country: 'United States',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '11/28',
    cardCvv: '842',
  });

  const [orderId, setOrderId] = useState<string>('');

  if (!isCheckoutOpen) return null;

  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 20;
  const finalPayable = cartTotal + shippingCost;

  const handleClose = () => {
    soundFx.playClick();
    setIsCheckoutOpen(false);
    setStep(1);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    setStep(2);
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate order ID
    const randomCode = `VG-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`;
    setOrderId(randomCode);

    // Audio & Confetti!
    soundFx.playSuccess();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#CCFF00', '#2979FF', '#FFFFFF', '#FFB800'],
    });

    setStep(3);
    clearCart();
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-obsidian-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 my-auto"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/5 hover:bg-white text-slate-400 hover:text-black flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Stepper Progress Bar */}
        <div className="bg-obsidian-900 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-display font-black text-white text-lg tracking-tight">VANGUARD // CHECKOUT</span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className={step >= 1 ? 'text-cyber-lime font-bold' : 'text-slate-500'}>1. Shipping</span>
            <span className="text-slate-600">→</span>
            <span className={step >= 2 ? 'text-cyber-lime font-bold' : 'text-slate-500'}>2. Payment</span>
            <span className="text-slate-600">→</span>
            <span className={step === 3 ? 'text-cyber-lime font-bold' : 'text-slate-500'}>3. Confirmation</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          
          {/* STEP 1: SHIPPING INFORMATION */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <h3 className="font-display font-black text-xl text-white">Shipping Address</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyber-lime"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyber-lime"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Email (for order updates)</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyber-lime"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyber-lime"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyber-lime"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">State / Region</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyber-lime"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={e => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyber-lime"
                  />
                </div>
              </div>

              {/* Order total preview */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Total payable (inc. shipping):</span>
                <span className="text-cyber-lime font-bold text-sm">{formatPrice(finalPayable)}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-cyber-lime hover:bg-white text-black font-display font-black text-sm tracking-wider uppercase rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg"
              >
                <span>CONTINUE TO PAYMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 2 && (
            <form onSubmit={handleCompleteOrder} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-xl text-white">Payment Method</h3>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-mono text-cyber-lime hover:underline"
                >
                  ← Edit Address
                </button>
              </div>

              {/* Quick Apple Pay Simulation Pill */}
              <button
                type="button"
                onClick={handleCompleteOrder}
                className="w-full py-3 bg-white text-black font-mono font-bold text-xs tracking-wider rounded-xl flex items-center justify-center space-x-2 hover:bg-slate-200 transition-colors shadow"
              >
                <span>Pay Fast Checkout</span>
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-[10px] font-mono text-slate-500 uppercase">Or Credit Card</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 flex items-center space-x-1">
                  <CreditCard className="w-3 h-3" />
                  <span>Card Number</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.cardNumber}
                  onChange={e => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyber-lime"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Expiration</label>
                  <input
                    type="text"
                    required
                    value={formData.cardExp}
                    onChange={e => setFormData({ ...formData, cardExp: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyber-lime"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">CVV Security Code</label>
                  <input
                    type="text"
                    required
                    value={formData.cardCvv}
                    onChange={e => setFormData({ ...formData, cardCvv: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyber-lime"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Items Total:</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping:</span>
                  <span>{isFreeShipping ? 'FREE' : formatPrice(20)}</span>
                </div>
                <div className="flex justify-between text-cyber-lime font-bold pt-1 border-t border-white/10">
                  <span>Final Authorization:</span>
                  <span>{formatPrice(finalPayable)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-cyber-lime hover:bg-white text-black font-display font-black text-sm tracking-wider uppercase rounded-xl flex items-center justify-center space-x-2 transition-all shadow-xl shadow-cyber-lime/20"
              >
                <Lock className="w-4 h-4" />
                <span>AUTHORIZE PAYMENT ({formatPrice(finalPayable)})</span>
              </button>
            </form>
          )}

          {/* STEP 3: ORDER CONFIRMATION WITH RECEIPT */}
          {step === 3 && (
            <div className="text-center space-y-6 py-4">
              
              {/* Success Emblem */}
              <div className="w-16 h-16 rounded-full bg-cyber-lime/20 border border-cyber-lime text-cyber-lime flex items-center justify-center mx-auto animate-bounce">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono text-cyber-lime font-bold uppercase tracking-widest">
                  PAYMENT AUTHORIZED // ATELIER ORDER CONFIRMED
                </span>
                <h3 className="font-display font-black text-3xl text-white mt-1">
                  THANK YOU, {formData.firstName.toUpperCase()}!
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  ORDER REFERENCE: <span className="text-white font-bold">{orderId}</span>
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/15 text-left font-mono text-xs space-y-3">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">DELIVERY TO:</span>
                  <span className="text-white text-right">{formData.address}, {formData.city}, {formData.zip}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">ESTIMATED ARRIVAL:</span>
                  <span className="text-cyber-lime font-bold">3–5 Business Days (Express)</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">NOTIFICATION SENT TO:</span>
                  <span className="text-white">{formData.email}</span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-sm text-white">
                  <span>PAID VIA CARD (•••• 4242):</span>
                  <span className="text-cyber-lime">{formatPrice(finalPayable)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handlePrintReceipt}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors border border-white/10"
                >
                  <Printer className="w-4 h-4" />
                  <span>PRINT RECEIPT</span>
                </button>

                <button
                  onClick={handleClose}
                  className="flex-1 py-3 bg-cyber-lime hover:bg-white text-black font-display font-black text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-cyber-lime/20"
                >
                  CONTINUE SHOPPING
                </button>
              </div>

            </div>
          )}

        </div>

      </motion.div>

    </div>
  );
};
