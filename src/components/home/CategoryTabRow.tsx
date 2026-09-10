'use client';

import React from 'react';

interface CategoryTab {
  id: string;
  name: string;
  bengaliName?: string;
  icon: string;
}

const CATEGORY_TABS: CategoryTab[] = [
  { id: 'all', name: 'All', bengaliName: 'সবজি', icon: '🥬' },
  { id: 'leafy-greens', name: 'Leafy Greens', bengaliName: 'শাক', icon: '🥗' },
  { id: 'daily-essentials', name: 'Daily Staples', bengaliName: 'নিত্যপ্রয়োজনীয়', icon: '🥔' },
  { id: 'root-vegetables', name: 'Root Veggies', bengaliName: 'মূলজ সবজি', icon: '🥕' },
  { id: 'kolkata-specials', name: 'Mandi Specials', bengaliName: 'কলকাতা স্পেশাল', icon: '✨' },
  { id: 'combos-kits', name: 'Combos & Baskets', bengaliName: 'কম্বো কিট', icon: '🧺' },
  { id: 'exotics-salads', name: 'Exotics', bengaliName: 'এক্সোটিক', icon: '🍄' },
];

interface CategoryTabRowProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryTabRow: React.FC<CategoryTabRowProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full bg-white border-b border-gray-100 py-2.5 px-3 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth">
        {CATEGORY_TABS.map((tab) => {
          const isActive = selectedCategory === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                onSelectCategory(tab.id);
                // Optional: scroll smoothly to catalog if clicked
                const el = document.getElementById('catalog');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className={`flex flex-col items-center justify-center shrink-0 min-w-[72px] sm:min-w-[84px] px-2 py-1.5 rounded-2xl transition-all duration-200 group relative ${
                isActive ? 'text-brand-900 font-extrabold' : 'text-gray-500 hover:text-gray-800 font-medium'
              }`}
            >
              {/* Category Icon Bubble */}
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl transition-transform duration-200 group-hover:scale-105 shadow-2xs ${
                  isActive
                    ? 'bg-brand-100/80 ring-2 ring-brand-500/40'
                    : 'bg-gray-50 group-hover:bg-gray-100/80 border border-gray-200/60'
                }`}
              >
                {tab.icon}
              </div>

              {/* Label */}
              <span className={`text-[11px] sm:text-xs mt-1.5 text-center leading-tight whitespace-nowrap ${
                isActive ? 'font-black text-brand-950' : 'font-semibold text-gray-700'
              }`}>
                {tab.name}
              </span>

              {/* Active Underline Indicator */}
              {isActive ? (
                <span className="w-8 h-1 bg-brand-600 rounded-full mt-1 animate-in fade-in zoom-in-75 duration-200" />
              ) : (
                <span className="w-8 h-1 bg-transparent mt-1" />
              )}
            </button>
          );
        })}
        {/* Subtle right-side peek buffer */}
        <div className="shrink-0 w-3" />
      </div>
    </div>
  );
};
