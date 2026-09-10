'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ChevronRight } from 'lucide-react';

export const StickyCartBar: React.FC = () => {
  const pathname = usePathname();
  const { items, totalItemsCount, subtotal } = useCart();

  // Hide on cart and checkout pages
  if (pathname === '/cart' || pathname === '/checkout') return null;
  if (totalItemsCount === 0) return null;

  return (
    <div className="fixed bottom-[74px] md:bottom-6 left-0 right-0 z-40 px-3 sm:px-4 pointer-events-none transition-all duration-300 animate-in slide-in-from-bottom-5">
      <div className="max-w-md mx-auto pointer-events-auto">
        <Link
          href="/cart"
          className="flex items-center justify-between px-3.5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-2xl border border-emerald-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
          aria-label="View Cart"
        >
          {/* Left: 2-3 stacked overlapping circular thumbnails + count badge */}
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="flex items-center -space-x-2.5 shrink-0">
              {items.slice(0, 3).map((item, idx) => (
                <div
                  key={`${item.product.id}-${idx}`}
                  className="w-8 h-8 rounded-full border-2 border-white bg-white overflow-hidden relative shadow-2xs shrink-0"
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
              ))}
            </div>

            <span className="bg-accent-400 text-brand-950 font-black text-[10px] px-1.5 py-0.5 rounded-full shrink-0 shadow-2xs">
              {totalItemsCount}
            </span>
          </div>

          {/* Center: "View Cart" + total price */}
          <div className="flex flex-col items-center justify-center text-center px-2 min-w-0">
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              View Cart
            </span>
            <span className="text-[11px] font-extrabold text-emerald-100 truncate">
              {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} • ₹{subtotal}
            </span>
          </div>

          {/* Right: small chevron-right arrow */}
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-white/30 transition-colors">
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
};
