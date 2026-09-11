export type ProductCategory = 
  | 'all' 
  | 'outerwear' 
  | 'hoodies-tops' 
  | 'bottoms' 
  | 'footwear' 
  | 'accessories';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  badge?: 'LIMITED DROP' | 'BESTSELLER' | 'NEW SEASON' | 'EXCLUSIVE' | 'LOW STOCK';
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  rating: number;
  reviewsCount: number;
  description: string;
  materials: string;
  fit: string;
  stock: number;
  featured?: boolean;
}

export interface CartItem {
  id: string; // composite key: `${product.id}-${selectedSize}-${selectedColor}`
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD (1.0)
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  comment: string;
  fitFeedback: 'Runs Small' | 'True to Size' | 'Oversized Fit';
  itemPurchased: string;
}

export interface OutfitLook {
  outerwearId: string;
  topId: string;
  bottomId: string;
  footwearId: string;
  accessoryId: string;
}
