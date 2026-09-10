'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { orderService, OrderRecord } from '@/services/orderService';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles,
  Phone,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AddressSnapshot {
  fullName?: string;
  phone?: string;
  fullAddress?: string;
  area?: string;
  city?: string;
  pincode?: string;
  label?: string;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    orderService.getOrderById(orderId).then((foundOrder) => {
      setLoading(false);
      if (!foundOrder) {
        setError('Order not found');
      } else {
        setOrder(foundOrder);
        // Confetti burst on confirmation
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.55 },
            colors: ['#22c55e', '#f59e0b', '#10b981', '#fbbf24'],
          });
        } catch {
          // ignore
        }
      }
    });
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-bold text-sm">Fetching your dawn order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
        <p className="text-sm text-gray-500 mt-1">{error || 'Could not find the requested order record.'}</p>
        <Link
          href="/shop"
          className="mt-6 inline-block px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold text-xs shadow-md"
        >
          Return to Mandi Shop
        </Link>
      </div>
    );
  }

  const addr = (order.delivery_address_snapshot || {}) as AddressSnapshot;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 pb-24">
      {/* Top Success Banner */}
      <div className="bg-gradient-to-br from-brand-700 via-brand-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-center mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 border border-white/20 flex items-center justify-center mx-auto mb-4 animate-bounce-short">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-accent-300" />
          Dawn Delivery Confirmed
        </span>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1">
          Thank you for ordering with CALWAY!
        </h1>
        <p className="text-emerald-100 text-sm sm:text-base max-w-lg mx-auto mt-2">
          Your morning harvest has been queued. Our sourcing team begins hand-picking at Sealdah Koley Mandi at 3:30 AM tomorrow.
        </p>

        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 bg-brand-900/80 border border-white/10 rounded-2xl px-5 py-2.5 text-xs sm:text-sm">
          <span className="text-gray-300">Order ID:</span>
          <span className="font-mono font-black text-white">{order.order_number}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-300">Status:</span>
          <span className="font-bold text-accent-300 uppercase">{order.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Produce Items & Sourcing Schedule */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Produce List */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand-600" />
                Reserved Mandi Produce
              </span>
              <span className="text-xs text-gray-500 font-bold">
                {order.order_items?.length || 0} items
              </span>
            </h2>

            <div className="divide-y divide-gray-100">
              {order.order_items?.map((item, idx) => (
                <div key={item.id || idx} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center text-lg">
                      {item.product_image && item.product_image.startsWith('http') ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img 
                          src={item.product_image} 
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>🥬</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.product_name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × {item.unit}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-gray-900 shrink-0">
                    ₹{item.price_at_purchase * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sourcing Timeline */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Clock className="w-4 h-4 text-brand-600" />
              Live Dawn Fulfillment Schedule
            </h2>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-200">
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-brand-600 ring-4 ring-brand-100" />
                <p className="text-xs font-black text-brand-900 uppercase tracking-wider">Logged & Scheduled</p>
                <p className="text-xs text-gray-500 mt-0.5">Order confirmed for tomorrow&apos;s morning run</p>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-gray-300 ring-4 ring-white" />
                <p className="text-xs font-bold text-gray-700">03:30 AM - Mandi Auction Hand-Picking</p>
                <p className="text-xs text-gray-500 mt-0.5">Directly at Sealdah Koley & Mechua mandis</p>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-gray-300 ring-4 ring-white" />
                <p className="text-xs font-bold text-gray-700">04:45 AM - Ozone Sanitization & Weighing</p>
                <p className="text-xs text-gray-500 mt-0.5">Gentle wash in natural spring-clean ozonated water</p>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-gray-300 ring-4 ring-white" />
                <p className="text-xs font-bold text-gray-700">06:00 AM - 07:00 AM - Doorstep Drop</p>
                <p className="text-xs text-gray-500 mt-0.5">Delivered before breakfast tea</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Address & Payment Breakdown */}
        <div className="space-y-6">
          
          {/* Delivery Slot Card */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-5 text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              Delivery Window
            </div>
            <p className="text-base font-black text-emerald-950">
              {order.delivery_slot || 'Tomorrow 05:30 AM - 07:00 AM'}
            </p>
            <p className="text-xs text-emerald-800">
              Guaranteed dawn freshness promise
            </p>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <span className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                Delivery Address
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                {addr.label || 'Home'}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{addr.fullName || 'Customer'}</p>
              {addr.phone && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" /> +91 {addr.phone}
                </p>
              )}
              <p className="text-xs text-gray-700 mt-2 leading-relaxed">
                {addr.fullAddress || 'Kolkata Address'}
              </p>
              <p className="text-xs font-semibold text-brand-800 mt-0.5">
                {addr.area}, Kolkata - {addr.pincode}
              </p>
            </div>
          </div>

          {/* Payment Breakdown Card */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2.5">
              Payment Summary
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Savings</span>
                  <span>- ₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Morning Delivery</span>
                <span className="text-emerald-700 font-black">FREE</span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline">
                <span className="text-sm font-black text-gray-900">Total</span>
                <span className="text-xl font-black text-brand-900">₹{order.total}</span>
              </div>
              <div className="pt-1 text-[11px] text-gray-500 font-medium">
                Payment Status: <span className="font-bold text-amber-700 capitalize">{order.payment_status || 'Pending'}</span> (Pay on Morning Drop)
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="space-y-2.5 pt-2">
            <Link
              href="/orders"
              className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
            >
              <span>View All My Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/shop"
              className="w-full py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-2xl flex items-center justify-center transition-colors text-center"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
