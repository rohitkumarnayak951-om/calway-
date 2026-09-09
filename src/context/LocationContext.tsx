'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { KolkataLocality } from '@/types';
import locationsData from '@/data/locations.json';

const defaultLocations = locationsData as KolkataLocality[];

interface LocationContextType {
  selectedLocation: KolkataLocality;
  setLocation: (loc: KolkataLocality) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  deliveryPromiseText: string;
  orderCutoffText: string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const LOCATION_STORAGE_KEY = 'calway_selected_location';

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState<KolkataLocality>(defaultLocations[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = defaultLocations.find((l) => l.id === parsed.id);
        if (match) setSelectedLocation(match);
      }
    } catch (e) {
      console.warn('Failed to load location from storage', e);
    }
  }, []);

  const setLocation = (loc: KolkataLocality) => {
    setSelectedLocation(loc);
    try {
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(loc));
    } catch (e) {
      console.warn('Failed to save location to storage', e);
    }
    setIsModalOpen(false);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Dynamic delivery promise based on current time
  const deliveryPromiseText = `Delivered by 7:00 AM tomorrow to ${selectedLocation.name.split('(')[0].trim()}`;
  const orderCutoffText = 'Order before 10:00 PM tonight for dawn mandi run';

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setLocation,
        isModalOpen,
        openModal,
        closeModal,
        deliveryPromiseText,
        orderCutoffText,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
