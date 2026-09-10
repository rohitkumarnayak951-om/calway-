'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PromoCard {
  id: string;
  ribbon: string;
  ribbonColor: string;
  headline: string;
  subheadline: string;
  tag: string;
  image: string;
  bgClass: string;
  borderClass: string;
  href: string;
}

const PROMO_CARDS: PromoCard[] = [
  {
    id: 'promo-1',
    ribbon: 'Featured',
    ribbonColor: 'bg-emerald-600 text-white',
    headline: 'FLAT ₹50 OFF',
    subheadline: 'On first 7 AM dawn order',
    tag: 'Code: DAWN50',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
    bgClass: 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40',
    borderClass: 'border-emerald-200/80',
    href: '/shop',
  },
  {
    id: 'promo-2',
    ribbon: 'Newly Launched',
    ribbonColor: 'bg-brand-700 text-white',
    headline: 'Koley Mandi Run',
    subheadline: 'Auctioned 3:30 AM, drop by 7 AM',
    tag: '100% Zero Storage',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
    bgClass: 'bg-gradient-to-br from-brand-50 via-white to-brand-50/40',
    borderClass: 'border-brand-200/80',
    href: '/shop?category=daily',
  },
  {
    id: 'promo-3',
    ribbon: 'Seasonal Pick',
    ribbonColor: 'bg-amber-600 text-white',
    headline: 'Bengali Shukto',
    subheadline: 'Potol, UCChe & Sheem basket',
    tag: 'Chef Curated',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80',
    bgClass: 'bg-gradient-to-br from-amber-50 via-white to-amber-50/40',
    borderClass: 'border-amber-200/80',
    href: '/shop?category=root',
  },
  {
    id: 'promo-4',
    ribbon: 'Chef Curated',
    ribbonColor: 'bg-teal-600 text-white',
    headline: 'Dew-Fresh Greens',
    subheadline: 'From Barasat local peri-urban farms',
    tag: 'Zero Cold Chain',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80',
    bgClass: 'bg-gradient-to-br from-teal-50 via-white to-teal-50/40',
    borderClass: 'border-teal-200/80',
    href: '/subscriptions',
  },
];

export const FeaturedPromoRow: React.FC = () => {
  return (
    <section className="w-full py-2.5 px-3 sm:px-6">
      {/* Horizontal Scroll of 1:1 Aspect Promo Cards */}
      <div className="flex items-stretch gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory">
        {PROMO_CARDS.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            className={`shrink-0 w-[150px] sm:w-[172px] aspect-[1/1.05] rounded-2xl p-2.5 border shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between relative overflow-hidden group snap-start ${card.bgClass} ${card.borderClass}`}
          >
            {/* Top Ribbon */}
            <div className="flex items-center justify-between z-10">
              <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-2xs ${card.ribbonColor}`}>
                {card.ribbon}
              </span>
            </div>

            {/* Produce Image: Center-Right Preview */}
            <div className="relative w-full h-[62px] sm:h-[72px] my-1 rounded-xl overflow-hidden shadow-2xs">
              <Image
                src={card.image}
                alt={card.headline}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="180px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between">
                <span className="text-[9px] font-extrabold text-white bg-black/50 backdrop-blur-xs px-1.5 py-0.2 rounded">
                  {card.tag}
                </span>
              </div>
            </div>

            {/* Headline & Subtitle */}
            <div className="z-10 mt-auto">
              <h3 className="text-xs sm:text-sm font-black text-gray-900 leading-tight group-hover:text-brand-700 transition-colors">
                {card.headline}
              </h3>
              <p className="text-[10px] text-gray-600 font-semibold leading-tight line-clamp-1 mt-0.5">
                {card.subheadline}
              </p>
            </div>
          </Link>
        ))}
        {/* Trailing peek padding */}
        <div className="shrink-0 w-2" />
      </div>
    </section>
  );
};
