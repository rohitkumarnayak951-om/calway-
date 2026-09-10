'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Clock } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, featured = false }) => {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image);

  const currentOption = product.weightOptions?.[selectedWeightIndex] || {
    weight: product.unitWeight,
    price: product.price,
    originalPrice: product.originalPrice,
  };

  const quantity = getItemQuantity(product.id, currentOption.weight);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, currentOption.weight, currentOption.price);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 300);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity + 1, currentOption.weight);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 300);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity - 1, currentOption.weight);
  };

  return (
    <div className={`group bg-white rounded-2xl sm:rounded-3xl border border-gray-100/90 shadow-sm hover:shadow-soft transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
      featured ? 'ring-1 ring-brand-300' : ''
    }`}>
      
      {/* Top badges: Mandi arrival status & discount */}
      <div className="absolute top-2 left-2 right-2 z-10 flex items-start justify-between pointer-events-none gap-1">
        {product.discountPercent > 0 ? (
          <span className="px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase tracking-wider bg-accent-400 text-brand-950 rounded-lg shadow-sm shrink-0">
            {product.discountPercent}% OFF
          </span>
        ) : <span />}

        {product.mandiFreshBadge && (
          <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] sm:text-xs font-bold bg-white/95 backdrop-blur-sm text-brand-800 border border-brand-200/80 rounded-lg shadow-xs items-center gap-1 shrink-0 truncate max-w-[110px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="truncate">{product.mandiFreshBadge}</span>
          </span>
        )}
      </div>

      {/* Image and Detail Link */}
      <Link href={`/product/${product.id}`} className="block relative pt-[85%] bg-gray-50 overflow-hidden">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          onError={() => setImgSrc('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80')}
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out p-1 sm:p-2 rounded-2xl"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
        />
        {/* Mandi arrival badge at image bottom */}
        <div className="absolute bottom-1.5 left-2 bg-brand-950/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent-400 shrink-0" />
          <span className="truncate">{product.arrivalStatus}</span>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Bengali Name + Category */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-emerald-800 font-bold mb-0.5">
            <span className="truncate">{product.bengaliName || product.categoryLabel}</span>
            <span className="text-[10px] text-gray-400 font-normal truncate max-w-[70px] sm:max-w-[100px] ml-1">
              {product.mandiSource.split(',')[0]}
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2 leading-snug group-hover:text-brand-700 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Weight selection options */}
          <div className="mt-1.5 sm:mt-2.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {product.weightOptions && product.weightOptions.length > 1 ? (
              product.weightOptions.map((opt, idx) => (
                <button
                  key={opt.weight}
                  onClick={() => setSelectedWeightIndex(idx)}
                  className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-md sm:rounded-lg font-bold border transition-colors shrink-0 ${
                    selectedWeightIndex === idx
                      ? 'bg-brand-50 border-brand-500 text-brand-900'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {opt.weight}
                </button>
              ))
            ) : (
              <span className="text-[11px] sm:text-xs font-semibold text-gray-500">
                {currentOption.weight}
              </span>
            )}
          </div>
        </div>

        {/* Price & Quantity Stepper / Add Button */}
        <div className="mt-2.5 sm:mt-4 pt-2 border-t border-gray-100 flex items-center justify-between gap-1 sm:gap-2">
          {/* Price: stacked on mobile, inline on tablet+ */}
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5 min-w-0">
            <span className="text-sm sm:text-base lg:text-lg font-black text-gray-900 leading-tight">
              ₹{currentOption.price}
            </span>
            {currentOption.originalPrice > currentOption.price && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through leading-tight">
                ₹{currentOption.originalPrice}
              </span>
            )}
          </div>

          {/* Stepper / Add Button (Blinkit style: turns into - 1 +) */}
          <div className="shrink-0">
            {quantity === 0 ? (
              <button
                type="button"
                onClick={handleAdd}
                className="h-8 sm:h-9 min-w-[62px] px-3 sm:px-4 rounded-xl font-black text-xs sm:text-sm bg-emerald-50 hover:bg-accent-400 text-brand-800 hover:text-brand-950 border border-brand-300 hover:border-accent-500 flex items-center justify-center gap-1 shadow-2xs hover:scale-105 active:scale-95 transition-all duration-150"
              >
                <Plus className="w-3.5 h-3.5 text-brand-700" />
                <span>ADD</span>
              </button>
            ) : (
              <div className={`h-8 sm:h-9 px-1 sm:px-1.5 bg-brand-600 text-white rounded-xl flex items-center justify-between gap-0.5 sm:gap-1 shadow-sm transition-all ${
                justAdded ? 'animate-bounce-short scale-105' : ''
              }`}>
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-brand-700/80 hover:bg-brand-800 flex items-center justify-center text-white transition-colors active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-black text-xs sm:text-sm px-1 min-w-[16px] sm:min-w-[18px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-brand-700/80 hover:bg-brand-800 flex items-center justify-center text-white transition-colors active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
