'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, Plus, Check, ArrowRight, Sparkles } from 'lucide-react';
import productsData from '@/data/products.json';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

const allProducts = productsData as Product[];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { addItem, getItemQuantity } = useCart();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!searchTerm.trim()) {
      // Show top trending items when search is empty
      return allProducts.slice(0, 6);
    }
    const q = searchTerm.toLowerCase().trim();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.bengaliName && p.bengaliName.includes(q)) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.mandiSource.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/70">
          <Search className="w-6 h-6 text-brand-600 shrink-0" />
          <input
            type="text"
            placeholder="Search for tomatoes, spinach, shukto kit, kacha lanka..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-base sm:text-lg font-medium focus:outline-none"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 sm:px-5 py-3 bg-brand-50/50 border-b border-brand-100/50 flex items-center gap-2 overflow-x-auto no-scrollbar text-sm">
          <span className="text-gray-600 font-medium shrink-0 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent-500" /> Popular:
          </span>
          {['Palak Shaak', 'Chandramukhi Potato', 'Desi Tomato', 'Kacha Lanka', 'Shukto Kit', 'Begun'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="px-3 py-1.5 bg-white hover:bg-brand-100 text-brand-800 rounded-full border border-brand-200 shrink-0 transition-colors font-semibold text-xs sm:text-sm"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-gray-100">
          <div className="flex items-center justify-between pb-3 text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider">
            <span>{searchTerm ? `Search Results (${results.length})` : "Trending Mandi Picks This Morning"}</span>
            <Link 
              href="/shop" 
              onClick={onClose}
              className="text-brand-700 hover:text-brand-800 flex items-center gap-1 capitalize font-bold text-xs sm:text-sm"
            >
              View all 25+ products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {results.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-gray-700 text-base sm:text-lg font-bold">No fresh produce found matching &ldquo;{searchTerm}&rdquo;</p>
              <p className="text-sm text-gray-500 mt-1">Try searching for potato, shaak, begun, or tomato</p>
            </div>
          ) : (
            results.map((product) => {
              const qty = getItemQuantity(product.id, product.unitWeight);
              return (
                <div
                  key={product.id}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-brand-50/40 px-3 rounded-2xl transition-colors group"
                >
                  <Link
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="64px"
                      />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate group-hover:text-brand-700 transition-colors">
                          {product.name}
                        </h4>
                        {product.bengaliName && (
                          <span className="text-xs sm:text-sm text-emerald-800 font-semibold hidden sm:inline">
                            ({product.bengaliName})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs sm:text-sm text-gray-500 font-medium">{product.unitWeight}</span>
                        <span className="text-xs bg-brand-100 text-brand-800 px-2 py-0.5 rounded-md font-semibold">
                          {product.mandiSource.split(',')[0]}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Price & Add button */}
                  <div className="flex items-center gap-3.5 shrink-0">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black text-gray-900">₹{product.price}</div>
                      {product.originalPrice > product.price && (
                        <div className="text-xs sm:text-sm text-gray-400 line-through">₹{product.originalPrice}</div>
                      )}
                    </div>

                    <button
                      onClick={() => addItem(product)}
                      className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                        qty > 0
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-accent-400 hover:bg-accent-500 text-brand-950 shadow-sm hover:scale-105'
                      }`}
                    >
                      {qty > 0 ? (
                        <>
                          <Check className="w-4 h-4" /> {qty} in cart
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> ADD
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
