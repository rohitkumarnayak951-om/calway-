'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { deliverySlots } from '@/services/productService';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  MapPin, 
  Tag, 
  ShoppingBag, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart,
    subtotal, 
    discount, 
    promoDiscount,
    deliveryFee, 
    grandTotal, 
    appliedPromo, 
    applyPromo, 
    removePromo 
  } = useCart();

  const { selectedLocation, openModal: openLocationModal } = useLocation();

  const [selectedSlotId, setSelectedSlotId] = useState<string>(deliverySlots[0].id);
  const [promoInput, setPromoInput] = useState<string>('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [deliveryInstruction, setDeliveryInstruction] = useState<string>('Leave at door in morning');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput('');
  };

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-600 shadow-inner">
          <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-brand-500" />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
          Your Morning Basket is Empty
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mt-3 max-w-md mx-auto leading-relaxed">
          Fresh morning harvests arrive at Sealdah Koley & Mechua mandis at dawn. Add your daily essentials before 10 PM!
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black text-base rounded-2xl shadow-md shadow-brand-600/30 transition-all hover:scale-105"
          >
            Explore Today&apos;s Mandi Harvest
          </Link>
          <Link
            href="/subscriptions"
            className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-gray-50 text-gray-800 font-black text-base rounded-2xl border border-gray-200 transition-colors"
          >
            View Morning Subscriptions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto py-5 sm:py-10 pb-28 sm:pb-16">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-gray-200 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-2 sm:gap-3.5">
            <span>Your Morning Basket</span>
            <span className="text-xs sm:text-sm font-black px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-brand-100 text-brand-900 rounded-full">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </h1>
          <p className="text-xs sm:text-base text-gray-600 font-medium mt-1">
            Review your dawn harvest items before confirming tomorrow morning&apos;s drop
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs sm:text-sm font-black text-red-600 hover:text-red-700 flex items-center gap-1.5 hover:underline self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" /> Clear basket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Col: Items List, Delivery Slot, & Instructions */}
        <div className="lg:col-span-8 space-y-5 sm:space-y-6">
          
          {/* Sourcing Location Notification */}
          <div className="bg-brand-50/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-brand-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 bg-brand-600 text-white rounded-xl sm:rounded-2xl shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-base font-black text-brand-950 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span>Delivering to: {selectedLocation.name}</span>
                  <span className="text-[10px] sm:text-xs bg-brand-200 text-brand-950 px-2 py-0.5 rounded-full font-mono font-bold">
                    {selectedLocation.pincode}
                  </span>
                </div>
                <div className="text-[11px] sm:text-sm font-semibold text-brand-700 mt-0.5">
                  Sourced from {selectedLocation.mandiHub} at 3:45 AM tomorrow
                </div>
              </div>
            </div>

            <button
              onClick={openLocationModal}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white hover:bg-brand-100 text-brand-950 text-xs sm:text-sm font-black rounded-xl border border-brand-300 self-start sm:self-auto transition-colors"
            >
              Change Area
            </button>
          </div>

          {/* Cart Items List */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-100 overflow-hidden">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedWeight}`}
                className="p-3.5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-gray-50/40 transition-colors"
              >
                {/* Thumbnail & Product Details */}
                <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="truncate min-w-0">
                    <Link
                      href={`/product/${item.product.id}`}
                      className="font-black text-gray-900 text-xs sm:text-base lg:text-lg hover:text-brand-700 transition-colors truncate block"
                    >
                      {item.product.name}
                    </Link>

                    {item.product.bengaliName && (
                      <span className="text-[11px] sm:text-sm text-emerald-800 font-bold block mt-0.5 truncate">
                        {item.product.bengaliName}
                      </span>
                    )}

                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                      <span className="text-[10px] sm:text-sm font-black text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md sm:rounded-lg">
                        {item.selectedWeight}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">
                        {item.product.mandiSource.split(',')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing, Stepper & Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                  <div>
                    <div className="text-sm sm:text-lg lg:text-xl font-black text-gray-900">
                      ₹{item.selectedPrice * item.quantity}
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-[10px] sm:text-xs text-gray-500 font-medium">
                        ₹{item.selectedPrice} each
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-brand-50 rounded-xl p-0.5 sm:p-1 border border-brand-200">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedWeight)}
                        className="w-7 sm:w-9 h-7 sm:h-9 rounded-lg bg-white hover:bg-gray-100 flex items-center justify-center text-brand-900 transition-colors shadow-2xs"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                      <span className="w-6 sm:w-8 text-center font-black text-xs sm:text-base text-brand-950">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedWeight)}
                        className="w-7 sm:w-9 h-7 sm:h-9 rounded-lg bg-white hover:bg-gray-100 flex items-center justify-center text-brand-900 transition-colors shadow-2xs"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => removeItem(item.product.id, item.selectedWeight)}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Slot Selector */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base sm:text-lg text-gray-900 flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-brand-600" />
                <span>Select Morning Delivery Window</span>
              </h3>
              <span className="text-xs sm:text-sm font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl">
                Tomorrow Morning
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {deliverySlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                return (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-brand-50 border-brand-600 ring-2 ring-brand-400/30 shadow-xs'
                        : 'bg-gray-50/70 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-gray-900">{slot.title}</span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
                    </div>
                    <div className="text-base sm:text-lg font-black text-brand-900 mt-1">
                      {slot.timeWindow}
                    </div>
                    {slot.tag && (
                      <span className="text-xs font-bold text-amber-800 block mt-1.5">
                        {slot.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Delivery Instructions */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-900">
              Morning Delivery Instructions
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {[
                'Leave at door in morning',
                'Ring bell once softly',
                'Leave with apartment security',
                'Call before delivery',
              ].map((inst) => (
                <button
                  key={inst}
                  onClick={() => setDeliveryInstruction(inst)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black border transition-colors ${
                    deliveryInstruction === inst
                      ? 'bg-brand-100 border-brand-500 text-brand-950'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {inst}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Bill Summary, Promo Code, Checkout CTA */}
        <div className="lg:col-span-4 space-y-6 sticky top-28">
          
          {/* Promo Code Box */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-3.5">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-gray-900 uppercase tracking-wider">
              <Tag className="w-4 h-4 text-brand-600" />
              <span>Apply Mandi Promo Code</span>
            </div>

            {appliedPromo ? (
              <div className="p-3.5 bg-brand-50 border border-brand-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-brand-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-accent-500" />
                    <span>&ldquo;{appliedPromo}&rdquo; Applied</span>
                  </div>
                  <span className="text-xs sm:text-sm text-brand-700 font-bold">
                    Saved ₹{promoDiscount} on your basket!
                  </span>
                </div>
                <button
                  onClick={removePromo}
                  className="text-xs sm:text-sm font-black text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (MANDI20 / FREESHIP)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <div className={`text-xs sm:text-sm font-bold flex items-center gap-1 mt-1 ${
                    promoMessage.isError ? 'text-red-600' : 'text-emerald-700'
                  }`}>
                    {promoMessage.isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>{promoMessage.text}</span>
                  </div>
                )}
                {/* Promo hints */}
                <div className="pt-1 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => { setPromoInput('MANDI20'); }}
                    className="text-xs font-black px-2.5 py-1 bg-accent-100 text-accent-950 rounded-lg hover:bg-accent-200"
                  >
                    MANDI20 (20% OFF)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPromoInput('FREESHIP'); }}
                    className="text-xs font-black px-2.5 py-1 bg-brand-100 text-brand-900 rounded-lg hover:bg-brand-200"
                  >
                    FREESHIP
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-gray-900 pb-3 border-b border-gray-100">
              Bill Summary
            </h3>

            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Produce Subtotal ({items.length} items)</span>
                <span className="font-bold text-gray-900">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Mandi Direct Savings (vs Retail MRP)</span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Promo Discount ({appliedPromo})</span>
                  <span>- ₹{promoDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <span>Dawn Delivery Fee</span>
                  {deliveryFee === 0 && <span className="text-xs text-emerald-700 font-black">(Free &gt; ₹199)</span>}
                </span>
                <span className="font-bold text-gray-900">
                  {deliveryFee === 0 ? <span className="text-emerald-700 font-black">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between text-gray-600 font-medium">
                <span>Mandi Sorting & Kraft Bag</span>
                <span className="text-emerald-700 font-black">₹0 (Free)</span>
              </div>

              <div className="pt-3.5 border-t border-gray-100 flex justify-between items-baseline text-gray-900">
                <div>
                  <div className="text-base sm:text-lg font-black">Grand Total</div>
                  <div className="text-xs text-gray-500 font-semibold">Total savings: ₹{discount + promoDiscount}</div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-brand-900">
                  ₹{grandTotal}
                </div>
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="pt-3">
              <Link
                href={`/checkout?slot=${selectedSlotId}&inst=${encodeURIComponent(deliveryInstruction)}`}
                className="w-full py-4 sm:py-4.5 bg-accent-400 hover:bg-accent-300 text-brand-950 font-black text-base sm:text-lg rounded-2xl shadow-lg shadow-accent-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5 text-brand-950" />
              </Link>
            </div>

            {/* Freshness trust badge */}
            <div className="pt-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-brand-800 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% replacement guarantee if quality fails</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
