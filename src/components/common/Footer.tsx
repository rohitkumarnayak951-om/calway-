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
  Heart
} from 'lucide-react';
import locationsData from '@/data/locations.json';
import { KolkataLocality } from '@/types';

const locations = locationsData as KolkataLocality[];

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-brand-950 text-white pt-16 pb-24 md:pb-12 border-t border-brand-900 mt-20">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto">
        
        {/* Mandi Trust Badges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pb-12 border-b border-brand-900/80">
          <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-brand-900/50 border border-brand-800/40">
            <div className="p-3 rounded-xl bg-accent-400 text-brand-950 font-bold text-xl shrink-0">
              🌅
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">Dawn Sourced at 3:30 AM</h4>
              <p className="text-xs sm:text-sm text-brand-300 mt-0.5">Straight from Sealdah & Mechua</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-brand-900/50 border border-brand-800/40">
            <div className="p-3 rounded-xl bg-accent-400 text-brand-950 font-bold text-xl shrink-0">
              ❄️
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">Zero Cold Storage</h4>
              <p className="text-xs sm:text-sm text-brand-300 mt-0.5">Field to kitchen in &lt;6 hours</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-brand-900/50 border border-brand-800/40">
            <div className="p-3 rounded-xl bg-accent-400 text-brand-950 font-bold text-xl shrink-0">
              ♻️
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">100% Compostable Bags</h4>
              <p className="text-xs sm:text-sm text-brand-300 mt-0.5">Zero single-use plastic waste</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-brand-900/50 border border-brand-800/40">
            <div className="p-3 rounded-xl bg-accent-400 text-brand-950 font-bold text-xl shrink-0">
              🛡️
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">Freshness Guarantee</h4>
              <p className="text-xs sm:text-sm text-brand-300 mt-0.5">Instant free replacement on tap</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-brand-900/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-2xl shadow-md">
                🥬
              </div>
              <span className="text-3xl font-black tracking-tight text-white">
                CAL<span className="text-brand-400">WAY</span>
              </span>
            </Link>
            
            <p className="text-sm sm:text-base text-brand-200 leading-relaxed max-w-sm">
              Kolkata&apos;s pioneering dawn mandi-to-door fresh vegetable service. We wake up at 3:30 AM, hand-pick the crispiest harvest from Koley & Mechua wholesale markets, and place it at your doorstep before your morning cup of chai.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 text-xs sm:text-sm text-brand-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-400 shrink-0" />
                <span>Morning Deliveries: <strong>6:00 AM – 8:30 AM Daily</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent-400 shrink-0" />
                <span>Helpline / WhatsApp: <strong>+91 98300 CALWAY (22592)</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-400 shrink-0" />
                <span>Support: <strong>care@calway.in</strong></span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-black text-accent-300 uppercase tracking-wider mb-4">
              Mandi Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-200">
              <li>
                <Link href="/shop?cat=leafy-greens" className="hover:text-white transition-colors">
                  Leafy Greens (Shaak)
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=daily-essentials" className="hover:text-white transition-colors">
                  Daily Essentials (Aloo, Pyaaj)
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=kolkata-specials" className="hover:text-white transition-colors">
                  Kolkata Specials (Jhinge, Potol)
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=root-vegetables" className="hover:text-white transition-colors">
                  Root Vegetables
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=exotics-salads" className="hover:text-white transition-colors">
                  Exotic & Salad Greens
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=combos-kits" className="hover:text-white transition-colors">
                  Shukto & Sambar Kits
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-sm font-black text-accent-300 uppercase tracking-wider mb-4">
              Company & Plans
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-200">
              <li>
                <Link href="/subscriptions" className="hover:text-white transition-colors">
                  Daily & Weekly Subscriptions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Calway & Founders
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & WhatsApp Support
                </Link>
              </li>
              <li>
                <Link href="/about#mandi-process" className="hover:text-white transition-colors">
                  How Dawn Sourcing Works
                </Link>
              </li>
              <li>
                <Link href="/about#sustainability" className="hover:text-white transition-colors">
                  Zero Plastic Commitment
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  View Cart & Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-sm font-black text-accent-300 uppercase tracking-wider mb-4">
              Mandi Morning Bulletin
            </h4>
            <p className="text-sm text-brand-200 leading-relaxed mb-4">
              Get notified when seasonal delicacies (winter peas, fresh methi, kacha holud) arrive at the mandi.
            </p>

            {subscribed ? (
              <div className="p-3.5 bg-brand-900 border border-brand-700 rounded-xl text-sm text-brand-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent-400 shrink-0" />
                <span>Thank you! You&apos;re subscribed to our dawn mandi alert.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-brand-900 border border-brand-800 rounded-xl text-sm text-white placeholder-brand-400 focus:outline-none focus:ring-1 focus:ring-accent-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-2 bg-accent-400 hover:bg-accent-500 text-brand-950 rounded-lg transition-colors"
                    aria-label="Subscribe"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-brand-400 block">No spam. Only fresh morning rates & seasonal arrivals.</span>
              </form>
            )}
          </div>
        </div>

        {/* Kolkata Service Areas Hubs Bar */}
        <div className="py-8 border-b border-brand-900/80">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-accent-400" />
            <h5 className="text-sm font-bold text-white uppercase tracking-wider">
              Kolkata Dawn Delivery Hubs & Service Areas
            </h5>
          </div>
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-brand-300">
            {locations.map((loc, idx) => (
              <span key={loc.id} className="inline-flex items-center gap-1.5 bg-brand-900/60 px-3 py-1.5 rounded-lg border border-brand-800/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{loc.name}</span>
                <span className="text-brand-400 font-mono text-xs">({loc.pincode})</span>
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
