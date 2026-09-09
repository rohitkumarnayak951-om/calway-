'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Leaf
} from 'lucide-react';
import { useLocation } from '@/context/LocationContext';

const promoSlides = [
  {
    id: 'slide-1',
    tag: 'Dawn Wholesale Direct',
    title: 'Picked at Dawn. At Your Door by Breakfast.',
    subtitle: 'Harvested from Bengal fields, brought to Koley & Mechua mandis at 3:30 AM, on your kitchen counter before 7:00 AM.',
    ctaText: 'Shop Today\'s Mandi Harvest',
    ctaLink: '/shop',
    accentBadge: 'Zero Cold Storage Guarantee',
    bgGradient: 'from-brand-900 via-brand-800 to-emerald-950',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    promoCode: 'MANDI20',
    promoNote: 'Flat 20% OFF your first morning basket',
  },
  {
    id: 'slide-2',
    tag: 'Daily Morning Subscription',
    title: 'Never Run Out of Fresh Shaak & Veggies',
    subtitle: 'Choose Daily or Alternate-Day morning drops. Customized basket, priority dawn selection, and free delivery forever.',
    ctaText: 'Explore Subscription Plans',
    ctaLink: '/subscriptions',
    accentBadge: 'Save 18% Every Month',
    bgGradient: 'from-emerald-950 via-teal-900 to-brand-900',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1000&q=80',
    promoCode: 'DAWN10',
    promoNote: 'Guaranteed 6:45 AM doorstep drop in Kolkata',
  },
  {
    id: 'slide-3',
    tag: 'Traditional Kolkata Kits',
    title: 'Authentic Shukto & Dal Veggie Kits',
    subtitle: 'Pre-portioned bitter gourd, sweet potatoes, raw plantain, and drumsticks in exact culinary proportions. Cook authentic Bengali meals in minutes.',
    ctaText: 'Order Cooking Kits',
    ctaLink: '/shop?cat=combos-kits',
    accentBadge: 'Chef Curated Ratios',
    bgGradient: 'from-emerald-900 via-brand-900 to-slate-900',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    promoCode: 'KOLKATA50',
    promoNote: 'Free fresh coriander & green chili with kit',
  },
];

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { selectedLocation } = useLocation();

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = promoSlides[currentSlide];

  return (
    <section className="relative overflow-hidden pt-3 pb-6 sm:py-6">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto">
        
        {/* Main Carousel Hero Card */}
        <div className={`relative rounded-3xl sm:rounded-3xl overflow-hidden bg-gradient-to-br ${slide.bgGradient} text-white shadow-xl transition-all duration-700`}>
          
          {/* Subtle patterned overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_60%)] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center p-4 sm:p-8 lg:p-14 xl:p-16">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-6">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 bg-accent-400 text-brand-950 font-black text-[11px] sm:text-sm uppercase tracking-wider rounded-xl shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {slide.tag}
                </span>

                <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 bg-white/10 backdrop-blur-md text-brand-100 font-bold text-[11px] sm:text-sm rounded-xl border border-white/15 flex items-center gap-1.5">
                  <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-300" />
                  {slide.accentBadge}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.15]">
                {slide.title}
              </h1>

              {/* Subheadline */}
              <p className="text-sm sm:text-base lg:text-xl text-brand-100/95 leading-relaxed max-w-2xl font-normal">
                {slide.subtitle}
              </p>

              {/* Promo code pill */}
              <div className="inline-flex flex-wrap items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 sm:p-2 pr-3 sm:pr-5 rounded-xl sm:rounded-2xl border border-white/20 text-xs sm:text-sm">
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-accent-400 text-brand-950 font-black rounded-lg sm:rounded-xl text-xs sm:text-sm">
                  {slide.promoCode}
                </span>
                <span className="text-brand-100 font-semibold text-xs sm:text-sm">
                  {slide.promoNote}
                </span>
              </div>

              {/* Action Buttons & Live Promise */}
              <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5">
                <Link
                  href={slide.ctaLink}
                  className="px-5 sm:px-7 py-3 sm:py-4 bg-accent-400 hover:bg-accent-300 text-brand-950 font-black text-xs sm:text-base rounded-xl sm:rounded-2xl shadow-lg shadow-accent-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 text-center"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>

                <Link
                  href="/subscriptions"
                  className="px-5 sm:px-6 py-2.5 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs sm:text-base rounded-xl sm:rounded-2xl border border-white/20 flex items-center justify-center transition-colors text-center"
                >
                  Subscribe & Save 18%
                </Link>
              </div>

              {/* Kolkata Delivery Notice */}
              <div className="pt-1 flex items-center gap-2 text-[11px] sm:text-sm text-brand-200">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-400 shrink-0" />
                <span>
                  Delivering to <strong>{selectedLocation.name}</strong> before <strong>7:00 AM tomorrow</strong>
                </span>
              </div>
            </div>

            {/* Right Supporting Image Showcase */}
            <div className="lg:col-span-5 relative mt-3 lg:mt-0">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white/10">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />

                {/* Floating Morning Timestamp Card */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-lg border border-brand-100 flex items-center justify-between text-gray-900 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-base sm:text-xl shrink-0">
                      ⏰
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] sm:text-xs font-black uppercase tracking-wider text-emerald-800">
                        Dawn Mandi Arrival
                      </div>
                      <div className="text-xs sm:text-sm font-black text-gray-900 truncate">
                        Sealdah Koley: 03:45 AM
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 sm:px-2.5 sm:py-1 bg-brand-100 text-brand-800 rounded-lg shrink-0">
                    100% FRESH
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Slide Navigation Controls */}
          <div className="absolute bottom-4 right-6 hidden sm:flex items-center gap-2 z-20">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5 px-2">
              {promoSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === idx ? 'w-6 bg-accent-400' : 'w-2 bg-white/30'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % promoSlides.length)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
