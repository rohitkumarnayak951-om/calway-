import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { CartItem } from '@/types';

export interface OrderItemRecord {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price_at_purchase: number;
  unit: string;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  customer_id: string;
  address_id: string | null;
  status: 'pending' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  delivery_slot: string;
  subtotal: number;
  discount: number;
  total: number;
  payment_status: string;
  delivery_address_snapshot: Record<string, unknown> | null;
  created_at: string;
  order_items?: OrderItemRecord[];
}

const LOCAL_ORDERS_KEY = 'calway_local_orders';

export const orderService = {
  // Create a new order with items
  createOrder: async (params: {
    customerId: string;
    addressId?: string | null;
    deliverySlot: string;
    subtotal: number;
    discount: number;
    total: number;
    items: CartItem[];
    addressSnapshot: Record<string, unknown>;
  }): Promise<{ order: OrderRecord | null; error: Error | null }> => {
    const orderNumber = `CAL-${Math.floor(100000 + Math.random() * 900000)}`;

    if (!isSupabaseConfigured) {
      // Local fallback mode
      const mockOrder: OrderRecord = {
        id: `local-ord-${Date.now()}`,
        order_number: orderNumber,
        customer_id: params.customerId,
        address_id: params.addressId || null,
        status: 'pending',
        delivery_slot: params.deliverySlot,
        subtotal: params.subtotal,
        discount: params.discount,
        total: params.total,
        payment_status: 'pending',
        delivery_address_snapshot: params.addressSnapshot,
        created_at: new Date().toISOString(),
        order_items: params.items.map((item, idx) => ({
          id: `local-item-${idx}`,
          product_id: item.product.id,
          product_name: item.product.name,
          product_image: item.product.image,
          quantity: item.quantity,
          price_at_purchase: item.selectedPrice || item.product.price,
          unit: item.selectedWeight || item.product.unitWeight,
        })),
      };

      try {
        const existing = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
        localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([mockOrder, ...existing]));
      } catch (e) {
        console.warn('Failed to save order to localStorage:', e);
      }

      return { order: mockOrder, error: null };
    }

    try {
      // 1. Insert order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_id: params.customerId,
          address_id: params.addressId || null,
          status: 'pending',
          delivery_slot: params.deliverySlot,
          subtotal: params.subtotal,
          discount: params.discount,
          total: params.total,
          payment_status: 'pending',
          delivery_address_snapshot: params.addressSnapshot,
        })
        .select()
        .single();

      if (orderError || !orderData) {
        throw new Error(orderError?.message || 'Failed to create order');
      }

      // 2. Insert order items
      const orderItemsToInsert = params.items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.image,
        quantity: item.quantity,
        price_at_purchase: item.selectedPrice || item.product.price,
        unit: item.selectedWeight || item.product.unitWeight,
      }));

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert)
        .select();

      if (itemsError) {
        console.warn('Warning: Failed to insert order items:', itemsError.message);
      }

      // 3. Decrement stock for each product
      for (const item of params.items) {
        try {
          await supabase.rpc('decrement_product_stock', {
            p_product_id: item.product.id,
            p_qty: item.quantity,
          });
        } catch (stockErr) {
          console.warn(`Could not decrement stock for ${item.product.id}:`, stockErr);
        }
      }

      const fullOrder: OrderRecord = {
        ...orderData,
        order_items: itemsData || orderItemsToInsert,
      };

      return { order: fullOrder, error: null };
    } catch (err: unknown) {
      console.error('Order creation failed:', err);
      return { order: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  },

  // Get orders for a specific customer
  getCustomerOrders: async (customerId: string): Promise<OrderRecord[]> => {
    if (!isSupabaseConfigured) {
      try {
        const saved = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
        return saved.filter((o: OrderRecord) => o.customer_id === customerId);
      } catch {
        return [];
      }
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.warn('Failed to fetch customer orders:', error?.message);
        return [];
      }

      return data as OrderRecord[];
    } catch (err) {
      console.error('getCustomerOrders error:', err);
      return [];
    }
  },

  // Get a single order by ID or order_number
  getOrderById: async (orderId: string): Promise<OrderRecord | null> => {
    if (!isSupabaseConfigured) {
      try {
        const saved = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
        return saved.find((o: OrderRecord) => o.id === orderId || o.order_number === orderId) || null;
      } catch {
        return null;
      }
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .or(`id.eq.${orderId},order_number.eq.${orderId}`)
        .maybeSingle();

      if (error || !data) {
        console.warn('Failed to fetch order by ID:', error?.message);
        return null;
      }

      return data as OrderRecord;
    } catch (err) {
      console.error('getOrderById error:', err);
      return null;
    }
  },
};
