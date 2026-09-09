'use client';

import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Deblina Mukherjee',
    area: 'Salt Lake, Sector 2',
    text: 'My father used to wake up at 5 AM to cycle to Koley Market for fresh Shaak. Now Calway delivers the exact same dewy, unchilled Palak and Lal Shaak right outside our flat by 6:45 AM. The difference in taste of Macher Jhol is unbelievable!',
    rating: 5,
    tag: 'Daily Basket Subscriber',
    dish: 'Lal Shaak Bhaja & Macher Jhol',
  },
  {
    id: 2,
    name: 'Anirban Sengupta',
    area: 'Ballygunge Circular Road',
    text: 'Zero plastic packaging is what initially won me over. But the quality of their Chandramukhi potatoes and Kacha Lanka is unmatched. They snap clean with that fresh earthen fragrance. Never ordering from supermarket apps again.',
    rating: 5,
    tag: 'Alternate Day Plan',
    dish: 'Aloo Posto Lover',
  },
  {
    id: 3,
    name: 'Sneha & Rajat Roy',
    area: 'New Town, Action Area 1',
    text: 'Both of us work long corporate hours and never had time for traditional morning bazar. Calway\'s Shukto Veggie Kit was a game-changer for our weekend family lunch — everything was perfectly portioned, fresh and tender.',
    rating: 5,
    tag: 'Weekend Haul Member',
    dish: 'Shukto & Sambar Kits',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-14 bg-white">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-brand-700 bg-brand-100 px-3.5 py-1.5 rounded-xl">
            💬 Kolkata Kitchen Stories
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mt-3">
            Loved by over 4,500 Kolkata home cooks
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
            Real feedback from households in Salt Lake, New Town, Ballygunge, and South Kolkata.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-brand-50/40 rounded-3xl p-6 sm:p-8 border border-brand-100 flex flex-col justify-between relative hover:shadow-soft transition-all duration-200"
            >
              <div>
                {/* Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-brand-200" />
                </div>

                <p className="text-sm sm:text-base text-gray-700 leading-relaxed italic">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-100/80 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-base text-gray-900 flex items-center gap-1.5">
                    {item.name}
                    <CheckCircle2 className="w-4 h-4 text-brand-600 fill-brand-100" />
                  </h4>
                  <p className="text-sm text-brand-800 font-medium">{item.area}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-white text-brand-900 border border-brand-200 rounded-lg shadow-2xs">
                  {item.dish}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
