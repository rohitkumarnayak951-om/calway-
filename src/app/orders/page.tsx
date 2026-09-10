'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { orderService, OrderRecord } from '@/services/orderService';
import { 
  Package, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Calendar, 
  ChevronRight
} from 'lucide-react';

export default function OrdersPage() {
  const { user, customer, openAuthModal, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        orderService.getCustomerOrders(user.id).then((res) => {
          setOrders(res);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  if (authLoading || (user && loading)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-bold text-sm">Loading your morning orders...</p>
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mx-auto mb-4 text-2xl">
          🥬
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Sign in to view orders</h2>
        <p className="text-sm text-gray-500 mt-2 mb-6">
          Track your Kolkata dawn mandi deliveries, download invoices, and reorder favourite seasonal vegetables.
        </p>
        <button
          onClick={openAuthModal}
          className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-sm shadow-md transition-colors"
        >
          Sign In / Sign Up
        </button>
      </div>
    );
  }

  // Empty orders state
  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">No orders yet</h2>
        <p className="text-sm text-gray-500 mt-2 mb-6">
          You haven&apos;t placed any morning produce orders yet. Experience zero-cold-storage vegetables delivered fresh tomorrow dawn!
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-sm shadow-md transition-colors"
        >
          <span>Explore Mandi Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Package className="w-7 h-7 text-brand-600" />
            <span>My Dawn Orders</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Logged in as {customer?.fullName || user.email || 'Valued Customer'}
          </p>
        </div>
        <Link
          href="/shop"
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-brand-50 text-brand-800 hover:bg-brand-100 rounded-xl text-xs font-bold transition-colors"
        >
          <span>Order Fresh</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const dateStr = new Date(order.created_at).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
          const addr = (order.delivery_address_snapshot || {}) as Record<string, string>;
          const statusColors: Record<string, string> = {
            pending: 'bg-amber-100 text-amber-800 border-amber-200',
            confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            out_for_delivery: 'bg-blue-100 text-blue-800 border-blue-200',
            delivered: 'bg-green-100 text-green-900 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
          };

          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:border-brand-200 transition-all group"
            >
              {/* Row 1: Order # + Date + Status Pill */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-gray-900 text-sm sm:text-base">
                    {order.order_number}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {dateStr}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                      statusColors[order.status] || 'bg-gray-100 text-gray-800 border-gray-200'
                    }`}
                  >
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Row 2: Produce Summary & Delivery Details */}
              <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Produce thumbnails & names */}
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    {order.order_items?.slice(0, 3).map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 font-bold"
                      >
                        <span>🥬</span>
                        <span>{item.product_name}</span>
                        <span className="text-gray-400 font-normal">({item.quantity})</span>
                      </span>
                    ))}
                    {(order.order_items?.length || 0) > 3 && (
                      <span className="px-2 py-1 bg-brand-50 text-brand-800 font-bold rounded-xl">
                        +{(order.order_items?.length || 0) - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-gray-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-brand-600" />
                      {order.delivery_slot}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                      <MapPin className="w-3 h-3 text-brand-600" />
                      {addr.area || 'Kolkata'}
                    </span>
                  </div>
                </div>

                {/* Amount & CTA */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Total Amount</p>
                    <p className="text-lg font-black text-brand-900">₹{order.total}</p>
                  </div>

                  <Link
                    href={`/order-confirmation/${order.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-900 group-hover:translate-x-0.5 transition-transform mt-1"
                  >
                    <span>View Tracking & Items</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
