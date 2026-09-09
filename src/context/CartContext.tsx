'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, selectedWeight?: string, selectedPrice?: number) => void;
  removeItem: (productId: string, selectedWeight?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedWeight?: string) => void;
  getItemQuantity: (productId: string, selectedWeight?: string) => number;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  discount: number;
  promoDiscount: number;
  deliveryFee: number;
  mandiHandlingFee: number;
  grandTotal: number;
  appliedPromo: string | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'calway_cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items, isHydrated]);

  const addItem = (product: Product, selectedWeight?: string, selectedPrice?: number) => {
    const weight = selectedWeight || product.unitWeight;
    const price = selectedPrice !== undefined ? selectedPrice : product.price;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedWeight === weight
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedWeight: weight,
          selectedPrice: price,
        },
      ];
    });
  };

  const removeItem = (productId: string, selectedWeight?: string) => {
    setItems((prev) =>
      prev.filter((item) => {
        if (selectedWeight) {
          return !(item.product.id === productId && item.selectedWeight === selectedWeight);
        }
        return item.product.id !== productId;
      })
    );
  };

  const updateQuantity = (productId: string, quantity: number, selectedWeight?: string) => {
    if (quantity <= 0) {
      removeItem(productId, selectedWeight);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        const matches = selectedWeight
          ? item.product.id === productId && item.selectedWeight === selectedWeight
          : item.product.id === productId;
        return matches ? { ...item, quantity } : item;
      })
    );
  };

  const getItemQuantity = (productId: string, selectedWeight?: string): number => {
    const item = items.find((i) => {
      if (selectedWeight) {
        return i.product.id === productId && i.selectedWeight === selectedWeight;
      }
      return i.product.id === productId;
    });
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  // Pricing calculations
  const totalItemsCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.selectedPrice * item.quantity, 0);
  }, [items]);

  // Total savings from original MRP prices
  const discount = useMemo(() => {
    return items.reduce((acc, item) => {
      const original = item.product.originalPrice || item.selectedPrice;
      const savingsPerUnit = Math.max(0, original - item.selectedPrice);
      return acc + savingsPerUnit * item.quantity;
    }, 0);
  }, [items]);

  // Promo code discounts
  const promoDiscount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo === 'MANDI20') {
      return Math.round(subtotal * 0.2); // 20% off
    }
    if (appliedPromo === 'DAWN10') {
      return Math.round(subtotal * 0.1); // 10% off
    }
    if (appliedPromo === 'KOLKATA50') {
      return subtotal >= 250 ? 50 : 0;
    }
    return 0;
  }, [appliedPromo, subtotal]);

  // Free delivery above ₹199, else ₹25
  const deliveryFee = useMemo(() => {
    if (items.length === 0) return 0;
    if (appliedPromo === 'FREESHIP') return 0;
    return subtotal >= 199 ? 0 : 25;
  }, [items.length, subtotal, appliedPromo]);

  // Dawn Mandi sorting & handling fee (₹0 promotional waiver!)
  const mandiHandlingFee = 0;

  const grandTotal = useMemo(() => {
    if (items.length === 0) return 0;
    const total = subtotal - promoDiscount + deliveryFee + mandiHandlingFee;
    return Math.max(0, total);
  }, [items.length, subtotal, promoDiscount, deliveryFee, mandiHandlingFee]);

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'MANDI20') {
      setAppliedPromo('MANDI20');
      return { success: true, message: '🎉 20% Mandi Fresh discount applied!' };
    }
    if (clean === 'DAWN10') {
      setAppliedPromo('DAWN10');
      return { success: true, message: '☀️ 10% Dawn Delivery discount applied!' };
    }
    if (clean === 'FREESHIP') {
      setAppliedPromo('FREESHIP');
      return { success: true, message: '🚚 Free Dawn Delivery applied!' };
    }
    if (clean === 'KOLKATA50') {
      if (subtotal < 250) {
        return { success: false, message: 'Minimum order of ₹250 required for KOLKATA50.' };
      }
      setAppliedPromo('KOLKATA50');
      return { success: true, message: '✨ ₹50 off applied on your order!' };
    }
    return { success: false, message: 'Invalid promo code. Try MANDI20 or FREESHIP!' };
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        getItemQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        discount,
        promoDiscount,
        deliveryFee,
        mandiHandlingFee,
        grandTotal,
        appliedPromo,
        applyPromo,
        removePromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
