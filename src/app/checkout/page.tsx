'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { deliverySlots } from '@/services/productService';
import locationsData from '@/data/locations.json';
import { KolkataLocality } from '@/types';
import confetti from 'canvas-confetti';
import { 
  MapPin, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const locations = locationsData as KolkataLocality[];

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slotParam = searchParams.get('slot') || deliverySlots[0].id;
  const instParam = searchParams.get('inst') || 'Leave at door in morning';

  const { items, subtotal, promoDiscount, deliveryFee, grandTotal, clearCart } = useCart();
  const { selectedLocation } = useLocation();

  // Address Form State
  const [fullName, setFullName] = useState('Ananya Sen');
  const [phone, setPhone] = useState('9830123456');
  const [flatNo, setFlatNo] = useState('Flat 4B, Greenfield Residency');
  const [street, setStreet] = useState('Street 12, Block BD');
  const [selectedLocality, setSelectedLocality] = useState(selectedLocation.name);
  const [pincode, setPincode] = useState(selectedLocation.pincode);
  const [landmark, setLandmark] = useState('Near Swimming Pool / Central Park');

  // Slot
  const selectedSlot = deliverySlots.find((s) => s.id === slotParam) || deliverySlots[0];

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');

  // Order Success Modal State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomId = `CAL-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedOrderId(randomId);

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderPlaced(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#f59e0b', '#10b981', '#fbbf24'],
        });
      } catch (err) {
        console.log('Confetti not available', err);
      }
    }, 1200);
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-xs text-gray-500 mt-1">Please add produce from the mandi catalog first.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold text-xs"
        >
          Browse Mandi Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto py-5 sm:py-10 pb-28 sm:pb-16">
      
      {/* Checkout Step Header */}
      <div className="flex items-center gap-3 pb-4 sm:pb-6 border-b border-gray-200 mb-6 sm:mb-8">
        <Link
          href="/cart"
          className="p-2 sm:p-2.5 bg-white hover:bg-gray-100 rounded-xl border border-gray-200 text-gray-600 transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
            Checkout & Morning Delivery Setup
          </h1>
          <p className="text-xs sm:text-base text-gray-600 font-medium mt-0.5">
            Dawn delivery to your Kolkata doorstep tomorrow
          </p>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Col: Address, Slot, & Payment Form */}
        <div className="lg:col-span-8 space-y-5 sm:space-y-6">
          
          {/* 1. Kolkata Delivery Address */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-gray-100 shadow-sm space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100">
              <h2 className="text-base sm:text-xl font-black text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" />
                <span>1. Kolkata Delivery Address</span>
              </h2>
              <span className="text-[10px] sm:text-sm font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 sm:py-1 rounded-full">
                Dawn Sourced Hub
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs sm:text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm sm:text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                  Mobile Number (For WhatsApp Morning Drop Alert)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-bold text-gray-500 border-r border-gray-200 pr-2.5">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-16 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm sm:text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                  Flat / Apartment No. & Building Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tower 3, Flat 502, Silver Spring"
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm sm:text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                  Street / Block / Road
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm sm:text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                  Kolkata Locality
                </label>
                <select
                  value={selectedLocality}
                  onChange={(e) => {
                    setSelectedLocality(e.target.value);
                    const match = locations.find((l) => l.name === e.target.value);
                    if (match) setPincode(match.pincode);
                  }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm sm:text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white cursor-pointer"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} ({loc.pincode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                  Pincode
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm sm:text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm sm:text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 2. Morning Delivery Slot Confirmation */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-brand-600" />
                <span>2. Delivery Schedule & Instructions</span>
              </h2>
            </div>

            <div className="p-4 sm:p-5 bg-brand-50/70 border border-brand-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-lg font-bold">
                  🌅
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-brand-950">
                    Tomorrow Morning: {selectedSlot.timeWindow}
                  </div>
                  <div className="text-xs sm:text-sm text-brand-700 font-semibold mt-0.5">
                    Instruction: {instParam}
                  </div>
                </div>
              </div>
              <Link href="/cart" className="text-xs sm:text-sm font-black text-brand-700 hover:underline">
                Change Slot
              </Link>
            </div>
          </div>

          {/* 3. Payment Method (Mock Selection) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-brand-600" />
                <span>3. Select Payment Method (Mock)</span>
              </h2>
              <span className="text-xs font-bold text-gray-400">100% Secure</span>
            </div>

            {/* Radio Options */}
            <div className="space-y-3.5">
              {/* UPI */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-brand-50/50 border-brand-600 ring-2 ring-brand-400/30'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="accent-brand-600 w-5 h-5"
                    />
                    <div>
                      <span className="text-sm sm:text-base font-black text-gray-900">UPI Instant Payment (Zero Fee)</span>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">Google Pay, PhonePe, Paytm, or BHIM UPI</p>
                    </div>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 bg-accent-100 text-accent-950 rounded-lg">
                    Recommended
                  </span>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="mt-3.5 pt-3.5 border-t border-brand-100 flex items-center gap-3">
                    {[
                      { id: 'gpay', label: 'Google Pay' },
                      { id: 'phonepe', label: 'PhonePe' },
                      { id: 'paytm', label: 'Paytm UPI' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.id as 'gpay' | 'phonepe' | 'paytm')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black border transition-colors ${
                          selectedUpiApp === app.id
                            ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                            : 'bg-white border-gray-200 text-gray-700'
                        }`}
                      >
                        {app.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Credit / Debit Card */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-brand-50/50 border-brand-600 ring-2 ring-brand-400/30'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-brand-600 w-5 h-5"
                  />
                  <div>
                    <span className="text-sm sm:text-base font-black text-gray-900">Credit / Debit Card</span>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Visa, MasterCard, RuPay cards accepted</p>
                  </div>
                </div>
              </div>

              {/* Cash On Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-brand-50/50 border-brand-600 ring-2 ring-brand-400/30'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-brand-600 w-5 h-5"
                  />
                  <div>
                    <span className="text-sm sm:text-base font-black text-gray-900">Pay on Morning Delivery (Cash / UPI at Door)</span>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Inspect vegetables at door before paying the delivery agent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Order Summary & Place Order Button */}
        <div className="lg:col-span-4 space-y-6 sticky top-28">
          
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-gray-900 pb-3 border-b border-gray-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs sm:text-sm text-gray-500 font-bold">{items.length} items</span>
            </h3>

            {/* Compact items list */}
            <div className="max-h-52 overflow-y-auto divide-y divide-gray-50 pr-1 space-y-1.5">
              {items.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                  <div className="truncate mr-2">
                    <span className="font-bold text-gray-900">{item.product.name}</span>
                    <div className="text-xs text-gray-500 font-medium">
                      {item.quantity} × {item.selectedWeight}
                    </div>
                  </div>
                  <span className="font-black text-gray-900 shrink-0 text-sm sm:text-base">
                    ₹{item.selectedPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost breakdown */}
            <div className="pt-3 border-t border-gray-100 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{subtotal}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Promo Savings</span>
                  <span>- ₹{promoDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Morning Delivery Fee</span>
                <span className="font-bold text-gray-900">
                  {deliveryFee === 0 ? <span className="text-emerald-700 font-black">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="pt-3.5 border-t border-gray-100 flex justify-between items-baseline text-gray-900">
                <span className="text-base sm:text-lg font-black">Total to Pay</span>
                <span className="text-2xl sm:text-3xl font-black text-brand-900">₹{grandTotal}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4.5 sm:py-5 bg-accent-400 hover:bg-accent-300 disabled:opacity-60 text-brand-950 font-black text-base sm:text-lg rounded-2xl shadow-lg shadow-accent-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-brand-950 border-t-transparent rounded-full animate-spin" />
                  <span>Connecting with Mandi Hub...</span>
                </>
              ) : (
                <>
                  <span>Place Morning Order (₹{grandTotal})</span>
                  <ArrowRight className="w-5 h-5 text-brand-950" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 font-medium text-center leading-relaxed">
              By confirming, our dawn sourcing agents will reserve this harvest at 3:30 AM tomorrow.
            </p>
          </div>

        </div>

      </form>

      {/* Interactive Order Confirmation Modal */}
      {orderPlaced && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-9 text-center border border-brand-100 animate-in zoom-in-95">
            
            {/* Animated Checkmark Circle */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4 animate-bounce-short">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-brand-600" />
            </div>

            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-accent-700 bg-accent-100 px-3.5 py-1.5 rounded-full">
              Order Confirmed For Dawn Delivery
            </span>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mt-3 tracking-tight">
              You&apos;re Getting Mandi-Fresh Veggies!
            </h3>

            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-sm mx-auto">
              We received your morning order <strong className="text-gray-900 font-black">{generatedOrderId}</strong>. Sourcing will begin at dawn.
            </p>

            {/* Delivery Details Card */}
            <div className="my-6 p-5 sm:p-6 bg-brand-50 rounded-2xl border border-brand-100 text-left space-y-3 text-xs sm:text-sm text-brand-950">
              <div className="flex justify-between font-bold">
                <span className="text-brand-700">Delivery Slot:</span>
                <span className="font-black">Tomorrow, {selectedSlot.timeWindow}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-brand-700">Address:</span>
                <span className="truncate max-w-[200px] font-black">{flatNo}, {selectedLocality}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-brand-700">Total Paid:</span>
                <span className="font-black">₹{grandTotal} ({paymentMethod.toUpperCase()})</span>
              </div>
            </div>

            {/* Mandi Sourcing Timeline Visualization */}
            <div className="my-6 text-left border-t border-gray-100 pt-5">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-500 mb-3.5">
                Live Dawn Fulfillment Timeline
              </h4>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center gap-3 font-bold text-brand-900">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="font-black">Order Confirmed & Logged for Dawn Run</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 font-medium">
                  <span className="w-3 h-3 rounded-full bg-gray-300 shrink-0"></span>
                  <span>03:30 AM: Hand-picking at Sealdah Koley & Mechua</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 font-medium">
                  <span className="w-3 h-3 rounded-full bg-gray-300 shrink-0"></span>
                  <span>04:45 AM: Hand-sorting, weighing & ozone wash</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 font-medium">
                  <span className="w-3 h-3 rounded-full bg-gray-300 shrink-0"></span>
                  <span>06:15 AM: Dispatched to your doorstep</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  clearCart();
                  router.push('/');
                }}
                className="flex-1 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-md transition-colors"
              >
                Back to Home
              </button>
              <button
                onClick={() => {
                  clearCart();
                  router.push('/shop');
                }}
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-sm sm:text-base rounded-2xl transition-colors"
              >
                Explore More Produce
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="w-full p-12 text-center text-gray-500">Preparing Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
