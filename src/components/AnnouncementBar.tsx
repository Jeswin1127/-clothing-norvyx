import React from 'react';
import { Sparkles, Truck, Flame, ShieldCheck } from 'lucide-react';
import { BRAND_CONFIG } from '../data/brandConfig';

export const AnnouncementBar: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'flame':
        return <Flame className="w-3.5 h-3.5 text-cyber-lime" />;
      case 'truck':
        return <Truck className="w-3.5 h-3.5 text-cyber-cobalt" />;
      case 'shield':
        return <ShieldCheck className="w-3.5 h-3.5 text-cyber-amber" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-3.5 h-3.5 text-cyber-lime" />;
    }
  };

  const announcements = BRAND_CONFIG.announcements.map((a) => ({
    icon: getIcon(a.type),
    text: a.text,
  }));

  return (
    <div className="relative bg-obsidian-950 border-b border-white/10 text-xs font-mono py-2 overflow-hidden select-none z-40">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...announcements, ...announcements].map((item, idx) => (
          <div key={idx} className="flex items-center space-x-2 mx-8 text-slate-300 uppercase tracking-wider">
            {item.icon}
            <span>{item.text}</span>
            <span className="text-white/20 ml-6">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};

