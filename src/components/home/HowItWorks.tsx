import React from 'react';
import { Sunrise, Sparkles, Truck, CookingPot } from 'lucide-react';

const steps = [
  {
    step: '01',
    time: '3:30 AM',
    title: 'Dawn Mandi Sourcing',
    desc: 'Our sourcing team arrives at Sealdah Koley & Mechua wholesale markets as regional farmer trucks pull in.',
    icon: Sunrise,
    badge: 'Kolkata Wholesale',
    bgColor: 'bg-amber-50 text-amber-900 border-amber-200',
    iconBg: 'bg-amber-500 text-white',
  },
  {
    step: '02',
    time: '4:45 AM',
    title: 'Hand-Sorting & Grading',
    desc: 'Every bunch of shaak and every potato is sorted by hand. Only Grade-A produce goes into breathable kraft bags.',
    icon: Sparkles,
    badge: 'Zero Cold Storage',
    bgColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    iconBg: 'bg-emerald-600 text-white',
  },
  {
    step: '03',
    time: '6:15 AM',
    title: 'Dawn Neighborhood Run',
    desc: 'Dispatched through dedicated electric routes across Salt Lake, New Town, and South Kolkata before street traffic.',
    icon: Truck,
    badge: 'Delivered by 7:00 AM',
    bgColor: 'bg-blue-50 text-blue-900 border-blue-200',
    iconBg: 'bg-blue-600 text-white',
  },
  {
    step: '04',
    time: '7:00 AM',
    title: 'Crisp Kitchen Prep',
    desc: 'Open your door to dewy-fresh vegetables waiting for your morning chai and everyday home cooking.',
    icon: CookingPot,
    badge: '100% Quality Replaced',
    bgColor: 'bg-lime-50 text-lime-900 border-lime-200',
    iconBg: 'bg-lime-600 text-white',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-7 sm:py-12 bg-white border-y border-gray-100 overflow-hidden w-full max-w-full">
      <div className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 bg-brand-100 text-brand-900 font-extrabold text-[11px] sm:text-sm uppercase tracking-wider rounded-xl mb-2 sm:mb-3">
            <span>🌅 The Mandi-To-Kitchen Journey</span>
          </div>
          <h2 className="text-xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            How Calway delivers fresher than your local market
          </h2>
          <p className="text-xs sm:text-lg text-gray-600 mt-2 sm:mt-3 max-w-2xl mx-auto leading-relaxed">
            Most supermarket vegetables spend 3–4 days in refrigerated storage. We cut out the storage completely — farm-to-mandi-to-door in under 6 hours.
          </p>
        </div>

        {/* 4-Step Process Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
              >
                {/* Step number watermark */}
                <div className="text-4xl font-black text-gray-100 absolute top-4 right-5 select-none">
                  {item.step}
                </div>

                <div>
                  {/* Icon & Time badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-13 h-13 rounded-2xl ${item.iconBg} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform p-3`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-black px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-mono">
                      {item.time}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="font-extrabold text-gray-900 text-lg sm:text-xl mb-2 group-hover:text-brand-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-gray-100">
                  <span className={`inline-block text-xs sm:text-sm font-bold px-3 py-1 rounded-lg border ${item.bgColor}`}>
                    {item.badge}
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
