'use client';

import React from 'react';
import Link from 'next/link';
import categoriesData from '@/data/categories.json';
import { Category } from '@/types';
import { ChevronRight } from 'lucide-react';

const categories = categoriesData as Category[];

interface CategoryRowProps {
  selectedCategory?: string;
  onSelectCategory?: (slug: string) => void;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="py-5 sm:py-8 overflow-hidden w-full max-w-full">
      <div className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto">
        
        {/* Row Header */}
        <div className="flex items-center justify-between mb-3.5 sm:mb-5">
          <div>
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>Fresh Mandi Categories</span>
              <span className="text-[10px] sm:text-xs font-bold text-brand-700 bg-brand-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                6 Categories
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Everything sourced fresh at wholesale mandi rates
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs sm:text-sm font-bold text-brand-700 hover:text-brand-800 flex items-center gap-0.5 group shrink-0"
          >
            <span>See All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Horizontally Scrollable Category Cards (Blinkit style bubbles with peek) */}
        <div className="flex items-center gap-2 sm:gap-3.5 overflow-x-auto no-scrollbar pb-2 pt-1 w-full max-w-full">
          {/* "All" button if interactive */}
          {onSelectCategory && (
            <button
              onClick={() => onSelectCategory('all')}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-[74px] sm:w-28 md:w-32 p-1.5 sm:p-3 rounded-2xl transition-all duration-200 text-center ${
                selectedCategory === 'all'
                  ? 'scale-105'
                  : 'hover:opacity-90'
              }`}
            >
              <div className={`w-13 h-13 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center text-2xl sm:text-3xl mb-1.5 shadow-xs transition-all ${
                selectedCategory === 'all'
                  ? 'bg-brand-600 text-white shadow-md ring-2 ring-brand-400'
                  : 'bg-emerald-50 border border-emerald-100 text-brand-900'
              }`}>
                🧺
              </div>
              <span className="text-[11px] sm:text-sm font-black text-gray-900 truncate w-full leading-tight">All</span>
              <span className={`text-[9px] sm:text-xs font-semibold ${selectedCategory === 'all' ? 'text-brand-700 font-bold' : 'text-gray-400'}`}>
                26 items
              </span>
            </button>
          )}

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;

            if (onSelectCategory) {
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-[74px] sm:w-28 md:w-32 p-1.5 sm:p-3 rounded-2xl transition-all duration-200 text-center group ${
                    isSelected ? 'scale-105' : 'hover:opacity-90'
                  }`}
                >
                  <div className={`w-13 h-13 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center text-2xl sm:text-3xl mb-1.5 shadow-xs transition-all group-hover:scale-105 ${
                    isSelected
                      ? 'bg-brand-600 border-brand-600 text-white shadow-md ring-2 ring-brand-400'
                      : 'bg-brand-50/90 border border-brand-100 text-gray-900'
                  }`}>
                    {cat.icon}
                  </div>
                  <span className={`text-[11px] sm:text-sm font-black leading-tight line-clamp-1 w-full ${isSelected ? 'text-brand-800' : 'text-gray-900 group-hover:text-brand-800'}`}>
                    {cat.name.split('(')[0].trim()}
                  </span>
                  <span className={`text-[9px] sm:text-xs mt-0.5 font-semibold truncate w-full ${isSelected ? 'text-brand-600 font-bold' : 'text-emerald-800'}`}>
                    {cat.bengaliName}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={cat.id}
                href={`/shop?cat=${cat.slug}`}
                className="flex-shrink-0 flex flex-col items-center justify-center w-[74px] sm:w-28 md:w-32 p-1.5 sm:p-3 rounded-2xl transition-all duration-200 text-center group hover:opacity-90"
              >
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-brand-50/90 border border-brand-100/90 flex items-center justify-center text-2xl sm:text-3xl mb-1.5 shadow-xs group-hover:scale-105 transition-transform">
                  {cat.icon}
                </div>
                <span className="text-[11px] sm:text-sm font-black text-gray-900 group-hover:text-brand-800 leading-tight line-clamp-1 w-full">
                  {cat.name.split('(')[0].trim()}
                </span>
                <span className="text-[9px] sm:text-xs text-emerald-800 font-semibold mt-0.5 truncate w-full">
                  {cat.bengaliName}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
