import { Product, Category, KolkataLocality, DeliverySlot, SubscriptionPlan } from '@/types';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import locationsData from '@/data/locations.json';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

const localProducts: Product[] = productsData as Product[];
const localCategories: Category[] = categoriesData as Category[];
const locations: KolkataLocality[] = locationsData as KolkataLocality[];

export const deliverySlots: DeliverySlot[] = [
  {
    id: 'slot-early',
    title: 'Dawn Run Delivery',
    timeWindow: '6:00 AM - 7:30 AM',
    tag: '⚡ Most Popular (Before Chai)',
    isAvailable: true,
  },
  {
    id: 'slot-morning',
    title: 'Morning Breakfast Run',
    timeWindow: '7:30 AM - 9:00 AM',
    tag: '☀️ Best for working professionals',
    isAvailable: true,
  },
  {
    id: 'slot-midmorning',
    title: 'Pre-Lunch Run',
    timeWindow: '9:00 AM - 10:30 AM',
    tag: '🥬 Direct from 2nd sorting',
    isAvailable: true,
  },
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan-daily',
    name: 'Daily Fresh Morning Basket',
    tagline: 'Fresh greens & daily staples at your doorstep every dawn',
    frequency: 'Every Morning (6:00 - 7:15 AM)',
    badge: 'Most Popular',
    monthlyPrice: 1999,
    quarterlyPrice: 5399,
    savingPercent: 15,
    deliveriesPerMonth: 28,
    recommendedFor: 'Joint families & daily home cooks (4-6 persons)',
    features: [
      'Daily 2.5 - 3 kg curated mandi-fresh seasonal vegetables',
      'Guaranteed doorstep drop before 7:15 AM',
      'Customizable preferences (e.g. no bitter gourd, extra coriander)',
      'Zero delivery fee forever',
      'Pause or skip anytime with 1-tap in WhatsApp or app',
      '100% replacement guarantee if any item fails quality test',
    ],
  },
  {
    id: 'plan-alternate',
    name: 'Alternate-Day Green Basket',
    tagline: 'Balanced restock 3-4 days a week for active homes',
    frequency: 'Mon / Wed / Fri / Sun',
    badge: 'Best Balance',
    monthlyPrice: 1299,
    quarterlyPrice: 3499,
    savingPercent: 18,
    deliveriesPerMonth: 14,
    recommendedFor: 'Couples & nuclear families (2-3 persons)',
    features: [
      '3.5 kg generous basket of greens, roots, and daily veggies',
      'Hand-picked at dawn from Koley & Mechua wholesale mandis',
      'Free ginger, chilies & coriander pouch with every drop',
      'Zero delivery charge',
      'Vacation pause feature up to 14 days without penalty',
      'Priority access to seasonal Kolkata winter specials',
    ],
  },
  {
    id: 'plan-weekend',
    name: 'Weekend Big Mandi Haul',
    tagline: 'Massive weekly haul for stress-free weekend feasting',
    frequency: 'Every Saturday / Sunday Morning',
    monthlyPrice: 899,
    quarterlyPrice: 2399,
    savingPercent: 12,
    deliveriesPerMonth: 4,
    recommendedFor: 'Working couples meal prepping for the upcoming week',
    features: [
      '6 - 7 kg complete weekly pantry haul in eco-friendly crates',
      'Includes specialty kits (Shukto / Sambar / Salad packs)',
      'Delivered between 6:30 AM - 8:00 AM',
      'Free artisan cold-pressed mustard oil mini bottle quarterly',
      'Dedicated delivery executive for your apartment complex',
    ],
  },
];

interface DbProductRow {
  id: string;
  name: string;
  bengali_name?: string | null;
  category_id?: string | null;
  price: number | string;
  discounted_price?: number | string | null;
  unit?: string | null;
  image_url?: string | null;
  mandi_source?: string | null;
  arrival_status?: string | null;
  is_available?: boolean;
  stock_quantity?: number;
  is_featured?: boolean;
  rating?: number | string;
  reviews_count?: number | string;
  description?: string | null;
}

