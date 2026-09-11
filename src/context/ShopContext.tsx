import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, CurrencyCode, ProductCategory } from '../types';
import { CURRENCIES, PRODUCTS, VALID_DISCOUNT_CODES } from '../data/products';
import { soundFx } from '../utils/audio';

interface ShopContextType {
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;

  // Discounts
  discountCode: string;
  appliedDiscount: { name: string; percent?: number; amount?: number } | null;
  discountError: string | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;

  // Wishlist
  wishlist: string[]; // product IDs
  wishlistCount: number;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Currency
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountUSD: number) => string;

  // Quick View
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Checkout
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  // Audio Sound
  soundEnabled: boolean;
  toggleSound: () => void;

  // Search & Navigation
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;

  // Style Lab Bundle Helper
  addOutfitBundleToCart: (productIds: string[]) => void;
}

const FREE_SHIPPING_THRESHOLD_USD = 250;

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state from LocalStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vanguard_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vanguard_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('vanguard_currency') as CurrencyCode;
      return saved && CURRENCIES[saved] ? saved : 'USD';
    } catch {
      return 'USD';
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ name: string; percent?: number; amount?: number } | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('vanguard_cart', JSON.stringify(cart));
    } catch {
      // Ignored
    }
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('vanguard_wishlist', JSON.stringify(wishlist));
    } catch {
      // Ignored
    }
  }, [wishlist]);

  // Persist currency
  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    soundFx.playClick();
    try {
      localStorage.setItem('vanguard_currency', code);
    } catch {
      // Ignored
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.setEnabled(next);
    if (next) soundFx.playClick();
  };

  // Cart Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  let cartDiscount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.percent) {
      cartDiscount = cartSubtotal * appliedDiscount.percent;
    } else if (appliedDiscount.amount) {
      cartDiscount = Math.min(appliedDiscount.amount, cartSubtotal);
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD_USD) * 100));

  // Add to cart
  const addToCart = (product: Product, size?: string, color?: string, quantity: number = 1) => {
    const selectedSize = size || product.sizes[0] || 'M';
    const selectedColor = color || product.colors[0]?.name || 'Standard';
    const cartItemId = `${product.id}-${selectedSize}-${selectedColor}`;

    soundFx.playAddToCart();

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            product,
            selectedSize,
            selectedColor,
            quantity,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    soundFx.playClick();
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    soundFx.playClick();
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedDiscount(null);
    setDiscountCode('');
  };

  // Promo code verification
  const applyPromoCode = (code: string): boolean => {
    soundFx.playClick();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setDiscountError('Please enter a promo code');
      return false;
    }
    const found = VALID_DISCOUNT_CODES[cleanCode];
    if (found) {
      setAppliedDiscount(found);
      setDiscountCode(cleanCode);
      setDiscountError(null);
      soundFx.playHeart();
      return true;
    } else {
      setDiscountError('Invalid code. Try TRENDY20 for 20% off!');
      return false;
    }
  };

  const removePromoCode = () => {
    soundFx.playClick();
    setAppliedDiscount(null);
    setDiscountCode('');
    setDiscountError(null);
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    soundFx.playHeart();
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Currency formatter
  const formatPrice = (amountUSD: number): string => {
    const cur = CURRENCIES[currency];
    const converted = amountUSD * cur.rate;
    if (cur.code === 'JPY') {
      return `${cur.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${cur.symbol}${converted.toFixed(2)}`;
  };

  // Style lab bundle action: Add 4-5 items at once with a bundle discount
  const addOutfitBundleToCart = (productIds: string[]) => {
    soundFx.playAddToCart();
    const itemsToAdd: CartItem[] = [];

    productIds.forEach(id => {
      const p = PRODUCTS.find(prod => prod.id === id);
      if (p) {
        itemsToAdd.push({
          id: `${p.id}-${p.sizes[0] || 'M'}-${p.colors[0]?.name || 'Standard'}`,
          product: p,
          selectedSize: p.sizes[0] || 'M',
          selectedColor: p.colors[0]?.name || 'Standard',
          quantity: 1,
        });
      }
    });

    setCart(prev => {
      let next = [...prev];
      itemsToAdd.forEach(newItem => {
        const idx = next.findIndex(item => item.id === newItem.id);
        if (idx > -1) {
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        } else {
          next.push(newItem);
        }
      });
      return next;
    });

    // Auto apply 15% VIP bundle discount!
    if (!appliedDiscount) {
      setAppliedDiscount({ name: 'Style Lab 15% Bundle Savings', percent: 0.15 });
      setDiscountCode('STYLELAB15');
    }

    setIsCartOpen(true);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD_USD,
        freeShippingProgress,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        discountCode,
        appliedDiscount,
        discountError,
        applyPromoCode,
        removePromoCode,
        wishlist,
        wishlistCount: wishlist.length,
        isWishlistOpen,
        setIsWishlistOpen,
        toggleWishlist,
        isInWishlist,
        currency,
        setCurrency,
        formatPrice,
        quickViewProduct,
        setQuickViewProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        soundEnabled,
        toggleSound,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        addOutfitBundleToCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return ctx;
};
