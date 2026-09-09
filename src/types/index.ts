export interface Product {
  id: string;
  name: string;
  bengaliName?: string;
  category: 'leafy-greens' | 'daily-essentials' | 'root-vegetables' | 'kolkata-specials' | 'exotics-salads' | 'combos-kits';
  categoryLabel: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  unitWeight: string;
  weightOptions: { weight: string; price: number; originalPrice: number }[];
  image: string;
  mandiSource: string; // e.g. "Koley Mandi, 04:15 AM"
  arrivalStatus: string; // e.g. "Arrived at 4:30 AM"
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  description: string;
  nutritionalHighlights: string[];
  mandiFreshBadge?: string; // e.g. "Dawn Fresh", "Mandi Special", "Bestseller"
  isMandiSpecial?: boolean;
  storageTip?: string;
  recipeIdea?: string;
}

export interface Category {
  id: string;
  slug: Product['category'];
  name: string;
  bengaliName: string;
  icon: string; // emoji or icon name
  itemCount: number;
  bgColor: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight: string;
  selectedPrice: number;
}

export interface DeliverySlot {
  id: string;
  title: string;
  timeWindow: string;
  tag?: string;
  isAvailable: boolean;
}

export interface KolkataLocality {
  id: string;
  name: string;
  zone: 'East' | 'South' | 'North' | 'Central' | 'West';
  pincode: string;
  mandiHub: string;
  isAvailable: boolean;
}

export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  itemTotal: number;
  discount: number;
  deliveryFee: number;
  grandTotal: number;
  address: {
    fullName: string;
    phone: string;
    locality: string;
    street: string;
    pincode: string;
    landmark?: string;
    deliveryInstruction?: string;
  };
  slot: DeliverySlot;
  paymentMethod: 'upi' | 'card' | 'cod';
  createdAt: string;
  status: 'confirmed' | 'sourcing_at_mandi' | 'sorting_and_packing' | 'out_for_delivery' | 'delivered';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tagline: string;
  frequency: string;
  badge?: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  savingPercent: number;
  deliveriesPerMonth: number;
  features: string[];
  recommendedFor: string;
}
