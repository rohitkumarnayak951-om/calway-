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
    <div className="fixed bottom-[68px] md:bottom-6 left-0 right-0 z-40 px-3 sm:px-4 pointer-events-none transition-all duration-300 animate-in slide-in-from-bottom-4">
      <div className="max-w-xl mx-auto pointer-events-auto">
        <Link
          href="/cart"
          className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-brand-800 via-brand-900 to-brand-950 text-white rounded-2xl sm:rounded-3xl shadow-float border border-brand-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center text-accent-400 shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-brand-200">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                </span>
                {deliveryFee === 0 && (
                  <span className="text-[9px] sm:text-[11px] font-black bg-accent-400 text-brand-950 px-2 py-0.2 rounded-full flex items-center gap-0.5 shrink-0">
                    <Sparkles className="w-3 h-3" /> Free Drop
                  </span>
                )}
              </div>
              <div className="text-sm sm:text-lg font-black text-white truncate">
                ₹{subtotal} <span className="text-[10px] sm:text-xs font-normal text-brand-200">+ morning drop</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 bg-accent-400 group-hover:bg-accent-300 text-brand-950 font-black text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-sm transition-colors shrink-0 ml-2">
            <span>View Cart</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
};
