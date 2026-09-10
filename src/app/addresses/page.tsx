'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { addressService, CustomerAddress } from '@/services/addressService';
import locationsData from '@/data/locations.json';
import { KolkataLocality } from '@/types';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Home, 
  Briefcase, 
  ArrowLeft
} from 'lucide-react';

const locations = locationsData as KolkataLocality[];

export default function AddressesPage() {
  const { user, openAuthModal, isLoading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State for Adding Address
  const [isAdding, setIsAdding] = useState(false);
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [fullAddress, setFullAddress] = useState('');
  const [area, setArea] = useState(locations[0].name);
  const [pincode, setPincode] = useState(locations[0].pincode);
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadAddresses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const data = await addressService.getAddresses(user.id);
    setAddresses(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadAddresses();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading, loadAddresses]);

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!fullAddress.trim()) {
      setErrorMsg('Please enter your full address.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const res = await addressService.addAddress({
      customer_id: user.id,
      label,
      full_address: fullAddress.trim(),
      area,
      city: 'Kolkata',
      pincode,
      is_default: isDefault || addresses.length === 0,
    });

    setSaving(false);
    if (res.error) {
      setErrorMsg(res.error.message);
    } else {
      setIsAdding(false);
      setFullAddress('');
      setIsDefault(false);
      loadAddresses();
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user) return;
    await addressService.setDefaultAddress(addressId, user.id);
    loadAddresses();
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    await addressService.deleteAddress(addressId);
    loadAddresses();
  };

  if (authLoading || (user && loading)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-bold text-sm">Loading your saved addresses...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Sign in to manage addresses</h2>
        <p className="text-sm text-gray-500 mt-2 mb-6">
          Save your Kolkata home and workplace delivery addresses for instant 1-tap checkout on your dawn orders.
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

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/checkout"
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Saved Kolkata Addresses
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Manage your morning doorstep drop-off destinations
            </p>
          </div>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Address</span>
          </button>
        )}
      </div>

      {/* Add Address Form Modal / Box */}
      {isAdding && (
        <form
          onSubmit={handleCreateAddress}
          className="bg-brand-50/60 border border-brand-200 rounded-3xl p-5 sm:p-7 mb-8 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-brand-200">
            <h2 className="text-base font-black text-brand-950">Add New Kolkata Address</h2>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs font-bold text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>

          {/* Label selector */}
          <div>
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
              Address Type
            </label>
            <div className="flex gap-2">
              {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setLabel(lbl)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    label === lbl
                      ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
              Flat No., Floor, Apartment / House Name & Street
            </label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Flat 4B, Greenfield Residency, Street 12, Block BD"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Locality & Pincode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                Kolkata Locality / Area
              </label>
              <select
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  const found = locations.find((l) => l.name === e.target.value);
                  if (found) setPincode(found.pincode);
                }}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name} ({loc.pincode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                Pincode
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Set as default checkbox */}
          <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="accent-brand-600 rounded w-4 h-4"
            />
            <span>Set as primary default address for morning orders</span>
          </label>

          {errorMsg && (
            <p className="text-xs font-bold text-red-600">{errorMsg}</p>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors"
            >
              {saving ? 'Saving...' : 'Save Address'}
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Address Cards List */}
      {addresses.length === 0 && !isAdding ? (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center shadow-xs">
          <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-gray-800">No saved addresses found</h3>
          <p className="text-xs text-gray-500 mt-1">Add your home or office address to enable quick 1-tap dawn deliveries.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all ${
                addr.is_default
                  ? 'border-brand-500/70 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center text-xs">
                    {addr.label === 'Work' ? (
                      <Briefcase className="w-3.5 h-3.5" />
                    ) : (
                      <Home className="w-3.5 h-3.5" />
                    )}
                  </span>
                  <span className="text-sm font-black text-gray-900">{addr.label}</span>
                  {addr.is_default && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {!addr.is_default && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs font-bold text-brand-700 hover:underline"
                    >
                      Make Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete Address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-relaxed">
                  {addr.full_address}
                </p>
                <p className="text-xs font-bold text-brand-900 mt-1">
                  {addr.area}, Kolkata - {addr.pincode}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
