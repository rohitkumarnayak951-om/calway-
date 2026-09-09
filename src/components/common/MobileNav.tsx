'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Calendar, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { totalItemsCount } = useCart();

  // Hide bottom nav on checkout to avoid distraction
  if (pathname === '/checkout') return null;

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Mandi Shop', href: '/shop', icon: Grid },
    { label: 'Subscribe', href: '/subscriptions', icon: Calendar },
    { label: 'Cart', href: '/cart', icon: ShoppingBag, badge: totalItemsCount },
    { label: 'Support', href: '/contact', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200/80 px-2 py-1.5 shadow-lg">
      <nav className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
                isActive ? 'text-brand-700 font-bold' : 'text-gray-500 hover:text-gray-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-brand-600' : ''}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-accent-500 text-brand-950 font-black text-xs w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 font-semibold ${isActive ? 'text-brand-800' : 'text-gray-500'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-0.5"></span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
