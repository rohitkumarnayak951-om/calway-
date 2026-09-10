'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import { deliverySlots } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { addressService, CustomerAddress } from '@/services/addressService';
import locationsData from '@/data/locations.json';
import { KolkataLocality } from '@/types';
import confetti from 'canvas-confetti';
import { 
  MapPin, 
  Clock, 
  CreditCard, 
  ArrowRight,
  ArrowLeft,
  User,
  Plus,
  AlertCircle
} from 'lucide-react';

const locations = locationsData as KolkataLocality[];

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slotParam = searchParams.get('slot') || deliverySlots[0].id;
  const instParam = searchParams.get('inst') || 'Leave at door in morning';

  const { items, subtotal, promoDiscount, deliveryFee, grandTotal, clearCart } = useCart();
  const { selectedLocation } = useLocation();
  const { user, customer, openAuthModal } = useAuth();

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [addressLabel, setAddressLabel] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Address Form State
  const [fullName, setFullName] = useState(customer?.fullName || '');
  const [phone, setPhone] = useState(customer?.phoneNumber || '');
  const [flatNo, setFlatNo] = useState('');
  const [street, setStreet] = useState('');
  const [selectedLocality, setSelectedLocality] = useState(selectedLocation.name);
  const [pincode, setPincode] = useState(selectedLocation.pincode);
  const [landmark, setLandmark] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync user details when auth state updates
  useEffect(() => {
    if (customer?.fullName && !fullName) {
      setFullName(customer.fullName);
    }
    if (customer?.phoneNumber && !phone) {
      setPhone(customer.phoneNumber);
    }
  }, [customer, fullName, phone]);

  // Load saved addresses when user is logged in
  useEffect(() => {
    if (user) {
      addressService.getAddresses(user.id).then((addresses) => {
        setSavedAddresses(addresses);
        const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setAddressLabel((defaultAddr.label as 'Home' | 'Work' | 'Other') || 'Home');
          setSelectedLocality(defaultAddr.area);
          setPincode(defaultAddr.pincode);
        }
      });
    }
  }, [user]);

  // Slot
  const selectedSlot = deliverySlots.find((s) => s.id === slotParam) || deliverySlots[0];

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      let finalAddressId = selectedAddressId !== 'new' ? selectedAddressId : null;
      let addressSnapshot: Record<string, unknown> | null = null;

      if (selectedAddressId !== 'new') {
        const addr = savedAddresses.find((a) => a.id === selectedAddressId);
        if (addr) {
          addressSnapshot = {
            fullName: fullName || customer?.fullName || 'Customer',
            phone: phone || customer?.phoneNumber || '',
            fullAddress: addr.full_address,
            area: addr.area,
            city: addr.city,
            pincode: addr.pincode,
            label: addr.label,
          };
        }
      }

      if (!addressSnapshot) {
        if (!flatNo || !street) {
          throw new Error('Please enter complete apartment / street address.');
        }
        const fullAddrStr = `${flatNo}, ${street}${landmark ? ` (Near ${landmark})` : ''}`;
        addressSnapshot = {
          fullName: fullName || customer?.fullName || 'Customer',
          phone: phone || customer?.phoneNumber || '',
          fullAddress: fullAddrStr,
          area: selectedLocality,
          city: 'Kolkata',
          pincode,
          label: addressLabel,
        };

        // Save new address to customer profile
        const { address: newAddr } = await addressService.addAddress({
          customer_id: user.id,
          label: addressLabel,
          full_address: fullAddrStr,
          area: selectedLocality,
          city: 'Kolkata',
          pincode,
          is_default: savedAddresses.length === 0,
        });
        if (newAddr) {
          finalAddressId = newAddr.id;
        }
      }

      // Create Order in Supabase
      const { order, error } = await orderService.createOrder({
        customerId: user.id,
        addressId: finalAddressId,
        deliverySlot: selectedSlot.timeWindow,
        subtotal,
        discount: promoDiscount,
        total: grandTotal,
        items,
        addressSnapshot,
      });

      if (error || !order) {
        throw new Error(error?.message || 'Could not place order. Please try again.');
      }

      clearCart();

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

      router.push(`/order-confirmation/${order.id}`);
    } catch (err: unknown) {
      console.error('Order placement failed:', err);
      const msg = err instanceof Error ? err.message : 'Failed to place order. Please try again.';
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
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

            {/* Auth Banner if not signed in */}
            {!user && (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-950">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-200/70 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm">Sign in to save address & track dawn delivery</p>
                    <p className="text-[11px] text-emerald-800 font-medium">Link your phone or email for morning WhatsApp updates</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs shrink-0"
                >
                  Sign In / Sign Up
                </button>
              </div>
            )}

            {/* Saved Addresses List (if any) */}
            {user && savedAddresses.length > 0 && (
              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                  Select Delivery Address
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-400/20'
                          : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-brand-900 px-2 py-0.5 bg-brand-100/70 rounded-md">
                          {addr.label}
                        </span>
                        {addr.is_default && (
                          <span className="text-[10px] font-bold text-gray-500">Default</span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-gray-800 mt-2 truncate">
                        {addr.full_address}
                      </p>
                      <p className="text-[11px] text-gray-500 font-medium">
                        {addr.area}, Kolkata - {addr.pincode}
                      </p>
                    </div>
                  ))}

                  <div
                    onClick={() => setSelectedAddressId('new')}
                    className={`p-3.5 rounded-2xl border-2 border-dashed cursor-pointer transition-all flex items-center justify-center gap-2 ${
                      selectedAddressId === 'new'
                        ? 'border-brand-600 bg-brand-50/30 text-brand-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-xs font-black">Add New Address</span>
                  </div>
                </div>
              </div>
            )}

            {/* Form Fields for New Address */}
            {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
              <div className="space-y-4 pt-2">
                {user && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-600">Address Label:</span>
                    {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setAddressLabel(lbl)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          addressLabel === lbl
                            ? 'bg-brand-600 text-white shadow-2xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                )}

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
        )}
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
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          
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

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-red-800 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

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
