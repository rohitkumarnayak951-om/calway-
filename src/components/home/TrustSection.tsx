import React from 'react';
import { ShieldCheck, HeartHandshake, PackageCheck, RefreshCw } from 'lucide-react';

const trustCards = [
  {
    icon: HeartHandshake,
    title: 'Direct From Kolkata Mandis',
    desc: 'Zero wholesale middlemen. We partner directly with historic aratdars (wholesalers) & Hooghly/Nadia farmers at Sealdah Koley & Mechua.',
    badge: '3:30 AM Wholesale',
    color: 'from-emerald-500/10 to-emerald-500/5 text-emerald-700 border-emerald-200',
  },
  {
    icon: RefreshCw,
    title: 'Zero Cold Storage Markup',
    desc: 'Conventional retail chills vegetables for 72+ hours losing vitamins and flavor. Our produce touches zero cold warehouses before your kitchen.',
    badge: 'Harvested in <6h',
    color: 'from-amber-500/10 to-amber-500/5 text-amber-700 border-amber-200',
  },
  {
    icon: PackageCheck,
    title: '100% Compostable Packaging',
    desc: 'Delivered in food-safe kraft paper and cornstarch bags that decompose naturally. Zero single-use plastic crates or polythene wrappers.',
    badge: 'Eco-Friendly Kolkata',
    color: 'from-blue-500/10 to-blue-500/5 text-blue-700 border-blue-200',
  },
  {
    icon: ShieldCheck,
    title: '100% Quality Replacement',
    desc: 'Found a wilted leaf or imperfect potato? Tap 1 button on WhatsApp or app for an instant no-questions-asked refund or next-morning replacement.',
    badge: 'No-Risk Guarantee',
    color: 'from-green-500/10 to-green-500/5 text-green-700 border-green-200',
  },
];

export const TrustSection: React.FC = () => {
  return (
    <section className="py-8 sm:py-14 bg-gray-50/70 border-y border-gray-100 overflow-hidden w-full max-w-full">
      <div className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-brand-700 bg-brand-100 px-3.5 py-1.5 rounded-xl">
            🛡️ The Calway Standard
          </span>
          <h2 className="text-xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mt-2.5 sm:mt-3">
            Why Kolkata households trust our morning dawn drops
          </h2>
          <p className="text-xs sm:text-base lg:text-lg text-gray-600 mt-2 max-w-2xl mx-auto leading-relaxed">
            We operate on a simple philosophy: if we wouldn&apos;t cook it in our own family kitchen this morning, we won&apos;t deliver it to yours.
          </p>
        </div>

        {/* Cards Grid: Swipeable horizontal carousel on mobile, 4-col grid on desktop */}
        <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3.5 pb-2 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 w-full max-w-full">
          {trustCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="w-[82vw] max-w-[300px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink bg-white rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-3.5 sm:mb-4 p-2.5 sm:p-3">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-extrabold text-base sm:text-xl text-gray-900 mb-1.5 sm:mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-base text-gray-600 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                
                <div className="mt-4 sm:mt-5 pt-3 border-t border-gray-100">
                  <span className={`inline-block text-[11px] sm:text-sm font-bold px-2.5 sm:px-3 py-1 rounded-lg border bg-gradient-to-br ${card.color}`}>
                    {card.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
