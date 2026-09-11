import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Flame, Layers, Sparkles, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { soundFx } from '../utils/audio';
import { BRAND_CONFIG } from '../data/brandConfig';

interface HeroProps {
  onExploreClick: () => void;
  onStyleLabClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onStyleLabClick }) => {
  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3D Card Tilt Mouse Physics
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { damping: 20, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { damping: 20, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const currentX = (e.clientX - rect.left) / width - 0.5;
    const currentY = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(currentX);
    mouseY.set(currentY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-4 pb-16 noise-overlay">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyber-lime/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-cyber-cobalt/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 lg:pr-6 text-center lg:text-left">
            
            {/* Live Drop Pill */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-3 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-lime opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-lime"></span>
              </span>
              <span className="text-xs font-mono tracking-wider text-slate-300 uppercase">
                {BRAND_CONFIG.hero.badgeText}
              </span>
              <div className="hidden sm:flex items-center space-x-1.5 pl-2 border-l border-white/15 text-xs font-mono text-cyber-lime">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </motion.div>

            {/* Giant Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-black text-4xl sm:text-6xl xl:text-7xl tracking-tighter leading-[1.02] text-white"
            >
              {BRAND_CONFIG.hero.headlinePart1} <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyber-lime via-white to-cyber-cobalt">
                {BRAND_CONFIG.hero.headlineHighlight}
              </span> <br />
              {BRAND_CONFIG.hero.headlinePart2}
            </motion.h1>

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 max-w-xl font-light leading-relaxed mx-auto lg:mx-0"
            >
              {BRAND_CONFIG.hero.description}
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                onClick={() => {
                  soundFx.playClick();
                  onExploreClick();
                }}
                className="w-full sm:w-auto px-8 py-4 bg-cyber-lime text-black font-display font-black text-sm tracking-wider uppercase rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-cyber-lime/20 hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 group"
              >
                <span>{BRAND_CONFIG.hero.primaryCta}</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onStyleLabClick();
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-xl glass-panel text-white hover:text-cyber-lime hover:border-cyber-lime/40 font-mono text-sm tracking-wider uppercase flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105 active:scale-95 group"
              >
                <Layers className="w-4 h-4 text-cyber-lime group-hover:rotate-12 transition-transform" />
                <span>STYLE LAB BUILDER</span>
                <span className="text-xs bg-cyber-lime/20 text-cyber-lime px-2 py-0.5 rounded-full font-mono font-bold">
                  SAVE 15%
                </span>
              </button>
            </motion.div>

            {/* Badges Bar */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center"
            >
              <div>
                <p className="font-display font-black text-xl text-white">550<span className="text-cyber-lime text-sm">GSM</span></p>
                <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Heavy French Terry</p>
              </div>
              <div className="border-x border-white/10">
                <p className="font-display font-black text-xl text-white">CORDURA®</p>
                <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Ballistic Ripstop</p>
              </div>
              <div>
                <p className="font-display font-black text-xl text-white">925<span className="text-cyber-lime text-sm">Ag</span></p>
                <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Solid Silver Cast</p>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Interactive 3D Parallax Hero Card */}
          <div className="lg:col-span-5 flex justify-center perspective-[1000px]">
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full max-w-md rounded-2xl overflow-hidden glass-card p-3 cursor-pointer group shadow-2xl shadow-black/80"
              onClick={() => {
                soundFx.playClick();
                onExploreClick();
              }}
            >
              {/* Product Visual */}
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-obsidian-900">
                <img
                  src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80"
                  alt="KINETIC Modular Bomber Look"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Visual Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3 py-1 bg-cyber-lime text-black font-mono font-bold text-xs rounded-full shadow-lg">
                    EDITION // 001
                  </span>
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white font-mono text-[11px] rounded-full border border-white/20 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-cyber-lime" />
                    <span>POPULAR LOOK</span>
                  </span>
                </div>

                {/* Floating 3D Micro-Card on image */}
                <div 
                  style={{ transform: 'translateZ(40px)' }}
                  className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-obsidian-950/85 backdrop-blur-md border border-white/15 text-white shadow-xl transition-all duration-300 group-hover:border-cyber-lime/50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-cyber-lime uppercase tracking-widest">Featured Streetwear Piece</span>
                    <span className="font-mono text-xs font-bold text-slate-300">$285.00</span>
                  </div>
                  <h3 className="font-display font-black text-lg text-white group-hover:text-cyber-lime transition-colors">
                    KINETIC Modular Bomber
                  </h3>
                  <p className="text-xs text-slate-400 font-light mt-0.5 line-clamp-1">
                    Cordura ballistic nylon with magnetic quick-release harness
                  </p>
                  
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="text-[11px] text-cyber-lime font-bold">● ONLY 4 UNITS REMAINING</span>
                    <span className="flex items-center text-white group-hover:translate-x-1 transition-transform">
                      VIEW PIECE <ChevronRight className="w-3.5 h-3.5 ml-0.5 text-cyber-lime" />
                    </span>
                  </div>
                </div>

              </div>

              {/* Glowing Corner Accents */}
              <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-cyber-lime/20 rounded-full blur-xl pointer-events-none" />
            </motion.div>
          </div>

        </div>
      </div>

    </div>
  );
};
