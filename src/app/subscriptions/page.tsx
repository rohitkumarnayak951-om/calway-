'use client';

import React, { useState } from 'react';
import { subscriptionPlans } from '@/services/productService';
import { 
  Check, 
  Sparkles, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  ArrowRight
} from 'lucide-react';

const faqs = [
  {
    q: 'How does the morning subscription delivery work in Kolkata?',
    a: 'Every delivery morning, our team visits Sealdah Koley & Mechua mandis at 3:30 AM to hand-pick fresh vegetables according to your plan preferences. By 6:00 AM – 7:15 AM, your dewy basket is placed right outside your flat door in a breathable compostable kraft bag, so you wake up to fresh produce.',
  },
  {
    q: 'Can I customize what goes into my weekly or daily basket?',
    a: 'Yes! After subscribing, you can set your dietary exclusions (e.g., exclude bitter gourd, extra coriander, only Chandramukhi potatoes) via our app or WhatsApp concierge. We automatically swap items you don\'t like with seasonal favorites of equal value.',
  },
  {
    q: 'What if I am traveling or on vacation?',
    a: 'You can pause your subscription anytime with 1 tap on WhatsApp or app up to 10:00 PM the night before. Your unused delivery credits are banked and rolled forward to your next cycle. Zero penalty.',
  },
  {
    q: 'What if an item does not meet my quality standards?',
    a: 'We offer a 100% No-Questions-Asked Freshness Guarantee. If any vegetable isn\'t crisp or fresh, simply snap a quick photo on WhatsApp. We\'ll either credit your wallet immediately or deliver a free replacement in the next morning\'s run.',
  },
  {
    q: 'Which areas in Kolkata are covered for dawn subscription runs?',
    a: 'We currently run daily dawn electric delivery routes in Salt Lake (all sectors), New Town (Action Area I, II, III), Ballygunge, Gariahat, Alipore, Jadavpur, Behala, Dum Dum, and Howrah Shibpur.',
  },
];

