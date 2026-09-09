'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { Sparkles, ChevronLeft, ChevronRight, Clock, ArrowRight } from 'lucide-react';

interface MandiSpecialsProps {
  products: Product[];
}

export const MandiSpecials: React.FC<MandiSpecialsProps> = ({ products }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const specials = products.filter((p) => p.isMandiSpecial);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-6 sm:py-8 bg-gradient-to-b from-brand-50/40 via-white to-white overflow-hidden w-full max-w-full">
      <div className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-7">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-100 text-amber-950 font-black text-[11px] sm:text-sm uppercase tracking-wider rounded-xl mb-1.5 border border-accent-200">
              <Sparkles className="w-3.5 h-3.5 text-accent-600" />
              <span>Direct From Dawn Mandi Runs</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>Today&apos;s Dawn Specials</span>
              <span className="flex items-center gap-1 text-[10px] sm:text-sm font-bold text-emerald-800 bg-emerald-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" /> 4:00 AM
              </span>
            </h2>
            <p className="text-xs sm:text-base text-gray-600 mt-1">
              Hand-sorted before dawn at Koley & Mechua wholesale markets. Limited morning availability!
            </p>
          </div>

          {/* Carousel Arrows & View All */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => scroll('left')}
              className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 shadow-xs hover:border-brand-300 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 shadow-xs hover:border-brand-300 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <Link
              href="/shop"
              className="ml-1 sm:ml-2 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs sm:text-sm font-extrabold rounded-xl sm:rounded-2xl border border-brand-200 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar pb-3 pt-1 w-full max-w-full scroll-smooth snap-x snap-mandatory"
        >
          {specials.map((product) => (
            <div
              key={product.id}
              className="w-[185px] sm:w-[260px] md:w-[280px] shrink-0 snap-start"
            >
              <ProductCard product={product} featured={true} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
