'use client';

import React, { useState } from 'react';
import { useLocation } from '@/context/LocationContext';
import locationsData from '@/data/locations.json';
import { KolkataLocality } from '@/types';
import { MapPin, X, Check, Search, Sparkles } from 'lucide-react';

const allLocations = locationsData as KolkataLocality[];

export const LocationModal: React.FC = () => {
  const { isModalOpen, closeModal, selectedLocation, setLocation } = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isModalOpen) return null;

  const filtered = allLocations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.pincode.includes(searchTerm) ||
      loc.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-brand-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-700 to-brand-800 p-6 sm:p-7 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-white/10 rounded-xl">
                <MapPin className="w-6 h-6 text-accent-400" />
              </span>
              <div>
                <h3 className="font-black text-xl text-white">Select Your Kolkata Locality</h3>
                <p className="text-sm text-brand-100 mt-0.5">Direct morning delivery from your nearest mandi hub</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search box */}
          <div className="mt-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-900" />
            <input
              type="text"
              placeholder="Search area (e.g. Salt Lake, Ballygunge, 700091)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white text-emerald-950 placeholder-emerald-700/70 rounded-2xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-accent-400"
              autoFocus
            />
          </div>
        </div>

        {/* Dawn delivery notice banner */}
        <div className="bg-accent-50 border-b border-accent-100 px-6 py-3 flex items-center gap-2 text-xs sm:text-sm text-amber-900">
          <Sparkles className="w-4 h-4 text-accent-600 shrink-0" />
          <span>Dawn delivery guaranteed between <strong>6:00 AM – 7:30 AM</strong> across all listed hubs!</span>
        </div>

        {/* Location List */}
        <div className="p-4 sm:p-5 max-h-80 overflow-y-auto divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm sm:text-base">
              No matching Kolkata location found. We currently serve major hubs across North, South, East & West Kolkata.
            </div>
          ) : (
            filtered.map((loc) => {
              const isSelected = selectedLocation.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setLocation(loc)}
                  className={`w-full text-left p-4 rounded-2xl flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-brand-50 border border-brand-300'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`mt-0.5 p-2 rounded-xl ${isSelected ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm sm:text-base">{loc.name}</span>
                        <span className="text-xs px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full font-mono">
                          {loc.pincode}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-emerald-700 mt-0.5 flex items-center gap-1.5 font-medium">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                        Hub: {loc.mandiHub} ({loc.zone} Kolkata)
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
                      <Check className="w-4 h-4" />
                      Active
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Don&apos;t see your area? We are expanding dawn routes weekly. WhatsApp us at +91 98300 CALWAY.
          </p>
        </div>
      </div>
    </div>
  );
};
