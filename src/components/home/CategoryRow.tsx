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
    <section className="py-6 sm:py-8">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto">
        
        {/* Row Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
              <span>Fresh Mandi Categories</span>
              <span className="text-xs sm:text-sm font-bold text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
                6 Categories
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Everything sourced fresh at wholesale mandi rates
            </p>
          </div>

          <Link
            href="/shop"
            className="text-sm sm:text-base font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 group"
          >
            <span>See All</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Horizontally Scrollable Category Cards (Blinkit style) */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {/* "All" button if interactive */}
          {onSelectCategory && (
            <button
              onClick={() => onSelectCategory('all')}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-28 sm:w-32 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all duration-200 text-center ${
                selectedCategory === 'all'
                  ? 'bg-brand-700 text-white border-brand-700 shadow-md scale-105'
                  : 'bg-white hover:bg-brand-50 border-gray-200 text-gray-700 hover:border-brand-200 shadow-xs'
              }`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl sm:text-3xl mb-2">
                🧺
              </div>
              <span className="text-sm sm:text-base font-extrabold truncate w-full">All Veggies</span>
              <span className={`text-xs mt-0.5 font-medium ${selectedCategory === 'all' ? 'text-brand-200' : 'text-gray-400'}`}>
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
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-32 sm:w-36 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all duration-200 text-center group ${
                    isSelected
                      ? 'bg-brand-700 text-white border-brand-700 shadow-md scale-105'
                      : 'bg-white hover:bg-brand-50 border-gray-100 hover:border-brand-200 shadow-xs'
                  }`}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <span className={`text-sm sm:text-base font-bold leading-tight line-clamp-1 ${isSelected ? 'text-white' : 'text-gray-900 group-hover:text-brand-800'}`}>
                    {cat.name.split('(')[0].trim()}
                  </span>
                  <span className={`text-xs sm:text-sm mt-1 font-semibold ${isSelected ? 'text-brand-200' : 'text-emerald-800'}`}>
                    {cat.bengaliName}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={cat.id}
                href={`/shop?cat=${cat.slug}`}
                className="flex-shrink-0 flex flex-col items-center justify-center w-32 sm:w-36 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white hover:bg-brand-50 border border-gray-100 hover:border-brand-200 shadow-xs hover:shadow-sm transition-all duration-200 text-center group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <span className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-brand-800 leading-tight line-clamp-1">
                  {cat.name.split('(')[0].trim()}
                </span>
                <span className="text-xs sm:text-sm text-emerald-800 font-semibold mt-1">
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
