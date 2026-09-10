'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Send,
  Heart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import locationsData from '@/data/locations.json';
import { KolkataLocality } from '@/types';

const locations = locationsData as KolkataLocality[];

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (sec: string) => {
    setOpenSection(openSection === sec ? null : sec);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-brand-950 text-white pt-10 sm:pt-16 pb-24 md:pb-12 border-t border-brand-900 mt-12 sm:mt-20 overflow-hidden w-full max-w-full">
      <div className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto">
        
        {/* Mandi Trust Badges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6 pb-8 sm:pb-12 border-b border-brand-900/80">
          <div className="flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-brand-900/50 border border-brand-800/40">
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-accent-400 text-brand-950 font-bold text-base sm:text-xl shrink-0">
              🌅
            </div>
            <div>
              <h4 className="text-xs sm:text-base font-bold text-white leading-tight">Dawn Sourced 3:30 AM</h4>
              <p className="text-[10px] sm:text-sm text-brand-300 mt-0.5">Sealdah & Mechua</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-brand-900/50 border border-brand-800/40">
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-accent-400 text-brand-950 font-bold text-base sm:text-xl shrink-0">
              ❄️
            </div>
            <div>
              <h4 className="text-xs sm:text-base font-bold text-white leading-tight">Zero Cold Storage</h4>
              <p className="text-[10px] sm:text-sm text-brand-300 mt-0.5">Harvest in &lt;6 hours</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-brand-900/50 border border-brand-800/40">
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-accent-400 text-brand-950 font-bold text-base sm:text-xl shrink-0">
              ♻️
            </div>
            <div>
              <h4 className="text-xs sm:text-base font-bold text-white leading-tight">Compostable Bags</h4>
              <p className="text-[10px] sm:text-sm text-brand-300 mt-0.5">Zero single-use plastic</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-brand-900/50 border border-brand-800/40">
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-accent-400 text-brand-950 font-bold text-base sm:text-xl shrink-0">
              🛡️
            </div>
            <div>
              <h4 className="text-xs sm:text-base font-bold text-white leading-tight">Fresh Guarantee</h4>
              <p className="text-[10px] sm:text-sm text-brand-300 mt-0.5">Instant free replacement</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links - Accordion on mobile (<md), 5-col grid on desktop (>=md) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-10 py-8 sm:py-12 border-b border-brand-900/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-500 flex items-center justify-center text-xl sm:text-2xl shadow-md">
                🥬
              </div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                CAL<span className="text-brand-400">WAY</span>
              </span>
            </Link>
            
            <p className="text-xs sm:text-base text-brand-200 leading-relaxed max-w-sm">
              Kolkata&apos;s pioneering dawn mandi-to-door fresh vegetable service. We wake up at 3:30 AM, hand-pick the crispiest harvest from Koley & Mechua wholesale markets, and place it at your doorstep before your morning cup of chai.
            </p>

            <div className="mt-4 sm:mt-6 flex flex-col gap-2 text-xs sm:text-sm text-brand-300">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-400 shrink-0" />
                <span>Morning Deliveries: <strong>6:00 AM – 8:30 AM Daily</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-400 shrink-0" />
                <span>Helpline / WhatsApp: <strong>+91 98300 CALWAY (22592)</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-400 shrink-0" />
                <span>Support: <strong>care@calway.in</strong></span>
              </div>
            </div>
          </div>

          {/* Mandi Categories Accordion */}
          <div className="border-t border-brand-900/80 pt-3 md:border-none md:pt-0">
            <button
              onClick={() => toggleSection('categories')}
              className="w-full flex items-center justify-between py-1 md:py-0 text-left focus:outline-none"
            >
              <h4 className="text-xs sm:text-sm font-black text-accent-300 uppercase tracking-wider md:mb-4">
                Mandi Categories
              </h4>
              <span className="md:hidden text-brand-400 p-1">
                {openSection === 'categories' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>
            <div className={`${openSection === 'categories' ? 'block' : 'hidden'} md:block pt-3 md:pt-0`}>
              <ul className="space-y-2 text-xs sm:text-sm text-brand-200">
                <li>
                  <Link href="/shop?cat=leafy-greens" className="hover:text-white transition-colors block py-0.5">
                    Leafy Greens (Shaak)
                  </Link>
                </li>
                <li>
                  <Link href="/shop?cat=daily-essentials" className="hover:text-white transition-colors block py-0.5">
                    Daily Essentials (Aloo, Pyaaj)
                  </Link>
                </li>
                <li>
                  <Link href="/shop?cat=kolkata-specials" className="hover:text-white transition-colors block py-0.5">
                    Kolkata Specials (Jhinge, Potol)
                  </Link>
                </li>
                <li>
                  <Link href="/shop?cat=root-vegetables" className="hover:text-white transition-colors block py-0.5">
                    Root Vegetables
                  </Link>
                </li>
                <li>
                  <Link href="/shop?cat=exotics-salads" className="hover:text-white transition-colors block py-0.5">
                    Exotic & Salad Greens
                  </Link>
                </li>
                <li>
                  <Link href="/shop?cat=combos-kits" className="hover:text-white transition-colors block py-0.5">
                    Shukto & Sambar Kits
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Company & Support Accordion */}
          <div className="border-t border-brand-900/80 pt-3 md:border-none md:pt-0">
            <button
              onClick={() => toggleSection('company')}
              className="w-full flex items-center justify-between py-1 md:py-0 text-left focus:outline-none"
            >
              <h4 className="text-xs sm:text-sm font-black text-accent-300 uppercase tracking-wider md:mb-4">
                Company & Plans
              </h4>
              <span className="md:hidden text-brand-400 p-1">
                {openSection === 'company' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>
            <div className={`${openSection === 'company' ? 'block' : 'hidden'} md:block pt-3 md:pt-0`}>
              <ul className="space-y-2 text-xs sm:text-sm text-brand-200">
                <li>
                  <Link href="/subscriptions" className="hover:text-white transition-colors block py-0.5">
                    Daily & Weekly Subscriptions
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors block py-0.5">
                    About Calway & Founders
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors block py-0.5">
                    Contact & WhatsApp Support
                  </Link>
                </li>
                <li>
                  <Link href="/about#mandi-process" className="hover:text-white transition-colors block py-0.5">
                    How Dawn Sourcing Works
                  </Link>
                </li>
                <li>
                  <Link href="/about#sustainability" className="hover:text-white transition-colors block py-0.5">
                    Zero Plastic Commitment
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-white transition-colors block py-0.5">
                    View Cart & Checkout
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Signup Accordion */}
          <div className="border-t border-brand-900/80 pt-3 md:border-none md:pt-0">
            <button
              onClick={() => toggleSection('bulletin')}
              className="w-full flex items-center justify-between py-1 md:py-0 text-left focus:outline-none"
            >
              <h4 className="text-xs sm:text-sm font-black text-accent-300 uppercase tracking-wider md:mb-4">
                Mandi Morning Bulletin
              </h4>
              <span className="md:hidden text-brand-400 p-1">
                {openSection === 'bulletin' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>
            <div className={`${openSection === 'bulletin' ? 'block' : 'hidden'} md:block pt-3 md:pt-0`}>
              <p className="text-xs sm:text-sm text-brand-200 leading-relaxed mb-3 sm:mb-4">
                Get notified when seasonal delicacies (winter peas, fresh methi, kacha holud) arrive at the mandi.
              </p>

              {subscribed ? (
                <div className="p-3 sm:p-3.5 bg-brand-900 border border-brand-700 rounded-xl text-xs sm:text-sm text-brand-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent-400 shrink-0" />
                  <span>Thank you! You&apos;re subscribed to our dawn alert.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-brand-900 border border-brand-800 rounded-xl text-xs sm:text-sm text-white placeholder-brand-400 focus:outline-none focus:ring-1 focus:ring-accent-400"
                    />
                    <button
                      type="submit"
                      className="absolute right-1 top-1 sm:right-1.5 sm:top-1.5 p-1.5 sm:p-2 bg-accent-400 hover:bg-accent-500 text-brand-950 rounded-lg transition-colors"
                      aria-label="Subscribe"
                    >
                      <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  <span className="text-[10px] sm:text-xs text-brand-400 block">No spam. Only fresh morning rates & seasonal arrivals.</span>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Kolkata Service Areas Hubs Accordion */}
        <div className="py-5 sm:py-8 border-b border-brand-900/80">
          <button
            onClick={() => toggleSection('hubs')}
            className="w-full flex items-center justify-between text-left focus:outline-none mb-2 sm:mb-3"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent-400" />
              <h5 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Kolkata Dawn Delivery Hubs ({locations.length} Areas)
              </h5>
            </div>
            <span className="md:hidden text-brand-400 p-1">
              {openSection === 'hubs' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </button>
          
          <div className={`${openSection === 'hubs' ? 'flex' : 'hidden'} md:flex flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-brand-300 pt-1`}>
            {locations.map((loc, idx) => (
              <span key={loc.id} className="inline-flex items-center gap-1.5 bg-brand-900/60 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-brand-800/60">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400"></span>
                <span>{loc.name}</span>
                <span className="text-brand-400 font-mono text-[10px] sm:text-xs">({loc.pincode})</span>
                {idx < locations.length - 1 && <span className="text-brand-700 ml-1">•</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-brand-400">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} CALWAY Technologies Pvt. Ltd. Proudly rooted in Kolkata</span>
            <Heart className="w-4 h-4 text-red-500 inline fill-red-500" />
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Mandi Partners: Koley • Mechua • Posta</span>
            <span>•</span>
            <span>Delivery: 6:00 – 8:30 AM</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
