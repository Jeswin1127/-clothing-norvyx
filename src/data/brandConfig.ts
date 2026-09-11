export interface BrandConfig {
  brandName: string;
  subBrand: string;
  tagline: string;
  description: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string; // e.g. "1234567890" without + or spaces for wa.me links
  enableWhatsappOrdering: boolean;
  cities: string[];
  socialLinks: {
    instagram: string;
    tiktok: string;
    twitter: string;
    pinterest: string;
  };
  announcements: {
    type: 'flame' | 'truck' | 'sparkles' | 'shield';
    text: string;
  }[];
  hero: {
    badgeText: string;
    headlinePart1: string;
    headlineHighlight: string;
    headlinePart2: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  newsletter: {
    title: string;
    description: string;
    promoCode: string;
    discountText: string;
  };
}

export const BRAND_CONFIG: BrandConfig = {
  brandName: 'VANGUARD',
  subBrand: "// MEN'S ATELIER",
  tagline: 'Avant-garde menswear, modular techwear, and heavyweight streetwear',
  description:
    'Redefining contemporary fashion through uncompromising material density, functional hardware, and brutalist tailoring.',
  supportEmail: 'concierge@vanguard-atelier.com',
  supportPhone: '+1 (800) 492-8246',
  whatsappNumber: '18004928246', // Change this to your business WhatsApp number
  enableWhatsappOrdering: true,
  cities: ['TOKYO', 'LONDON', 'NEW YORK', 'PARIS'],
  socialLinks: {
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
    twitter: 'https://twitter.com',
    pinterest: 'https://pinterest.com',
  },
  announcements: [
    { type: 'flame', text: 'AUTUMN / WINTER 2026 CAPSULE DROP NOW LIVE' },
    { type: 'truck', text: 'FREE WORLDWIDE EXPRESS SHIPPING ON ORDERS OVER $250' },
    { type: 'sparkles', text: 'USE CODE "TRENDY20" FOR 20% OFF YOUR FIRST ORDER' },
    { type: 'shield', text: 'HAND-CRAFTED ATELIER FINISH • COMPLIMENTARY 30-DAY RETURNS' },
  ],
  hero: {
    badgeText: "FW'26 CAPSULE DROP • ACTIVE",
    headlinePart1: 'SCULPTED FOR THE',
    headlineHighlight: 'NEW ERA',
    headlinePart2: 'OF COLD-WEATHER TAILORING',
    description:
      'Engineered in Tokyo and New York. Precision-cut outerwear, 480 GSM French Terry fleeces, architectural cargos, and bespoke brutalist hardware.',
    primaryCta: 'EXPLORE CAPSULE',
    secondaryCta: 'STYLE LAB STUDIO',
  },
  newsletter: {
    title: 'JOIN THE PRIVATE ATELIER',
    description:
      'Receive secret access to limited capsule drops 2 hours before public release. Plus, get 20% off your first order.',
    promoCode: 'TRENDY20',
    discountText: '20% OFF',
  },
};
