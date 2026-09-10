'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import { productService } from '@/services/productService';
import productsData from '@/data/products.json';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { ProductCard } from '@/components/product/ProductCard';
import { 
  Clock, 
  MapPin, 
  Plus, 
  Minus, 
  ChevronRight, 
  Check, 
  Share2, 
  Utensils, 
  Leaf 
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const { selectedLocation } = useLocation();

  const initialProduct = (productsData as Product[]).find((p) => p.id === productId) || null;
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(initialProduct?.image || null);

  useEffect(() => {
    async function load() {
      const item = await productService.getProductById(productId);
      if (item) {
        setProduct(item);
        setImgSrc(item.image);
        const rel = await productService.getRelatedProducts(productId, 4);
        setRelated(rel);
      }
      setLoading(false);
    }
    if (productId) load();
  }, [productId]);

  if (loading && !product) {
    return (
      <div className="w-full px-4 sm:px-8 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-bold text-sm">Inspecting dawn mandi produce...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full px-4 sm:px-8 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900">Product not found</h2>
        <p className="text-gray-500 text-sm mt-1">This vegetable may have sold out for the day.</p>
        <Link
          href="/shop"
          className="mt-4 inline-block px-6 py-2.5 bg-brand-600 text-white rounded-2xl font-bold text-xs"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const currentOption = product.weightOptions?.[selectedWeightIndex] || {
    weight: product.unitWeight,
    price: product.price,
    originalPrice: product.originalPrice,
  };

  const quantity = getItemQuantity(product.id, currentOption.weight);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out fresh ${product.name} on CALWAY Kolkata!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto py-5 sm:py-10 pb-28 sm:pb-16">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 mb-4 sm:mb-6 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <Link href="/shop" className="hover:text-brand-700">Mandi Shop</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <Link href={`/shop?cat=${product.category}`} className="hover:text-brand-700 truncate">
          {product.categoryLabel}
        </Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 truncate">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 bg-white p-4 sm:p-10 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
        
        {/* Left Column: Image and Badges */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
            <Image
              src={imgSrc || product.image}
              alt={product.name}
              fill
              priority
              onError={() => setImgSrc('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80')}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Discount Badge */}
            {product.discountPercent > 0 && (
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-accent-400 text-brand-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md">
                {product.discountPercent}% OFF
              </span>
            )}

            {/* Share button */}
            <button
              onClick={handleShare}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 sm:p-3 bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl text-gray-700 hover:text-brand-700 hover:bg-white shadow-md transition-colors"
              title="Share product"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Mandi Arrival Timestamp Overlay */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 bg-brand-950/90 backdrop-blur-md text-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-white/10 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-400 shrink-0" />
                <span className="truncate">
                  Sourced <strong className="text-white font-black">{product.arrivalStatus}</strong> from <strong className="text-white font-black">{product.mandiSource.split(',')[0]}</strong>
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 rounded-lg shrink-0">
                Zero Storage
              </span>
            </div>
          </div>

          {/* Quick Quality Indicators */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center">
            <div className="p-3.5 bg-brand-50/60 rounded-2xl border border-brand-100/60">
              <div className="text-brand-800 font-extrabold text-sm sm:text-base">🌱 100% Fresh</div>
              <div className="text-xs text-gray-600 font-medium mt-0.5">Washed & Graded</div>
            </div>
            <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100/60">
              <div className="text-amber-900 font-extrabold text-sm sm:text-base">🚚 Dawn Drop</div>
              <div className="text-xs text-gray-600 font-medium mt-0.5">By 7:00 AM</div>
            </div>
            <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100/60">
              <div className="text-blue-900 font-extrabold text-sm sm:text-base">🛡️ Guarantee</div>
              <div className="text-xs text-gray-600 font-medium mt-0.5">1-Tap Replace</div>
            </div>
          </div>
        </div>

        {/* Right Column: Details, Weights, Pricing, & Add to Cart */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          
          <div className="space-y-5">
            {/* Bengali Subtitle & Category */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs sm:text-sm font-black px-3 py-1.5 bg-brand-100 text-brand-900 rounded-xl">
                {product.categoryLabel}
              </span>
              {product.bengaliName && (
                <span className="text-base sm:text-lg font-black text-emerald-800">
                  {product.bengaliName}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              {product.name}
            </h1>

            {/* Mandi Sourcing Stamp */}
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 font-medium">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <span>
                Auctioned at <strong className="font-bold text-gray-900">{product.mandiSource}</strong> • Delivered to {selectedLocation.name}
              </span>
            </div>

            {/* Pricing Section */}
            <div className="pt-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">
                  ₹{currentOption.price}
                </span>
                {currentOption.originalPrice > currentOption.price && (
                  <>
                    <span className="text-lg sm:text-xl text-gray-400 line-through font-bold">
                      ₹{currentOption.originalPrice}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl">
                      Save ₹{currentOption.originalPrice - currentOption.price}
                    </span>
                  </>
                )}
              </div>
              <span className="text-xs sm:text-sm text-gray-500 font-semibold mt-1.5 block">
                Inclusive of all taxes • Zero Mandi Sourcing Fee
              </span>
            </div>

            {/* Weight / Pack Options Selector */}
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-gray-900 mb-2.5">
                Select Pack Size / Weight
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.weightOptions?.map((opt, idx) => {
                  const isSelected = selectedWeightIndex === idx;
                  return (
                    <button
                      key={opt.weight}
                      onClick={() => setSelectedWeightIndex(idx)}
                      className={`px-4 sm:px-5 py-3 rounded-2xl border text-xs sm:text-sm font-black transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-brand-50 border-brand-600 text-brand-950 shadow-sm ring-2 ring-brand-500/20'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>{opt.weight}</span>
                      <span className="text-brand-700 font-black">₹{opt.price}</span>
                      {isSelected && <Check className="w-4 h-4 text-brand-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-900 mb-2">
                About this Mandi Harvest
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                {product.description}
              </p>
            </div>

            {/* Nutritional Highlights */}
            {product.nutritionalHighlights && (
              <div className="pt-2">
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-900 mb-2.5">
                  Health & Nutritional Value
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.nutritionalHighlights.map((n, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 bg-brand-50 text-brand-950 text-xs sm:text-sm font-bold rounded-xl border border-brand-100 flex items-center gap-2"
                    >
                      <Leaf className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Traditional Kolkata Recipe Idea */}
            {product.recipeIdea && (
              <div className="p-4 bg-amber-50/70 border border-amber-200/70 rounded-2xl text-xs sm:text-sm text-amber-950 flex items-start gap-3">
                <Utensils className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="font-black text-amber-950">Chef / Home Cook Idea:</strong> {product.recipeIdea}
                </div>
              </div>
            )}
          </div>

          {/* Action Row: Quantity Stepper & Add to Cart */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {quantity === 0 ? (
              <button
                onClick={() => addItem(product, currentOption.weight, currentOption.price)}
                className="w-full sm:flex-1 py-3.5 sm:py-5 min-h-[48px] bg-accent-400 hover:bg-accent-300 text-brand-950 font-black text-sm sm:text-base lg:text-lg rounded-2xl shadow-lg shadow-accent-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] text-center"
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-brand-900" />
                <span>ADD TO MORNING BASKET (₹{currentOption.price})</span>
              </button>
            ) : (
              <div className="w-full sm:flex-1 flex items-center justify-between p-2.5 min-h-[48px] bg-brand-600 text-white rounded-2xl shadow-md">
                <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3">
                  <span className="text-xs sm:text-sm font-bold text-brand-100">In Basket:</span>
                  <span className="font-black text-sm sm:text-base text-white">{currentOption.weight}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1, currentOption.weight)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-700 hover:bg-brand-800 flex items-center justify-center text-white transition-colors active:scale-95"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-black text-base sm:text-lg px-2 min-w-[24px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1, currentOption.weight)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-700 hover:bg-brand-800 flex items-center justify-center text-white transition-colors active:scale-95"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <Link
              href="/cart"
              className="w-full sm:w-auto px-6 py-3.5 sm:py-5 min-h-[48px] bg-brand-50 hover:bg-brand-100 text-brand-900 font-black text-sm sm:text-base rounded-2xl border border-brand-200 transition-colors text-center flex items-center justify-center shrink-0"
            >
              Go to Cart
            </Link>
          </div>

        </div>

      </div>

      {/* Related / Frequently Bought Together Products */}
      {related.length > 0 && (
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
                Frequently Paired Mandi Picks
              </h3>
              <p className="text-sm font-medium text-gray-500 mt-1">
                Popular morning combinations ordered together by Kolkata cooks
              </p>
            </div>
            <Link
              href="/shop"
              className="text-sm sm:text-base font-black text-brand-700 hover:text-brand-900"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
