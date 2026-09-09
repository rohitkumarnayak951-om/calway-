'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MapPin, 
  Search, 
  ShoppingBag, 
  User, 
  ChevronDown, 
  Clock, 
  Sparkles, 
  X,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { SearchModal } from './SearchModal';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { totalItemsCount, subtotal } = useCart();
  const { selectedLocation, openModal: openLocationModal, deliveryPromiseText, orderCutoffText } = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPhone, setAuthPhone] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authPhone.length >= 10) {
      setAuthSuccess(true);
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setAuthSuccess(false);
      }, 1500);
    }
  };

  return (
    <>
      {/* Top Banner: Dawn Mandi Delivery Promise */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white text-xs sm:text-sm py-2 px-4 sm:px-6 lg:px-8 shadow-xs border-b border-brand-700/50 overflow-hidden w-full max-w-full">
        <div className="w-full flex items-center justify-between gap-3 overflow-hidden">
          <div className="flex items-center gap-2 font-medium tracking-wide truncate">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-400"></span>
            </span>
            <Clock className="w-4 h-4 text-accent-400 shrink-0" />
            <span className="hidden sm:inline font-black text-accent-300 shrink-0">Kolkata Dawn Mandi Run:</span>
            <span className="truncate font-semibold">{deliveryPromiseText}</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 text-brand-200 text-xs shrink-0">
            <span className="flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" /> 100% Zero Cold Storage
            </span>
            <span className="text-brand-500">•</span>
            <span className="font-semibold">{orderCutoffText}</span>
            <span className="text-brand-500">•</span>
            <Link href="/subscriptions" className="text-accent-300 hover:text-white font-bold underline underline-offset-2">
              Subscribe & Save 18%
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all w-full max-w-full">
        <div className="w-full px-3 sm:px-6 lg:px-8 max-w-full">
          {/* Top Row: Brand, Locality, and Actions */}
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 gap-2 sm:gap-4">
            
            {/* Left: Logo + Locality Selector */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
              <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                  <span className="text-lg sm:text-2xl">🥬</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-2xl font-black tracking-tight text-brand-900 leading-none">
                    CAL<span className="text-brand-600">WAY</span>
                  </span>
                  <span className="text-[9px] sm:text-xs font-black uppercase tracking-wider text-emerald-800 mt-0.5">
                    Mandi-Fresh • Kolkata
                  </span>
                </div>
              </Link>

              {/* Location Selector (Always Accessible) */}
              <button
                onClick={openLocationModal}
                className="flex items-center gap-1.5 text-left px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-brand-50 hover:bg-brand-100 border border-brand-200/70 transition-all max-w-[125px] sm:max-w-[170px] lg:max-w-[210px] truncate"
                title="Change Kolkata delivery locality"
              >
                <div className="p-1 rounded-lg bg-brand-600 text-white shrink-0">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-[8px] sm:text-[10px] font-bold text-emerald-900 uppercase leading-none">Delivering to</div>
                  <div className="text-xs sm:text-sm font-extrabold text-gray-900 truncate leading-tight mt-0.5 flex items-center gap-0.5">
                    <span className="truncate">{selectedLocation.name.split('(')[0].trim()}</span>
                    <ChevronDown className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                  </div>
                </div>
              </button>
            </div>

            {/* Desktop-Only Centered Search Bar (≥md) */}
            <div className="hidden md:flex flex-1 min-w-0 max-w-xl mx-2 lg:mx-4">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="w-full h-11 lg:h-12 pl-3.5 pr-2.5 bg-gray-50 hover:bg-gray-100/90 border border-gray-200 focus:border-brand-500 rounded-2xl flex items-center justify-between text-left transition-all shadow-inner group"
              >
                <div className="flex items-center gap-2.5 text-gray-400 group-hover:text-gray-600 truncate min-w-0">
                  <Search className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="text-xs sm:text-sm truncate text-gray-500 font-medium">
                    Search for <span className="font-bold text-gray-800">&ldquo;tomatoes, spinach, shukto...&rdquo;</span>
                  </span>
                </div>
                <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-md shadow-2xs shrink-0 ml-2">
                  /
                </kbd>
              </button>
            </div>

            {/* Right Nav Actions: Sign In + Cart (Always In View on Both Mobile & Desktop) */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* User / Login Trigger */}
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-brand-800 hover:bg-brand-50 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-brand-200 transition-all shrink-0"
              >
                <User className="w-4 h-4 text-brand-600" />
                <span className="hidden sm:inline">Sign In</span>
              </button>

              {/* Cart Button (Blinkit style with item count + total) */}
              <Link
                href="/cart"
                className="relative flex items-center gap-1.5 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-accent-300" />
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 sm:-top-2 sm:-right-2 bg-accent-400 text-brand-950 font-black text-[9px] sm:text-[10px] w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center shadow-sm animate-bounce-short">
                      {totalItemsCount}
                    </span>
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="hidden sm:block text-[10px] font-semibold text-brand-100 uppercase tracking-wider leading-none">
                    {totalItemsCount === 0 ? 'My Cart' : `${totalItemsCount} items`}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-white leading-tight">
                    {totalItemsCount === 0 ? 'Cart' : `₹${subtotal}`}
                  </span>
                </div>
              </Link>
            </div>

          </div>

          {/* Mobile-Only Second Row: Full-Width Search Bar (<md) */}
          <div className="md:hidden pb-2.5 pt-0.5">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-full h-10 px-3 bg-gray-50 hover:bg-gray-100/90 border border-gray-200 focus:border-brand-500 rounded-xl flex items-center justify-between text-left transition-all shadow-inner group"
            >
              <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-600 truncate min-w-0">
                <Search className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="text-xs truncate text-gray-500 font-medium">
                  Search <span className="font-bold text-gray-800">&ldquo;tomatoes, spinach, shukto...&rdquo;</span>
                </span>
              </div>
              <span className="text-[10px] font-black uppercase text-brand-800 bg-brand-100 px-2 py-0.5 rounded-md shrink-0">
                Search
              </span>
            </button>
          </div>
        </div>

        {/* Blinkit-Style Quick Sub-Navigation Strip (Zero Clutter, 100% Reachable) */}
        <div className="border-t border-gray-100 bg-gray-50/90 px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2 overflow-x-auto no-scrollbar w-full max-w-full">
          <div className="w-full flex items-center justify-between gap-3 text-xs font-bold text-gray-700 whitespace-nowrap">
            <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar">
              <Link
                href="/shop"
                className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs transition-colors ${
                  pathname === '/shop' ? 'bg-brand-600 text-white font-black' : 'hover:bg-brand-100 hover:text-brand-900 bg-white border border-gray-200/80 shadow-2xs'
                }`}
              >
                🥬 All Mandi Veggies
              </Link>
              <Link
                href="/subscriptions"
                className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs transition-colors ${
                  pathname === '/subscriptions' ? 'bg-brand-600 text-white font-black' : 'hover:bg-brand-100 hover:text-brand-900 bg-white border border-gray-200/80 shadow-2xs'
                }`}
              >
                📦 Subscriptions
              </Link>
              <Link
                href="/about"
                className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs transition-colors ${
                  pathname === '/about' ? 'bg-brand-600 text-white font-black' : 'hover:bg-brand-100 hover:text-brand-900 bg-white border border-gray-200/80 shadow-2xs'
                }`}
              >
                🌅 Dawn Story
              </Link>
              <Link
                href="/contact"
                className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs transition-colors ${
                  pathname === '/contact' ? 'bg-brand-600 text-white font-black' : 'hover:bg-brand-100 hover:text-brand-900 bg-white border border-gray-200/80 shadow-2xs'
                }`}
              >
                📞 WhatsApp Help
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-3 text-emerald-800 text-[11px] font-semibold shrink-0">
              <span>🌱 100% Zero Cold Storage</span>
              <span>•</span>
              <span>🚚 Dawn Delivery by 7:00 AM</span>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mock Authentication Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-brand-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mt-2">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto mb-3 text-3xl">
                🥬
              </div>
              <h3 className="text-2xl font-black text-brand-950">Welcome to CALWAY</h3>
              <p className="text-sm text-gray-500 mt-1">
                Enter your mobile number to track dawn orders and manage morning deliveries
              </p>
            </div>

            {authSuccess ? (
              <div className="my-8 text-center py-5 bg-brand-50 rounded-2xl border border-brand-200 animate-in zoom-in-95">
                <CheckCircle2 className="w-12 h-12 text-brand-600 mx-auto mb-2" />
                <h4 className="font-bold text-brand-900 text-base">Welcome back to CALWAY!</h4>
                <p className="text-sm text-brand-700 mt-0.5">Signed in as +91 {authPhone}</p>
              </div>
            ) : (
              <form onSubmit={handleMockLogin} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-sm font-bold text-gray-500 border-r border-gray-200 pr-2">
                      +91
                    </span>
                    <input
                      type="tel"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                      placeholder="98300 12345"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-16 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-base font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authPhone.length < 10}
                  className="w-full py-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-black text-base rounded-2xl shadow-md shadow-brand-600/30 transition-all hover:scale-[1.01]"
                >
                  Send OTP & Continue
                </button>

                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  By continuing, you agree to Calway&apos;s Terms of Morning Delivery and Freshness Promise.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
