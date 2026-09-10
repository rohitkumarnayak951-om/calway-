'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { HeroBanner } from '@/components/home/HeroBanner';
import { HowItWorks } from '@/components/home/HowItWorks';
import { CategoryTabRow } from '@/components/home/CategoryTabRow';
import { FeaturedPromoRow } from '@/components/home/FeaturedPromoRow';
import { PreviouslyBoughtRow } from '@/components/home/PreviouslyBoughtRow';
import { MandiSpecials } from '@/components/home/MandiSpecials';
import { TrustSection } from '@/components/home/TrustSection';
import { Testimonials } from '@/components/home/Testimonials';
import { SubscriptionTeaser } from '@/components/home/SubscriptionTeaser';
import { ProductGrid } from '@/components/product/ProductGrid';
import { productService } from '@/services/productService';
import productsData from '@/data/products.json';
import { Product } from '@/types';
import { 
  ArrowRight, 
  SlidersHorizontal, 
  ChevronDown 
} from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(productsData as Product[]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'freshness'>('popular');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      const data = await productService.getProducts();
      setProducts(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    switch (sortBy) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'freshness':
        list.sort((a, b) => (b.isMandiSpecial ? 1 : 0) - (a.isMandiSpecial ? 1 : 0));
        break;
      case 'popular':
      default:
        list.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
    }
    return list;
  }, [products, selectedCategory, sortBy]);

  return (
    <div className="space-y-2 sm:space-y-8 pb-28 sm:pb-16 w-full max-w-full overflow-hidden">
      
      {/* 4. Horizontal Category Tab Row (Directly below search bar) */}
      <CategoryTabRow
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => setSelectedCategory(slug)}
      />

      {/* 5. Featured / Promo Card Row (Square 1:1 Aspect Cards with Ribbons) */}
      <FeaturedPromoRow />

      {/* 6. "Previously Bought" / Reorder Horizontal Row */}
      {products.length > 0 && <PreviouslyBoughtRow products={products} />}

      {/* Desktop-Only Promotional Hero & Journey (>=md) */}
      <div className="hidden md:block space-y-6">
        <HeroBanner />
        <HowItWorks />
      </div>

      {/* Mandi Specials Horizontal Carousel */}
      {products.length > 0 && <MandiSpecials products={products} />}

      {/* Full Product Catalog with Filter & Sort Controls */}
      <section className="py-4 sm:py-8 bg-white" id="catalog">
        <div className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-2 sm:gap-3">
                <span>All Mandi Fresh Vegetables</span>
                <span className="text-[10px] sm:text-sm font-extrabold px-2.5 sm:px-3 py-0.5 sm:py-1 bg-brand-100 text-brand-800 rounded-full">
                  {filteredProducts.length} items
                </span>
              </h2>
              <p className="text-xs sm:text-base text-gray-500 mt-0.5 sm:mt-1">
                Prices updated directly from 4:00 AM wholesale auction rates
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-sm font-bold text-gray-600 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" /> Sort:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'popular' | 'price-low' | 'price-high' | 'freshness')}
                  className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-sm font-bold py-2.5 pl-3.5 pr-9 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="popular">Most Popular in Kolkata</option>
                  <option value="freshness">Mandi Fresh Arrivals First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Category Filter Tag if not 'all' */}
          {selectedCategory !== 'all' && (
            <div className="py-3.5 flex items-center gap-2.5 text-sm">
              <span className="text-gray-500 font-medium">Filtering by category:</span>
              <span className="px-3 py-1 bg-brand-100 text-brand-900 font-bold rounded-xl capitalize flex items-center gap-2">
                {selectedCategory.replace('-', ' ')}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-brand-700 hover:text-brand-950 font-bold ml-1 text-base leading-none"
                  title="Remove filter"
                >
                  ×
                </button>
              </span>
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-brand-700 hover:underline font-semibold ml-2"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Product Grid */}
          <div className="pt-6">
            <ProductGrid
              products={filteredProducts}
              isLoading={isLoading}
              onResetFilters={() => setSelectedCategory('all')}
            />
          </div>

          {/* Explore More CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-900 font-black text-base rounded-2xl transition-all hover:scale-105"
            >
              <span>Explore Advanced Filterable Shop</span>
              <ArrowRight className="w-4 h-4 text-brand-600" />
            </Link>
          </div>

        </div>
      </section>

      {/* 6. Why CALWAY Trust Cards */}
      <TrustSection />

      {/* 7. Kolkata Testimonials */}
      <Testimonials />

      {/* 8. Subscription Morning Basket Teaser */}
      <SubscriptionTeaser />

    </div>
  );
}
