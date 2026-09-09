'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

export const StickyCartBar: React.FC = () => {
  const pathname = usePathname();
  const { totalItemsCount, subtotal, deliveryFee } = useCart();

  // Hide on cart and checkout pages
  if (pathname === '/cart' || pathname === '/checkout') return null;
  if (totalItemsCount === 0) return null;

  return (
    <div className="fixed bottom-14 sm:bottom-6 left-0 right-0 z-40 px-4 pointer-events-none transition-all duration-300 animate-in slide-in-from-bottom-4">
      <div className="max-w-xl mx-auto pointer-events-auto">
        <Link
          href="/cart"
          className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-brand-700 via-brand-800 to-brand-900 text-white rounded-3xl shadow-float border border-brand-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-accent-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-200">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} added
                </span>
                {deliveryFee === 0 && (
                  <span className="text-xs font-bold bg-accent-400 text-brand-950 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Free Delivery
                  </span>
                )}
              </div>
              <div className="text-lg sm:text-xl font-black text-white">
                ₹{subtotal} <span className="text-xs sm:text-sm font-normal text-brand-200">+ morning drop</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-accent-400 group-hover:bg-accent-300 text-brand-950 font-black text-sm sm:text-base px-5 py-3 rounded-2xl shadow-sm transition-colors">
            <span>View Cart</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
};