export default function SubscriptionsPage() {
  const [isQuarterly, setIsQuarterly] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<string | null>(null);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscriptionSuccess(true);
    setTimeout(() => {
      setSubscriptionSuccess(false);
      setSelectedPlanForModal(null);
    }, 2000);
  };

  return (
    <div className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto py-6 sm:py-14 space-y-10 sm:space-y-16 pb-28 sm:pb-16">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 bg-brand-100 text-brand-900 font-black text-[11px] sm:text-sm uppercase tracking-wider rounded-xl">
          <Calendar className="w-4 h-4 text-brand-700" />
          <span>Automate Your Morning Kitchen</span>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          Mandi-Fresh Morning Baskets, Delivered on Autopilot
        </h1>
        <p className="text-xs sm:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
          Skip crowded morning markets and limp supermarket cold-storage produce. Get farm-fresh seasonal vegetables hand-picked at 3:30 AM and placed at your door before 7:00 AM.
        </p>

        {/* Billing Switch */}
        <div className="pt-4 inline-flex items-center p-1.5 bg-gray-100 rounded-2xl border border-gray-200">
          <button
            onClick={() => setIsQuarterly(false)}
            className={`px-6 py-2.5 rounded-xl text-sm sm:text-base font-black transition-all ${
              !isQuarterly ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setIsQuarterly(true)}
            className={`px-6 py-2.5 rounded-xl text-sm sm:text-base font-black flex items-center gap-2 transition-all ${
              isQuarterly ? 'bg-brand-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>Quarterly (Save 18%)</span>
            <span className="px-2 py-0.5 text-xs font-black bg-accent-400 text-brand-950 rounded-md">
              BEST VALUE
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {subscriptionPlans.map((plan) => {
          const price = isQuarterly ? plan.quarterlyPrice : plan.monthlyPrice;
          const deliveries = plan.deliveriesPerMonth * (isQuarterly ? 3 : 1);
          const perDrop = Math.round(price / deliveries);

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl p-6 sm:p-9 flex flex-col justify-between border transition-all duration-300 relative shadow-sm hover:shadow-float ${
                plan.badge
                  ? 'border-2 border-brand-500 ring-4 ring-brand-500/10'
                  : 'border-gray-200 hover:border-brand-300'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-brand-600 text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-accent-400" />
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900">{plan.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1 min-h-[38px]">{plan.tagline}</p>

                {/* Price */}
                <div className="my-6 pb-6 border-b border-gray-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-gray-900">₹{price}</span>
                    <span className="text-sm sm:text-base font-bold text-gray-500">
                      / {isQuarterly ? '3 months' : 'month'}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-black text-emerald-800 mt-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>₹{perDrop} per morning basket • {plan.deliveriesPerMonth} drops/mo</span>
                  </div>
                </div>

                {/* Recommended For */}
                <div className="mb-5 p-3.5 bg-brand-50/70 rounded-2xl text-xs sm:text-sm text-brand-950 font-bold">
                  Ideal for: {plan.recommendedFor}
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 text-sm sm:text-base text-gray-700">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 font-black" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subscribe CTA */}
              <div className="mt-8 pt-5 border-t border-gray-100">
                <button
                  onClick={() => setSelectedPlanForModal(plan.name)}
                  className={`w-full py-4.5 sm:py-5 rounded-2xl font-black text-sm sm:text-base lg:text-lg flex items-center justify-center gap-2 transition-all ${
                    plan.badge
                      ? 'bg-accent-400 hover:bg-accent-500 text-brand-950 shadow-md hover:scale-[1.02]'
                      : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm'
                  }`}
                >
                  <span>Select {plan.name.split(' ')[0]} Basket</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-xs text-center text-gray-500 font-medium mt-2.5">
                  No lock-in period • Pause on WhatsApp anytime
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* What Comes in the Basket Section */}
      <div className="bg-white rounded-3xl p-4.5 sm:p-10 lg:p-12 border border-gray-100 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-brand-700 bg-brand-100 px-3.5 py-1.5 rounded-xl">
            🧺 Typical Basket Composition
          </span>
          <h2 className="text-xl sm:text-4xl font-black text-gray-900 mt-2.5 sm:mt-3">
            What will be inside your dawn basket?
          </h2>
          <p className="text-xs sm:text-base text-gray-600 mt-2 font-medium">
            Carefully balanced everyday nutrition, adapted to the morning harvest and seasonal Bengal arrivals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-4.5 sm:p-6 bg-brand-50/50 rounded-2xl border border-brand-100 space-y-2">
            <span className="text-2xl sm:text-3xl">🥬</span>
            <h4 className="font-black text-sm sm:text-lg text-gray-900">1. Fresh Shaak (Greens)</h4>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
              Rotated daily: Palak Shaak, Lal Shaak, Pui Shaak, Methi, or fresh Shorshe Shaak in winter.
            </p>
          </div>

          <div className="p-4.5 sm:p-6 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-2">
            <span className="text-2xl sm:text-3xl">🥔</span>
            <h4 className="font-black text-sm sm:text-lg text-gray-900">2. Kitchen Staples</h4>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
              Chandramukhi / Jyoti potatoes, Nashik pink onions, juicy desi tomatoes, and hill ginger.
            </p>
          </div>

          <div className="p-4.5 sm:p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
            <span className="text-2xl sm:text-3xl">🍆</span>
            <h4 className="font-black text-sm sm:text-lg text-gray-900">3. Daily Curry Veggies</h4>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
              Tender Potol (pointed gourd), Jhinge (ridge gourd), Muktakeshi Begun, Kanchakola, or Gourd.
            </p>
          </div>

          <div className="p-4.5 sm:p-6 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-2">
            <span className="text-2xl sm:text-3xl">🌶️</span>
            <h4 className="font-black text-sm sm:text-lg text-gray-900">4. Free Aromatic Pouch</h4>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
              Every drop includes free fresh Kacha Lanka (green chili), fragrant Dhone Pata, and lemon.
            </p>
          </div>
        </div>
      </div>

      {/* Subscription FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-base text-gray-600 mt-1.5 sm:mt-2 font-medium">
            Everything you need to know about subscribing to Calway in Kolkata
          </p>
        </div>

        <div className="divide-y divide-gray-100 bg-white rounded-3xl border border-gray-100 p-4.5 sm:p-9 shadow-sm">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-5 first:pt-0 last:pb-0">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-black text-base sm:text-lg lg:text-xl text-gray-900 hover:text-brand-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-brand-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="mt-3.5 text-sm sm:text-base text-gray-700 leading-relaxed font-normal animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscription Signup Modal */}
      {selectedPlanForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-brand-100 text-center">
            {subscriptionSuccess ? (
              <div className="py-6 space-y-3.5">
                <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 font-black" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">Subscription Registered!</h3>
                <p className="text-sm text-gray-600">
                  Our Kolkata dawn logistics concierge will reach out on WhatsApp to set up your first morning drop.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribeSubmit} className="space-y-4 text-left">
                <div className="text-center mb-5">
                  <span className="text-xs sm:text-sm font-black text-brand-700 uppercase tracking-wider">
                    Morning Subscription
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">
                    {selectedPlanForModal}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Guaranteed dawn doorstep delivery before 7:15 AM
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black text-gray-700 mb-1.5 uppercase tracking-wider">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Subir Ganguly"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black text-gray-700 mb-1.5 uppercase tracking-wider">WhatsApp Mobile Number</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="98300 12345"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black text-gray-700 mb-1.5 uppercase tracking-wider">Kolkata Delivery Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Salt Lake Sector 3 / Ballygunge"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPlanForModal(null)}
                    className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-black text-xs sm:text-sm rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md"
                  >
                    Confirm Subscription
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
