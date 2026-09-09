'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { subscriptionPlans } from '@/services/productService';

export const SubscriptionTeaser: React.FC = () => {
  const [isQuarterly, setIsQuarterly] = useState(false);

  return (
    <section className="py-14 bg-gradient-to-br from-brand-900 via-brand-950 to-emerald-950 text-white relative overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto relative z-10">
        
        {/* Header with Monthly / Quarterly Toggle */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-accent-300 bg-white/10 px-4 py-1.5 rounded-xl border border-white/15">
            📦 CALWAY Morning Baskets
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mt-3.5">
            Subscribe for Dawn Delivery & Save up to 18%
          </h2>
          <p className="text-base sm:text-lg text-brand-200 mt-3 max-w-2xl mx-auto leading-relaxed">
            Never worry about morning market runs again. Customize your basket, pause anytime on WhatsApp, and enjoy guaranteed 6:45 AM doorstep delivery.
          </p>

          {/* Billing Switch */}
          <div className="mt-7 inline-flex items-center p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <button
              onClick={() => setIsQuarterly(false)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                !isQuarterly ? 'bg-white text-brand-950 shadow-md' : 'text-brand-200 hover:text-white'
              }`}
            >
              Monthly Plan
            </button>
            <button
              onClick={() => setIsQuarterly(true)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                isQuarterly ? 'bg-accent-400 text-brand-950 shadow-md' : 'text-brand-200 hover:text-white'
              }`}
            >
              <span>Quarterly (3 Months)</span>
              <span className="px-2 py-0.5 text-xs font-black bg-brand-900 text-accent-300 rounded-md">
                SAVE MORE
              </span>
            </button>
          </div>
        </div>

        {/* 3 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan) => {
            const price = isQuarterly ? plan.quarterlyPrice : plan.monthlyPrice;
            const perDelivery = Math.round(price / (plan.deliveriesPerMonth * (isQuarterly ? 3 : 1)));

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.badge
                    ? 'bg-white/15 backdrop-blur-md border-2 border-accent-400 shadow-2xl scale-[1.02]'
                    : 'bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/15'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-400 text-brand-950 text-xs font-black uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{plan.name}</h3>
                  <p className="text-sm text-brand-200 mt-1 min-h-[38px] leading-relaxed">{plan.tagline}</p>

                  <div className="my-6 pb-6 border-b border-white/15">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-white">₹{price}</span>
                      <span className="text-sm text-brand-300 font-medium">
                        / {isQuarterly ? '3 months' : 'month'}
                      </span>
                    </div>
                    <div className="text-sm text-accent-300 font-bold mt-1.5 flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>₹{perDelivery} per dawn delivery • {plan.frequency}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 text-sm text-brand-100">
                    {plan.features.slice(0, 4).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href={`/subscriptions?plan=${plan.id}`}
                    className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
                      plan.badge
                        ? 'bg-accent-400 hover:bg-accent-300 text-brand-950 shadow-lg hover:scale-105'
                        : 'bg-white hover:bg-brand-50 text-brand-950'
                    }`}
                  >
                    <span>Start Morning Subscription</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-xs text-center text-brand-300 mt-2.5">
                    Pause, skip, or cancel anytime with 1 click
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
