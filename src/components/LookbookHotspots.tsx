import React, { useState } from 'react';
import { Sparkles, Plus, ShoppingBag, ArrowUpRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';
import { soundFx } from '../utils/audio';

interface Hotspot {
  id: string;
  productId: string;
  topPercent: number;
  leftPercent: number;
  label: string;
}

export const LookbookHotspots: React.FC = () => {
  const { formatPrice, addToCart, setQuickViewProduct } = useShop();

  const [activeHotspot, setActiveHotspot] = useState<string | null>('hs-1');
  const [addedId, setAddedId] = useState<string | null>(null);

  const hotspots: Hotspot[] = [
    {
      id: 'hs-1',
      productId: 'out-01', // KINETIC Modular Bomber
      topPercent: 32,
      leftPercent: 48,
      label: 'OUTERWEAR',
    },
    {
      id: 'hs-2',
      productId: 'acc-01', // Titan Cuban Link Chain
      topPercent: 24,
      leftPercent: 55,
      label: 'STERLING JEWELRY',
    },
    {
      id: 'hs-3',
      productId: 'bot-01', // Parachute Tactical Cargo
      topPercent: 68,
      leftPercent: 45,
      label: 'CARGO PANTS',
    },
    {
      id: 'hs-4',
      productId: 'foot-01', // Matrix Platform Chunky Derby
      topPercent: 91,
      leftPercent: 52,
      label: 'FOOTWEAR',
    },
  ];

  const handleHotspotClick = (hsId: string) => {
    soundFx.playClick();
    setActiveHotspot(activeHotspot === hsId ? null : hsId);
  };

  const handleQuickAdd = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const prod = PRODUCTS.find(p => p.id === productId);
    if (prod) {
      addToCart(prod);
      setAddedId(productId);
      setTimeout(() => setAddedId(null), 1500);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left: Editorial Context & Story */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center space-x-2 text-cyber-lime font-mono text-xs uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EDITORIAL LOOKBOOK</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-[1.08]">
            SHIBUYA AFTER DARK // 03:00 AM
          </h2>

          <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed">
            Shot on location in Shibuya, Tokyo. The FW/26 collection combines weatherproof ballistic nylon weaves with heavy unbrushed French terry and architectural footwear.
          </p>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-cyber-lime font-bold">HOTSPOT SHOPPING:</span>
              <span className="text-slate-400">Tap any pulsing pin</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-normal font-sans">
              Interact directly with the photograph to inspect garments, verify technical specifications, and add pieces directly to your bag.
            </p>
          </div>

          {/* Quick List of looks in the photo */}
          <div className="space-y-2">
            {hotspots.map((hs) => {
              const prod = PRODUCTS.find(p => p.id === hs.productId);
              if (!prod) return null;
              const isSelected = activeHotspot === hs.id;
              return (
                <button
                  key={hs.id}
                  onClick={() => handleHotspotClick(hs.id)}
                  className={`w-full text-left p-3 rounded-xl border font-mono text-xs flex items-center justify-between transition-all ${
                    isSelected 
                      ? 'bg-cyber-lime/10 border-cyber-lime text-cyber-lime font-bold shadow-lg' 
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyber-lime animate-pulse" />
                    <span>{prod.name}</span>
                  </div>
                  <span className="text-white font-bold">{formatPrice(prod.price)}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Right: The Shoppable Editorial Photo Canvas with Hotspot Pins */}
        <div className="lg:col-span-7">
          <div className="relative rounded-3xl overflow-hidden glass-card border border-white/15 aspect-[4/5] sm:aspect-[3/4] shadow-2xl group">
            
            {/* Editorial Photo */}
            <img
              src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80"
              alt="Editorial Menswear Lookbook Tokyo"
              className="w-full h-full object-cover object-top filter contrast-105"
            />

            {/* Subtle atmospheric gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Corner Watermark */}
            <div className="absolute top-5 left-5 font-mono text-xs text-white/70 tracking-widest uppercase">
              VANGUARD CAMPAIGN // 2026
            </div>

            {/* Interactive Pins */}
            {hotspots.map((hs) => {
              const isSelected = activeHotspot === hs.id;
              const product = PRODUCTS.find(p => p.id === hs.productId);
              if (!product) return null;

              return (
                <div
                  key={hs.id}
                  style={{ top: `${hs.topPercent}%`, left: `${hs.leftPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  {/* Glowing Pulse Ring */}
                  <button
                    onClick={() => handleHotspotClick(hs.id)}
                    className="relative w-8 h-8 rounded-full flex items-center justify-center focus:outline-none group/pin cursor-pointer"
                    aria-label={`View ${product.name}`}
                  >
                    <span className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                      isSelected ? 'bg-cyber-lime' : 'bg-white'
                    }`} />
                    <span className={`relative w-6 h-6 rounded-full flex items-center justify-center shadow-2xl border transition-all ${
                      isSelected 
                        ? 'bg-cyber-lime text-black border-white scale-125' 
                        : 'bg-black/90 text-white border-white/60 hover:scale-110'
                    }`}>
                      <Plus className={`w-3.5 h-3.5 transition-transform duration-300 ${isSelected ? 'rotate-45' : ''}`} />
                    </span>
                  </button>

                  {/* Popover Card */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3.5 rounded-2xl glass-dropdown shadow-2xl border border-white/20 text-white z-30"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-14 object-cover rounded-lg bg-black border border-white/10"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] font-mono text-cyber-lime font-bold uppercase">{hs.label}</span>
                            <h4 className="font-display font-bold text-xs truncate">{product.name}</h4>
                            <p className="text-xs font-mono font-bold text-white mt-0.5">{formatPrice(product.price)}</p>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center space-x-2">
                          <button
                            onClick={(e) => handleQuickAdd(product.id, e)}
                            className="flex-1 py-1.5 bg-cyber-lime hover:bg-white text-black font-mono text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center space-x-1"
                          >
                            {addedId === product.id ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>ADDED</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3 h-3" />
                                <span>ADD TO BAG</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              soundFx.playClick();
                              setQuickViewProduct(product);
                            }}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                            title="Inspect Details"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}

          </div>
        </div>

      </div>

    </section>
  );
};
