'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, RotateCcw, LayoutGrid, Headphones } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  // Hide bottom nav on checkout to avoid distraction
  if (pathname === '/checkout') return null;

  const navItems = [
    { label: 'Home', href: '/', icon: Home, isHome: true },
    { label: 'Order Again', href: '/#reorder', icon: RotateCcw, isReorder: true },
    { label: 'Categories', href: '/shop', icon: LayoutGrid },
    { label: 'Support', href: '/contact', icon: Headphones },
  ];

  const handleReorderClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      const el = document.getElementById('reorder');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-xl border-t border-gray-200/80 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-xl">
      <nav className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.isHome
            ? pathname === '/'
            : item.isReorder
            ? false
            : pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={item.isReorder ? handleReorderClick : undefined}
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[64px] py-1 px-2 rounded-xl transition-all relative ${
                isActive ? 'text-brand-700 font-bold' : 'text-gray-500 hover:text-gray-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-brand-600 fill-brand-600' : 'text-gray-600'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-0.5 font-bold tracking-tight ${
                  isActive ? 'text-brand-800 font-black' : 'text-gray-600'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-0.5" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
