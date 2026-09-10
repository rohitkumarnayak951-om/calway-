'use client';

import React, { useState, useEffect } from 'react';
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
  Mic, 
  LogOut, 
  Package 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import { SearchModal } from './SearchModal';
import { AuthModal } from './AuthModal';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { totalItemsCount, subtotal } = useCart();
  const { selectedLocation, openModal: openLocationModal, deliveryPromiseText, orderCutoffText } = useLocation();
  const { user, customer, openAuthModal, signOut } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const placeholders = [
    'Search "tomatoes, spinach, potol..."',
    'Search "fresh coriander, ginger, chillies..."',
    'Search "Kolkata morning harvest..."',
    'Search "seasonal shukto veggies..."'
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [placeholders.length]);


  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* MOBILE HEADER (<md): Exact Blinkit App Structural Layout      */}
      {/* ------------------------------------------------------------- */}
      <div className="md:hidden sticky top-0 z-40 w-full max-w-full shadow-xs">
        {/* 1. Top Green Header: Delivery Status + Account & Cart + Address */}
        <div className="bg-gradient-to-b from-brand-700 via-brand-700 to-brand-800 text-white px-3.5 pt-2.5 pb-2 border-b border-brand-800/60">
          {/* Row 1: Delivery Promise + Distance/ETA Pill + Account & Cart */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-base font-black tracking-tight text-white whitespace-nowrap">
                Delivery by 7:00 AM
              </span>
              <div className="bg-brand-900/80 text-emerald-200 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 truncate max-w-[125px]">
                {selectedLocation.name.split('(')[0].trim()} · 2.1 km
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Account Profile Icon */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-7 h-7 rounded-full bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-100 flex items-center justify-center transition-colors border border-emerald-400/50"
                    aria-label="Account Profile"
                  >
                    <User className="w-3.5 h-3.5" />
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsUserMenuOpen(false)} 
                      />
                      <div className="absolute right-0 top-9 z-50 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 text-gray-800 animate-in fade-in zoom-in-95">
                        <div className="px-3.5 py-2 border-b border-gray-100">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {customer?.fullName || 'Valued Customer'}
                          </p>
                          <p className="text-[10px] text-gray-500 truncate">
                            {customer?.phoneNumber ? `+91 ${customer.phoneNumber}` : (user.email || 'Kolkata Customer')}
                          </p>
                        </div>
                        <Link
                          href="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold hover:bg-brand-50 hover:text-brand-700 text-gray-700"
                        >
                          <Package className="w-3.5 h-3.5 text-brand-600" />
                          My Dawn Orders
                        </Link>
                        <Link
                          href="/addresses"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold hover:bg-brand-50 hover:text-brand-700 text-gray-700"
                        >
                          <MapPin className="w-3.5 h-3.5 text-brand-600" />
                          Saved Addresses
                        </Link>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            signOut();
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left border-t border-gray-50"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="w-7 h-7 rounded-full bg-brand-900/70 hover:bg-brand-900 text-emerald-100 flex items-center justify-center transition-colors border border-emerald-500/30"
                  aria-label="Sign In"
                >
                  <User className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Small Cart Icon + Amount Badge */}
              <Link
                href="/cart"
                className="relative flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-900/90 hover:bg-brand-950 border border-emerald-500/40 text-white transition-all shadow-xs"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-accent-300 shrink-0" />
                <span className="text-[11px] font-black text-white">
                  {totalItemsCount === 0 ? '₹0' : `₹${subtotal}`}
                </span>
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-400 text-brand-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Row 2: Address Row */}
          <button
            onClick={openLocationModal}
            className="flex items-center gap-1 text-emerald-100 hover:text-white mt-1 text-left w-full truncate transition-colors group"
            aria-label="Change delivery location"
          >
            <MapPin className="w-3 h-3 text-accent-300 shrink-0" />
            <span className="text-xs font-semibold truncate">
              <span className="font-black text-white">HOME</span> - {selectedLocation.name.split('(')[0].trim()}, Kolkata
            </span>
            <ChevronDown className="w-3 h-3 text-emerald-200 shrink-0 ml-0.5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* 2. Search Bar Strip: White/Light background with Search, Mic, & Rotating Placeholder */}
        <div className="bg-white px-3 py-2 border-b border-gray-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-full h-10 px-3.5 bg-gray-50 hover:bg-gray-100/90 border border-gray-200 focus:border-brand-500 rounded-xl flex items-center justify-between text-left transition-all shadow-inner group"
          >
            <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-600 truncate min-w-0">
              <Search className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="text-xs text-gray-500 font-medium truncate transition-all">
                {placeholders[placeholderIndex]}
              </span>
            </div>
            <div className="p-1 rounded-full text-gray-400 group-hover:text-brand-600 transition-colors shrink-0">
              <Mic className="w-4 h-4 text-brand-600" />
            </div>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DESKTOP HEADER (>=md): Fully Preserved Desktop Experience     */}
      {/* ------------------------------------------------------------- */}
      {/* Desktop Banner (>=md) */}
      <div className="hidden md:block bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white text-xs sm:text-sm py-2 px-4 sm:px-6 lg:px-8 shadow-xs border-b border-brand-700/50 overflow-hidden w-full max-w-full">
        <div className="w-full flex items-center justify-between gap-3 overflow-hidden">
          <div className="flex items-center gap-2 font-medium tracking-wide truncate">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-400"></span>
            </span>
            <Clock className="w-4 h-4 text-accent-400 shrink-0" />
            <span className="font-black text-accent-300 shrink-0">Kolkata Dawn Mandi Run:</span>
            <span className="truncate font-semibold">{deliveryPromiseText}</span>
          </div>
          
          <div className="flex items-center gap-3 xl:gap-4 text-brand-200 text-xs shrink-0">
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

      {/* Desktop Sticky Header (>=md) */}
      <header className="hidden md:block sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all w-full max-w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-full">
          {/* Top Row: Brand, Locality, and Actions */}
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            
            {/* Left: Logo + Locality Selector */}
            <div className="flex items-center gap-3 shrink-0 min-w-0">
              <Link href="/" className="flex items-center gap-2 group shrink-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                  <span className="text-xl sm:text-2xl">🥬</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-brand-900 leading-none">
                    CAL<span className="text-brand-600">WAY</span>
                  </span>
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-800 mt-0.5">
                    Mandi-Fresh • Kolkata
                  </span>
                </div>
              </Link>

              {/* Location Selector (Desktop) */}
              <button
                onClick={openLocationModal}
                className="flex items-center gap-1.5 text-left px-3 py-1.5 rounded-2xl bg-brand-50 hover:bg-brand-100 border border-brand-200/70 transition-all max-w-[170px] lg:max-w-[210px] truncate"
                title="Change Kolkata delivery locality"
              >
                <div className="p-1 rounded-lg bg-brand-600 text-white shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-[10px] font-bold text-emerald-900 uppercase leading-none">Delivering to</div>
                  <div className="text-sm font-extrabold text-gray-900 truncate leading-tight mt-0.5 flex items-center gap-0.5">
                    <span className="truncate">{selectedLocation.name.split('(')[0].trim()}</span>
                    <ChevronDown className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                  </div>
                </div>
              </button>
            </div>

            {/* Desktop Search Bar */}
            <div className="flex flex-1 min-w-0 max-w-xl mx-4">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="w-full h-11 lg:h-12 pl-3.5 pr-2.5 bg-gray-50 hover:bg-gray-100/90 border border-gray-200 focus:border-brand-500 rounded-2xl flex items-center justify-between text-left transition-all shadow-inner group"
              >
                <div className="flex items-center gap-2.5 text-gray-400 group-hover:text-gray-600 truncate min-w-0">
                  <Search className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="text-sm truncate text-gray-500 font-medium">
                    Search for <span className="font-bold text-gray-800">&ldquo;tomatoes, spinach, shukto...&rdquo;</span>
                  </span>
                </div>
                <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-md shadow-2xs shrink-0 ml-2">
                  /
                </kbd>
              </button>
            </div>

            {/* Right Nav Actions: Sign In + Cart */}
            {/* Right Nav Actions: Sign In / User Menu + Cart */}
            <div className="flex items-center gap-3 shrink-0">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-700 hover:text-brand-800 hover:bg-brand-50 rounded-2xl border border-gray-200 hover:border-brand-200 transition-all shrink-0"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="max-w-[120px] truncate text-xs">
                      {customer?.fullName || (customer?.phoneNumber ? `+91 ${customer.phoneNumber}` : (user.email?.split('@')[0] || 'My Account'))}
                    </span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsUserMenuOpen(false)} 
                      />
                      <div className="absolute right-0 top-12 z-50 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 text-gray-800 animate-in fade-in zoom-in-95">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {customer?.fullName || 'Valued Customer'}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate">
                            {customer?.phoneNumber ? `+91 ${customer.phoneNumber}` : (user.email || 'Kolkata Customer')}
                          </p>
                        </div>
                        <Link
                          href="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-brand-50 hover:text-brand-700 transition-colors text-gray-700"
                        >
                          <Package className="w-4 h-4 text-brand-600" />
                          My Dawn Orders
                        </Link>
                        <Link
                          href="/addresses"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-brand-50 hover:text-brand-700 transition-colors text-gray-700"
                        >
                          <MapPin className="w-4 h-4 text-brand-600" />
                          Saved Addresses
                        </Link>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            signOut();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 text-left border-t border-gray-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-gray-700 hover:text-brand-800 hover:bg-brand-50 rounded-2xl border border-gray-200 hover:border-brand-200 transition-all shrink-0"
                >
                  <User className="w-4 h-4 text-brand-600" />
                  <span>Sign In</span>
                </button>
              )}

              <Link
                href="/cart"
                className="relative flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-accent-300" />
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-400 text-brand-950 font-black text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm animate-bounce-short">
                      {totalItemsCount}
                    </span>
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-semibold text-brand-100 uppercase tracking-wider leading-none">
                    {totalItemsCount === 0 ? 'My Cart' : `${totalItemsCount} items`}
                  </span>
                  <span className="text-sm font-black text-white leading-tight">
                    {totalItemsCount === 0 ? 'Cart' : `₹${subtotal}`}
                  </span>
                </div>
              </Link>
            </div>

          </div>
        </div>

        {/* Blinkit-Style Quick Sub-Navigation Strip (Desktop Only, Hidden on Mobile) */}
        <div className="hidden md:block border-t border-gray-100 bg-gray-50/90 px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2 overflow-x-auto no-scrollbar w-full max-w-full">
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

      {/* Supabase Authentication Modal */}
      <AuthModal />
    </>
  );
};
