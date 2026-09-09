'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, Category } from '@/types';
import { productService } from '@/services/productService';
import { ProductGrid } from '@/components/product/ProductGrid';
import { 
  SlidersHorizontal, 
  Search, 
  Sparkles, 
  X, 
  ChevronDown, 
  RotateCcw,
  Filter
} from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(catParam);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'freshness'>('popular');
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [onlyMandiSpecials, setOnlyMandiSpecials] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [prods, cats] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Sync category with URL query param when param changes
  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [catParam]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.bengaliName && p.bengaliName.includes(q)) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.mandiSource.toLowerCase().includes(q)
      );
    }

    // Price
    list = list.filter((p) => p.price <= maxPrice);

    // Mandi specials only
    if (onlyMandiSpecials) {
      list = list.filter((p) => p.isMandiSpecial);
    }

    // Sorting
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
  }, [products, selectedCategory, searchTerm, maxPrice, onlyMandiSpecials, sortBy]);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setMaxPrice(200);
    setOnlyMandiSpecials(false);
    setSortBy('popular');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchTerm !== '' ||
    maxPrice < 200 ||
    onlyMandiSpecials ||
    sortBy !== 'popular';

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto py-6 sm:py-10">
      
      {/* Page Heading & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Mandi Produce Catalog
            </h1>
            <span className="text-xs sm:text-sm font-bold px-3 py-1 bg-brand-100 text-brand-800 rounded-full">
              {filteredProducts.length} items
            </span>
          </div>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Hand-picked daily from Sealdah Koley & Mechua wholesale markets
          </p>
        </div>

        {/* Search inside shop */}
        <div className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vegetable by English or Bengali name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-2xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden p-3 bg-white border border-gray-200 text-gray-700 rounded-2xl flex items-center gap-2 text-sm font-bold shrink-0 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 text-brand-600" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Sidebar + Right Products Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-600" />
              <span>Filters</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-3">
              Categories
            </h4>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-brand-100 text-brand-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>All Categories</span>
                <span className="text-xs text-gray-400">{products.length}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-brand-100 text-brand-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.name.split('(')[0].trim()}</span>
                  </span>
                  <span className="text-xs text-gray-400">{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dawn Fresh Specials Toggle */}
          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-center gap-2.5 cursor-pointer text-sm font-bold text-gray-800">
              <input
                type="checkbox"
                checked={onlyMandiSpecials}
                onChange={(e) => setOnlyMandiSpecials(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500 accent-brand-600"
              />
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accent-500" />
                <span>Mandi Specials Only</span>
              </span>
            </label>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm font-bold text-gray-900 mb-2">
              <span>Max Price</span>
              <span className="text-brand-700 font-extrabold">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>₹20</span>
              <span>₹200</span>
            </div>
          </div>

          {/* Morning Guarantee note */}
          <div className="p-3.5 bg-brand-50 rounded-2xl border border-brand-100 text-xs text-brand-800">
            <p className="font-bold">⚡ Zero Cold Storage</p>
            <p className="text-xs text-brand-600 mt-1 leading-relaxed">
              All produce is priced at wholesale dawn rates and delivered in breathable bags before 7:00 AM.
            </p>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in">
            <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 max-h-[80vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-black text-lg text-gray-900">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2.5">
                  Select Category
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`p-3 rounded-xl text-sm font-bold text-left border ${
                      selectedCategory === 'all'
                        ? 'bg-brand-100 border-brand-500 text-brand-900'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    All Veggies
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`p-3 rounded-xl text-sm font-bold text-left border ${
                        selectedCategory === cat.slug
                          ? 'bg-brand-100 border-brand-500 text-brand-900'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      {cat.icon} {cat.name.split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mandi Specials checkbox */}
              <div>
                <label className="flex items-center gap-2.5 cursor-pointer text-sm font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={onlyMandiSpecials}
                    onChange={(e) => setOnlyMandiSpecials(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded accent-brand-600"
                  />
                  <span>Show Only Mandi Dawn Specials</span>
                </label>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex items-center justify-between text-sm font-bold text-gray-900 mb-2">
                  <span>Max Price: ₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={resetAllFilters}
                  className="flex-1 py-3.5 border border-gray-200 text-gray-700 font-bold text-sm rounded-2xl"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3.5 bg-brand-600 text-white font-bold text-sm rounded-2xl shadow-sm"
                >
                  Apply Filters ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Sorting and Active Filter Pills Header */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            
            {/* Quick Category Chips for Mobile & Tablet */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-brand-700 text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-brand-700 text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {cat.icon} {cat.name.split('(')[0].trim()}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'price-low' | 'price-high' | 'freshness')}
                className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs sm:text-sm font-bold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="freshness">Mandi Fresh First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          </div>

          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            isLoading={isLoading}
            onResetFilters={resetAllFilters}
          />

        </div>

      </div>

    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="w-full p-12 text-center text-gray-500">Loading Mandi Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
