'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Plus, Minus, ChevronRight, Star, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface PreviouslyBoughtRowProps {
  products: Product[];
}

export const PreviouslyBoughtRow: React.FC<PreviouslyBoughtRowProps> = ({ products }) => {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Pick top staple items for "Previously Bought / Order Again"
  const reorderProducts = products.slice(0, 6);

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  if (!reorderProducts || reorderProducts.length === 0) return null;

  return (
    <section id="reorder" className="w-full py-4 px-3 sm:px-6 bg-white">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-1.5">
            <span>Previously Bought</span>
          </h2>
          <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
            Order Again
          </span>
        </div>

        <Link
          href="/shop"
          className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-0.5 group"
        >
          <span>See all</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Horizontal Scrollable Product Card Row */}
      <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-3 pt-1">
        {reorderProducts.map((product, idx) => {
          const quantity = getItemQuantity(product.id, product.unitWeight);
          const isFav = !!favorites[product.id];
          const discountPct = product.discountPercent || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
          const stockNotes = [
            'Harvested 3 hrs ago',
            'Only 4 left at this price',
            'Koley Mandi batch',
            'Fast selling',
            'Harvested at dawn',
            'Fresh dew batch',
          ];
          const stockNote = stockNotes[idx % stockNotes.length];

          const handleAdd = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            addItem(product, product.unitWeight, product.price);
          };

          const handleIncrement = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            updateQuantity(product.id, quantity + 1, product.unitWeight);
          };

          const handleDecrement = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            updateQuantity(product.id, quantity - 1, product.unitWeight);
          };

          return (
            <div
              key={product.id}
              className="shrink-0 w-[148px] sm:w-[165px] bg-white rounded-2xl border border-gray-100/90 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between p-2 snap-start group relative"
            >
              {/* Top: Square Product Image with Overlapping Stepper */}
              <div className="relative aspect-square w-full rounded-xl bg-gray-50">
                {/* Product Image */}
                <Link href={`/product/${product.id}`} className="block relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 p-1"
                    sizes="165px"
                  />
                </Link>

                {/* Wishlist / Heart Icon in Top-Right Corner */}
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(product.id, e)}
                  className={`absolute top-1.5 right-1.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-2xs ${
                    isFav
                      ? 'bg-rose-50 text-rose-500'
                      : 'bg-white/90 backdrop-blur-xs text-gray-400 hover:text-rose-500'
                  }`}
                  aria-label="Save to wishlist"
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {/* Dot-carousel indicator at bottom center of image */}
                <div className="absolute bottom-1.5 left-0 right-0 z-10 flex justify-center items-center gap-1 pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                </div>

                {/* Weight badge pill at bottom-left corner of image */}
                <div className="absolute bottom-1.5 left-1.5 z-10 bg-white/95 backdrop-blur-xs text-[10px] font-bold px-1.5 py-0.5 rounded-md text-gray-800 shadow-2xs border border-gray-200/60 pointer-events-none">
                  {product.unitWeight}
                </div>

                {/* Green + ADD or - count + Stepper: Slightly overlapping the image bottom edge */}
                <div className="absolute -bottom-2.5 right-1.5 z-20">
                  {quantity === 0 ? (
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="h-7 px-2.5 rounded-lg font-black text-[11px] bg-brand-600 hover:bg-brand-700 text-white shadow-sm flex items-center gap-0.5 hover:scale-105 active:scale-95 transition-all duration-150"
                    >
                      <Plus className="w-3 h-3 text-white" />
                      <span>ADD</span>
                    </button>
                  ) : (
                    <div className="h-7 px-1 bg-brand-700 text-white rounded-lg flex items-center justify-between gap-1 shadow-sm">
                      <button
                        type="button"
                        onClick={handleDecrement}
                        className="w-5 h-5 rounded flex items-center justify-center hover:bg-brand-800 transition-colors active:scale-90"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-black text-[11px] px-0.5 min-w-[14px] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={handleIncrement}
                        className="w-5 h-5 rounded flex items-center justify-center hover:bg-brand-800 transition-colors active:scale-90"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Below Image Details (with padding-top to clear the overlapping button) */}
              <div className="pt-3.5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Price Row: Bold price, struck MRP, blue discount label */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-black text-gray-900 leading-none">
                      ₹{product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-[10px] text-gray-400 line-through leading-none">
                        ₹{product.originalPrice}
                      </span>
                    )}
                    {discountPct > 0 && (
                      <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-1 py-0.2 rounded leading-none">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>

                  {/* Product Name (2 lines max, bold, readable) */}
                  <Link href={`/product/${product.id}`} className="block mt-1">
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-brand-700 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                {/* Rating, Delivery Chip & Stock Indicator */}
                <div className="mt-1.5 pt-1 border-t border-gray-50 flex flex-col gap-0.5">
                  {/* Star Rating + Review Count */}
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{product.rating || '4.8'}</span>
                    <span className="text-gray-400">({product.reviewsCount || 120})</span>
                  </div>

                  {/* Delivery Chip */}
                  <div className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded inline-flex items-center gap-1 w-fit mt-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                    <span>Dawn 7 AM</span>
                  </div>

                  {/* Stock / Harvest Indicator */}
                  <div className="text-[9px] font-semibold text-amber-700 truncate mt-0.5">
                    {stockNote}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* Trailing peek padding */}
        <div className="shrink-0 w-2" />
      </div>
    </section>
  );
};
