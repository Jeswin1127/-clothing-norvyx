import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { BRAND_CONFIG } from '../data/brandConfig';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      soundFx.playHeart();
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-obsidian-950 border-t border-white/10 pt-20 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top: Newsletter Banner */}
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-white/15 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center space-x-2 text-cyber-lime font-mono text-xs uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PRIVATE ATELIER DISPATCH</span>
              </div>
              <h3 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
                {BRAND_CONFIG.newsletter.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl">
                {BRAND_CONFIG.newsletter.description}
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="p-4 rounded-2xl bg-cyber-lime/10 border border-cyber-lime/40 text-cyber-lime font-mono text-xs space-y-1">
                  <div className="flex items-center space-x-2 font-bold text-sm">
                    <Check className="w-4 h-4" />
                    <span>INVITATION GRANTED</span>
                  </div>
                  <p className="text-slate-300">
                    Use code <span className="font-bold text-white bg-black px-1.5 py-0.5 rounded">TRENDY20</span> at checkout for 20% off.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="ENTER YOUR EMAIL..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-4 py-3.5 bg-white/5 border border-white/15 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyber-lime uppercase"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-cyber-lime hover:bg-white text-black font-display font-black text-xs tracking-wider uppercase rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-cyber-lime/20"
                  >
                    <span>JOIN</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* Middle: Links & Atelier Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-mono text-xs">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-sm bg-cyber-lime flex items-center justify-center">
                <div className="w-2.5 h-2.5 rotate-45 bg-black" />
              </div>
              <span className="font-display font-black text-lg text-white tracking-tighter">{BRAND_CONFIG.brandName}</span>
            </div>
            <p className="text-slate-400 font-sans text-xs leading-relaxed">
              {BRAND_CONFIG.description}
            </p>
            <p className="text-[11px] text-cyber-lime font-bold">
              {BRAND_CONFIG.cities.join(' • ')}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-white font-bold tracking-wider uppercase">COLLECTIONS</p>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#products-catalog" className="hover:text-cyber-lime transition-colors">Outerwear & Coats</a></li>
              <li><a href="#products-catalog" className="hover:text-cyber-lime transition-colors">Heavyweight Hoodies</a></li>
              <li><a href="#products-catalog" className="hover:text-cyber-lime transition-colors">Tactical Cargos</a></li>
              <li><a href="#products-catalog" className="hover:text-cyber-lime transition-colors">Brutalist Footwear</a></li>
              <li><a href="#products-catalog" className="hover:text-cyber-lime transition-colors">Jewelry & Accessories</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-white font-bold tracking-wider uppercase">STUDIO & CLIENT</p>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#style-lab" className="hover:text-cyber-lime transition-colors">Style Lab Outfit Studio</a></li>
              <li><a href="#lookbook" className="hover:text-cyber-lime transition-colors">Campaign Lookbook</a></li>
              <li><span className="cursor-pointer hover:text-cyber-lime transition-colors">Worldwide Shipping Rates</span></li>
              <li><span className="cursor-pointer hover:text-cyber-lime transition-colors">Fabric & Care Guide</span></li>
              <li><span className="cursor-pointer hover:text-cyber-lime transition-colors">Returns & Exchanges</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-white font-bold tracking-wider uppercase">ATELIER ETHOS</p>
            <p className="text-slate-400 font-sans text-xs leading-relaxed">
              Every garment is created in small micro-batches with zero deadstock waste. Milled from organic Supima cotton and recycled technical Cordura.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-[11px] text-slate-300">
              <ShieldCheck className="w-4 h-4 text-cyber-lime" />
              <span>Certified Sustainable Mill</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between font-mono text-[11px] text-slate-500 gap-4">
          <p>© 2026 {BRAND_CONFIG.brandName} INC. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6">
            <span className="hover:text-slate-300 cursor-pointer">PRIVACY POLICY</span>
            <span className="hover:text-slate-300 cursor-pointer">TERMS OF ATELIER</span>
            <span className="hover:text-slate-300 cursor-pointer">SECURITY</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
