'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface CustomerProfile {
  id: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  fullName: string;
  phoneNumber: string;
}

interface AuthContextType {
  user: User | null;
  customer: CustomerProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: Error | null; user?: User | null }>;
  signInWithPhone: (phone: string) => Promise<{ error: Error | null }>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_MOCK_USER_KEY = 'calway_mock_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Fetch or sync customer profile from public.customers
  const fetchCustomerProfile = useCallback(async (userId: string, userEmail?: string, userPhone?: string, meta?: Record<string, unknown>) => {
    if (!isSupabaseConfigured) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching customer profile:', error.message);
      }

      if (data) {
        setCustomer({
          id: data.id,
          full_name: data.full_name,
          phone_number: data.phone_number,
          email: data.email,
          fullName: data.full_name,
          phoneNumber: data.phone_number,
        });
      } else {
        // If trigger didn't run or table didn't have row yet, insert one
        const fullNameVal = String(meta?.full_name || 'Kolkata Customer');
        const phoneVal = userPhone || String(meta?.phone_number || '');
        const newProfile = {
          id: userId,
          full_name: fullNameVal,
          phone_number: phoneVal,
          email: userEmail || null,
        };
        const { data: inserted } = await supabase
          .from('customers')
          .insert(newProfile)
          .select()
          .maybeSingle();
        if (inserted) {
          setCustomer({
            id: inserted.id,
            full_name: inserted.full_name,
            phone_number: inserted.phone_number,
            email: inserted.email,
            fullName: inserted.full_name,
            phoneNumber: inserted.phone_number,
          });
        }
      }
    } catch (e) {
      console.warn('Failed to load customer profile from Supabase:', e);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchCustomerProfile(user.id, user.email, user.phone, user.user_metadata);
    }
  }, [user, fetchCustomerProfile]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Offline / Local mock fallback
      try {
        const saved = localStorage.getItem(LOCAL_MOCK_USER_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser(parsed.user);
          setCustomer(parsed.customer);
        }
      } catch (e) {
        console.warn('Failed to load local mock auth', e);
      }
      setIsLoading(false);
      return;
    }

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCustomerProfile(
          session.user.id,
          session.user.email,
          session.user.phone,
          session.user.user_metadata
        );
      }
      setIsLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchCustomerProfile(
            session.user.id,
            session.user.email,
            session.user.phone,
            session.user.user_metadata
          );
        } else {
          setCustomer(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchCustomerProfile]);

  // Actions
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Mock sign-in
      const mockUser = {
        id: 'mock-user-123',
        email,
        user_metadata: { full_name: 'Kolkata Customer' },
      } as unknown as User;
      const mockCustomer: CustomerProfile = {
        id: 'mock-user-123',
        full_name: 'Kolkata Customer',
        phone_number: '9830123456',
        email,
        fullName: 'Kolkata Customer',
        phoneNumber: '9830123456',
      };
      setUser(mockUser);
      setCustomer(mockCustomer);
      localStorage.setItem(LOCAL_MOCK_USER_KEY, JSON.stringify({ user: mockUser, customer: mockCustomer }));
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string, phone: string) => {
    if (!isSupabaseConfigured) {
      const mockUser = {
        id: `mock-user-${Date.now()}`,
        email,
        phone,
        user_metadata: { full_name: fullName, phone_number: phone },
      } as unknown as User;
      const mockCustomer: CustomerProfile = {
        id: mockUser.id,
        full_name: fullName,
        phone_number: phone,
        email,
        fullName,
        phoneNumber: phone,
      };
      setUser(mockUser);
      setCustomer(mockCustomer);
      localStorage.setItem(LOCAL_MOCK_USER_KEY, JSON.stringify({ user: mockUser, customer: mockCustomer }));
      return { error: null, user: mockUser };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phone,
        },
      },
    });

    return { error: error ? new Error(error.message) : null, user: data.user };
  };

  const signInWithPhone = async (phone: string) => {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;

    if (!isSupabaseConfigured) {
      // Offline fallback: simulate sending OTP
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    return { error: error ? new Error(error.message) : null };
  };

  const verifyPhoneOtp = async (phone: string, token: string) => {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;

    if (!isSupabaseConfigured) {
      // Mock OTP verification
      const mockUser = {
        id: `mock-user-${phone.slice(-4)}`,
        phone: formattedPhone,
        user_metadata: { full_name: 'Kolkata Customer', phone_number: phone },
      } as unknown as User;
      const mockCustomer: CustomerProfile = {
        id: mockUser.id,
        full_name: 'Kolkata Customer',
        phone_number: phone,
        email: null,
        fullName: 'Kolkata Customer',
        phoneNumber: phone,
      };
      setUser(mockUser);
      setCustomer(mockCustomer);
      localStorage.setItem(LOCAL_MOCK_USER_KEY, JSON.stringify({ user: mockUser, customer: mockCustomer }));
      return { error: null };
    }

    const { error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token,
      type: 'sms',
    });

    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(LOCAL_MOCK_USER_KEY);
    }
    setUser(null);
    setSession(null);
    setCustomer(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        customer,
        session,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithEmail,
        signUpWithEmail,
        signInWithPhone,
        verifyPhoneOtp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
