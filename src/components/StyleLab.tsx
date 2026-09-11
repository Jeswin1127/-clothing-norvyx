import React, { useState } from 'react';
import { 
  Sparkles, 
  Shuffle, 
  ShoppingBag, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Tag, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { soundFx } from '../utils/audio';

export const StyleLab: React.FC = () => {
  const { formatPrice, addOutfitBundleToCart, setQuickViewProduct } = useShop();

  // Group available items by slot
  const outerwearList = PRODUCTS.filter(p => p.category === 'outerwear');
  const topsList = PRODUCTS.filter(p => p.category === 'hoodies-tops');
  const bottomsList = PRODUCTS.filter(p => p.category === 'bottoms');
  const footwearList = PRODUCTS.filter(p => p.category === 'footwear');
  const accessoriesList = PRODUCTS.filter(p => p.category === 'accessories');

  // Selected state for each slot
  const [selectedOuterwearIdx, setSelectedOuterwearIdx] = useState(0);
  const [selectedTopIdx, setSelectedTopIdx] = useState(0);
  const [selectedBottomIdx, setSelectedBottomIdx] = useState(0);
  const [selectedFootwearIdx, setSelectedFootwearIdx] = useState(0);
  const [selectedAccessoryIdx, setSelectedAccessoryIdx] = useState(0);

  const [bundleAdded, setBundleAdded] = useState(false);

  const currentOuterwear = outerwearList[selectedOuterwearIdx] || outerwearList[0];
  const currentTop = topsList[selectedTopIdx] || topsList[0];
  const currentBottom = bottomsList[selectedBottomIdx] || bottomsList[0];
  const currentFootwear = footwearList[selectedFootwearIdx] || footwearList[0];
  const currentAccessory = accessoriesList[selectedAccessoryIdx] || accessoriesList[0];

  const currentPieces = [currentOuterwear, currentTop, currentBottom, currentFootwear, currentAccessory];

  // Pricing calculations
  const rawTotalPrice = currentPieces.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscountPercent = 0.15; // 15% bundle savings
  const bundleSavings = rawTotalPrice * bundleDiscountPercent;
  const finalBundlePrice = rawTotalPrice - bundleSavings;

  // Shuffle random outfit
  const handleShuffle = () => {
    soundFx.playHeart();
    setSelectedOuterwearIdx(Math.floor(Math.random() * outerwearList.length));
    setSelectedTopIdx(Math.floor(Math.random() * topsList.length));
    setSelectedBottomIdx(Math.floor(Math.random() * bottomsList.length));
    setSelectedFootwearIdx(Math.floor(Math.random() * footwearList.length));
    setSelectedAccessoryIdx(Math.floor(Math.random() * accessoriesList.length));
  };

  const handleAddBundleToCart = () => {
    const ids = currentPieces.map(p => p.id);
    addOutfitBundleToCart(ids);
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 2000);
  };

  return (
    <section id="style-lab" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20">
      
      {/* Studio Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyber-lime/10 border border-cyber-lime/30 text-cyber-lime text-xs font-mono font-bold tracking-wider">
          <Layers className="w-4 h-4" />
          <span>INTERACTIVE ATELIER STUDIO</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-white">
          THE STYLE LAB
        </h2>
        <p className="text-slate-300 text-sm sm:text-base font-light">
          Engineer your total aesthetic. Mix & match individual layers in real-time, preview silhouette synergy, and enjoy an instant <span className="text-cyber-lime font-bold">15% bundle discount</span>.
        </p>

        {/* Shuffle Button */}
        <div className="pt-2">
          <button
            onClick={handleShuffle}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl glass-panel text-slate-200 hover:text-cyber-lime hover:border-cyber-lime/50 text-xs font-mono font-bold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <Shuffle className="w-4 h-4 text-cyber-lime group-hover:rotate-180 transition-transform duration-500" />
            <span>SHUFFLE RANDOM STREET LOOK</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Carousel Selector for each slot */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Slot 1: Outerwear */}
          <SlotSelector
            label="01 // OUTERWEAR"
            items={outerwearList}
            currentIdx={selectedOuterwearIdx}
            onSelect={(idx) => setSelectedOuterwearIdx(idx)}
            formatPrice={formatPrice}
            onViewDetails={(p) => setQuickViewProduct(p)}
          />

          {/* Slot 2: Hoodies & Tops */}
          <SlotSelector
            label="02 // HOODIE / TOP"
            items={topsList}
            currentIdx={selectedTopIdx}
            onSelect={(idx) => setSelectedTopIdx(idx)}
            formatPrice={formatPrice}
            onViewDetails={(p) => setQuickViewProduct(p)}
          />

          {/* Slot 3: Cargos & Bottoms */}
          <SlotSelector
            label="03 // BOTTOMS"
            items={bottomsList}
            currentIdx={selectedBottomIdx}
            onSelect={(idx) => setSelectedBottomIdx(idx)}
            formatPrice={formatPrice}
            onViewDetails={(p) => setQuickViewProduct(p)}
          />

          {/* Slot 4: Footwear */}
          <SlotSelector
            label="04 // FOOTWEAR"
            items={footwearList}
            currentIdx={selectedFootwearIdx}
            onSelect={(idx) => setSelectedFootwearIdx(idx)}
            formatPrice={formatPrice}
            onViewDetails={(p) => setQuickViewProduct(p)}
          />

          {/* Slot 5: Accessories */}
          <SlotSelector
            label="05 // ACCESSORY / JEWELRY"
            items={accessoriesList}
            currentIdx={selectedAccessoryIdx}
            onSelect={(idx) => setSelectedAccessoryIdx(idx)}
            formatPrice={formatPrice}
            onViewDetails={(p) => setQuickViewProduct(p)}
          />

        </div>

        {/* Right: Total Look Synthesis & 1-Click Bundle Checkout */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-white/15 space-y-6 shadow-2xl relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-cyber-lime uppercase">Synthesized Look</span>
                <h3 className="font-display font-black text-2xl text-white">COMPLETE OUTFIT</h3>
              </div>
              <span className="px-2.5 py-1 bg-cyber-lime/10 border border-cyber-lime/30 text-cyber-lime font-mono text-xs font-bold rounded-lg">
                5-PIECE BUNDLE
              </span>
            </div>

            {/* Visual Thumbnail Strip of 5 Selected Pieces */}
            <div className="grid grid-cols-5 gap-2">
              {currentPieces.map((piece, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    soundFx.playClick();
                    setQuickViewProduct(piece);
                  }}
                  className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-obsidian-900 border border-white/10 cursor-pointer hover:border-cyber-lime transition-all"
                  title={piece.name}
                >
                  <img
                    src={piece.images[0]}
                    alt={piece.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[9px] font-mono font-bold text-white uppercase text-center px-1">VIEW</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Individual Breakdown List */}
            <div className="space-y-2 py-2 text-xs font-mono divide-y divide-white/5">
              {currentPieces.map((piece, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-slate-300">
                  <span className="truncate max-w-[200px] text-slate-200">{piece.name}</span>
                  <span className="font-bold text-white">{formatPrice(piece.price)}</span>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Individual Retail Sum</span>
                <span className="line-through">{formatPrice(rawTotalPrice)}</span>
              </div>
              <div className="flex justify-between text-cyber-lime font-bold">
                <span className="flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Style Lab Bundle Discount (15%)</span>
                </span>
                <span>-{formatPrice(bundleSavings)}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white font-display">TOTAL BUNDLE PRICE</span>
                <span className="text-xl font-black text-cyber-lime">{formatPrice(finalBundlePrice)}</span>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={handleAddBundleToCart}
              className="w-full py-4 bg-cyber-lime hover:bg-white text-black font-display font-black text-sm tracking-wider uppercase rounded-xl flex items-center justify-center space-x-2 shadow-xl shadow-cyber-lime/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
            >
              {bundleAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>LOOK ADDED TO CART!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                  <span>ADD FULL LOOK TO CART (SAVE 15%)</span>
                </>
              )}
            </button>

            <p className="text-[11px] font-mono text-center text-slate-400">
              ✓ Free Worldwide Express Shipping Included • 30-Day Free Atelier Returns
            </p>

          </div>
        </div>

      </div>

    </section>
  );
};

// Subcomponent: SlotSelector row for an individual apparel category
interface SlotSelectorProps {
  label: string;
  items: Product[];
  currentIdx: number;
  onSelect: (idx: number) => void;
  formatPrice: (amt: number) => string;
  onViewDetails: (p: Product) => void;
}

const SlotSelector: React.FC<SlotSelectorProps> = ({
  label,
  items,
  currentIdx,
  onSelect,
  formatPrice,
  onViewDetails,
}) => {
  const currentItem = items[currentIdx] || items[0];

  const handlePrev = () => {
    soundFx.playClick();
    onSelect((currentIdx - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    soundFx.playClick();
    onSelect((currentIdx + 1) % items.length);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-cyber-lime/30">
      
      {/* Left: Thumbnail & Info */}
      <div className="flex items-center space-x-4 w-full sm:w-auto">
        <div 
          onClick={() => {
            soundFx.playClick();
            onViewDetails(currentItem);
          }}
          className="relative w-16 h-20 rounded-xl overflow-hidden bg-obsidian-900 flex-shrink-0 cursor-pointer border border-white/10 group"
        >
          <img
            src={currentItem.images[0]}
            alt={currentItem.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-[8px] font-mono text-white font-bold">INFO</span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-mono text-cyber-lime font-bold uppercase tracking-widest">{label}</p>
          <h4 className="font-display font-bold text-sm sm:text-base text-white truncate">{currentItem.name}</h4>
          <p className="text-xs font-mono font-bold text-slate-300 mt-0.5">{formatPrice(currentItem.price)}</p>
        </div>
      </div>

      {/* Right: Stepper arrows & pill selector */}
      <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex items-center space-x-1">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-cyber-lime hover:text-black text-slate-300 border border-white/10 flex items-center justify-center transition-colors"
            title="Previous Option"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-slate-400 px-2">
            {currentIdx + 1} / {items.length}
          </span>

          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-cyber-lime hover:text-black text-slate-300 border border-white/10 flex items-center justify-center transition-colors"
            title="Next Option"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnail switcher pills */}
        <div className="hidden md:flex items-center space-x-1.5 ml-3">
          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                soundFx.playClick();
                onSelect(idx);
              }}
              className={`w-7 h-7 rounded-md overflow-hidden border transition-all ${
                currentIdx === idx ? 'border-cyber-lime scale-110 ring-1 ring-cyber-lime' : 'border-white/10 opacity-50 hover:opacity-100'
              }`}
            >
              <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