// Helper to map DB row to Product interface
function mapDbProduct(row: DbProductRow): Product {
  let currentPrice = Number(row.price);
  let origPrice = row.discounted_price ? Number(row.discounted_price) : currentPrice;
  if (origPrice < currentPrice) {
    const temp = currentPrice;
    currentPrice = origPrice;
    origPrice = temp;
  }
  const discountPct = origPrice > currentPrice
    ? Math.round(((origPrice - currentPrice) / origPrice) * 100)
    : 0;

  return {
    id: row.id,
    name: row.name,
    bengaliName: row.bengali_name || undefined,
    category: row.category_id as Product['category'],
    categoryLabel: row.category_id?.replace('-', ' ') || 'Fresh Vegetables',
    price: currentPrice,
    originalPrice: origPrice,
    discountPercent: discountPct,
    unitWeight: row.unit || '500g',
    weightOptions: [
      { weight: row.unit || '500g', price: currentPrice, originalPrice: origPrice },
    ],
    image: row.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    mandiSource: row.mandi_source || 'Koley Mandi, Sealdah',
    arrivalStatus: row.arrival_status || 'Picked at dawn today',
    inStock: Boolean(row.is_available && (row.stock_quantity === undefined || row.stock_quantity > 0)),
    rating: Number(row.rating) || 4.8,
    reviewsCount: Number(row.reviews_count) || 120,
    description: row.description || '',
    nutritionalHighlights: ['100% Zero Cold Storage', 'Direct Mandi Auction', 'Fresh Morning Harvest'],
    mandiFreshBadge: row.is_featured ? 'Dawn Fresh' : undefined,
    isMandiSpecial: Boolean(row.is_featured),
  };
}

export const productService = {
  // Get all products with optional query filtering
  getProducts: async (filter?: {
    category?: string;
    search?: string;
    sortBy?: 'popular' | 'price-low' | 'price-high' | 'freshness';
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> => {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('products').select('*');

        if (filter?.category && filter.category !== 'all') {
          query = query.eq('category_id', filter.category);
        }

        if (filter?.minPrice !== undefined) {
          query = query.gte('price', filter.minPrice);
        }

        if (filter?.maxPrice !== undefined) {
          query = query.lte('price', filter.maxPrice);
        }

        if (filter?.search) {
          query = query.or(`name.ilike.%${filter.search}%,bengali_name.ilike.%${filter.search}%,description.ilike.%${filter.search}%`);
        }

        // Sorting
        if (filter?.sortBy === 'price-low') {
          query = query.order('price', { ascending: true });
        } else if (filter?.sortBy === 'price-high') {
          query = query.order('price', { ascending: false });
        } else if (filter?.sortBy === 'freshness') {
          query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        } else {
          query = query.order('reviews_count', { ascending: false });
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(mapDbProduct);
        }
      } catch (err) {
        console.warn('Supabase products fetch failed, falling back to local seed data:', err);
      }
    }

    // Local fallback
    let result = [...localProducts];

    if (filter?.category && filter.category !== 'all') {
      result = result.filter((p) => p.category === filter.category);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.bengaliName && p.bengaliName.includes(q)) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.mandiSource.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (filter?.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filter.minPrice!);
    }

    if (filter?.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filter.maxPrice!);
    }

    if (filter?.sortBy) {
      switch (filter.sortBy) {
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'freshness':
          result.sort((a, b) => (b.isMandiSpecial ? 1 : 0) - (a.isMandiSpecial ? 1 : 0));
          break;
        case 'popular':
        default:
          result.sort((a, b) => b.reviewsCount - a.reviewsCount);
          break;
      }
    }

    return result;
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product | undefined> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          return mapDbProduct(data);
        }
      } catch (err) {
        console.warn('Supabase getProductById failed, checking local data:', err);
      }
    }

    return localProducts.find((p) => p.id === id);
  },

  // Get daily specials / dawn picks
  getMandiSpecials: async (): Promise<Product[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true);

        if (!error && data && data.length > 0) {
          return data.map(mapDbProduct);
        }
      } catch (err) {
        console.warn('Supabase getMandiSpecials failed:', err);
      }
    }

    return localProducts.filter((p) => p.isMandiSpecial);
  },

  // Get related products in same category
  getRelatedProducts: async (productId: string, limit = 4): Promise<Product[]> => {
    const current = await productService.getProductById(productId);
    if (!current) return localProducts.slice(0, limit);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', current.category)
          .neq('id', productId)
          .limit(limit);

        if (!error && data && data.length > 0) {
          return data.map(mapDbProduct);
        }
      } catch (err) {
        console.warn('Supabase getRelatedProducts failed:', err);
      }
    }

    return localProducts
      .filter((p) => p.id !== productId && p.category === current.category)
      .slice(0, limit);
  },

  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((c) => ({
            id: c.id,
            slug: c.slug as Product['category'],
            name: c.name,
            bengaliName: c.slug,
            icon: c.icon_url || '🥬',
            itemCount: 6,
            bgColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          }));
        }
      } catch (err) {
        console.warn('Supabase getCategories failed, falling back to local categories:', err);
      }
    }

    return localCategories;
  },

  // Get Kolkata locations
  getLocations: async (): Promise<KolkataLocality[]> => {
    return locations;
  },
};
