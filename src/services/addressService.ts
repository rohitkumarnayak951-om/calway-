import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface CustomerAddress {
  id: string;
  customer_id: string;
  label: string;
  full_address: string;
  area: string;
  city: string;
  pincode: string;
  is_default: boolean;
  created_at?: string;
}

const LOCAL_ADDRESSES_KEY = 'calway_local_addresses';

export const addressService = {
  // Fetch all addresses for a customer
  getAddresses: async (customerId: string): Promise<CustomerAddress[]> => {
    if (!isSupabaseConfigured) {
      try {
        const saved = JSON.parse(localStorage.getItem(LOCAL_ADDRESSES_KEY) || '[]');
        const list = saved.filter((a: CustomerAddress) => a.customer_id === customerId);
        if (list.length === 0) {
          // Provide default sample Kolkata address for demo
          const defaultAddr: CustomerAddress = {
            id: 'addr-default-1',
            customer_id: customerId,
            label: 'Home',
            full_address: 'Flat 4B, Greenfield Residency, Street 12, Block BD',
            area: 'Salt Lake',
            city: 'Kolkata',
            pincode: '700091',
            is_default: true,
          };
          localStorage.setItem(LOCAL_ADDRESSES_KEY, JSON.stringify([defaultAddr]));
          return [defaultAddr];
        }
        return list;
      } catch {
        return [];
      }
    }

    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('customer_id', customerId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.warn('Failed to fetch addresses from Supabase:', error?.message);
        return [];
      }

      return data as CustomerAddress[];
    } catch (err) {
      console.error('getAddresses error:', err);
      return [];
    }
  },

  // Add a new address
  addAddress: async (address: Omit<CustomerAddress, 'id'>): Promise<{ address: CustomerAddress | null; error: Error | null }> => {
    if (!isSupabaseConfigured) {
      const newAddr: CustomerAddress = {
        ...address,
        id: `addr-${Date.now()}`,
      };
      try {
        const existing = JSON.parse(localStorage.getItem(LOCAL_ADDRESSES_KEY) || '[]');
        // If set as default, remove default from others
        const updated = newAddr.is_default
          ? existing.map((a: CustomerAddress) => ({ ...a, is_default: false }))
          : existing;
        localStorage.setItem(LOCAL_ADDRESSES_KEY, JSON.stringify([newAddr, ...updated]));
      } catch {
        // ignore
      }
      return { address: newAddr, error: null };
    }

    try {
      if (address.is_default) {
        // Set all existing to false first
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('customer_id', address.customer_id);
      }

      const { data, error } = await supabase
        .from('addresses')
        .insert(address)
        .select()
        .single();

      if (error || !data) {
        throw new Error(error?.message || 'Failed to add address');
      }

      return { address: data as CustomerAddress, error: null };
    } catch (err: unknown) {
      console.error('addAddress error:', err);
      return { address: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  },

  // Update address
  updateAddress: async (id: string, address: Partial<CustomerAddress>): Promise<{ error: Error | null }> => {
    if (!isSupabaseConfigured) {
      try {
        const existing = JSON.parse(localStorage.getItem(LOCAL_ADDRESSES_KEY) || '[]');
        const updated = existing.map((a: CustomerAddress) => (a.id === id ? { ...a, ...address } : a));
        localStorage.setItem(LOCAL_ADDRESSES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update address locally:', e);
      }
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('addresses')
        .update(address)
        .eq('id', id);

      return { error: error ? new Error(error.message) : null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  },

  // Delete address
  deleteAddress: async (id: string): Promise<{ error: Error | null }> => {
    if (!isSupabaseConfigured) {
      try {
        const existing = JSON.parse(localStorage.getItem(LOCAL_ADDRESSES_KEY) || '[]');
        const updated = existing.filter((a: CustomerAddress) => a.id !== id);
        localStorage.setItem(LOCAL_ADDRESSES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      return { error: error ? new Error(error.message) : null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  },

  // Set default address
  setDefaultAddress: async (customerId: string, addressId: string): Promise<{ error: Error | null }> => {
    if (!isSupabaseConfigured) {
      try {
        const existing = JSON.parse(localStorage.getItem(LOCAL_ADDRESSES_KEY) || '[]');
        const updated = existing.map((a: CustomerAddress) => ({
          ...a,
          is_default: a.id === addressId,
        }));
        localStorage.setItem(LOCAL_ADDRESSES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return { error: null };
    }

    try {
      // 1. Unset all
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('customer_id', customerId);

      // 2. Set target to true
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      return { error: error ? new Error(error.message) : null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  },
};
