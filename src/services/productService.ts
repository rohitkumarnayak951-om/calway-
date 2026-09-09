import { Product, Category, KolkataLocality, DeliverySlot, SubscriptionPlan } from '@/types';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import locationsData from '@/data/locations.json';

const products: Product[] = productsData as Product[];
const categories: Category[] = categoriesData as Category[];
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

/**
 * Product Service to query mock data.
 * Can be replaced by fetch() or GraphQL queries in production.
 */
export const productService = {
  // Get all products with optional query filtering
  getProducts: async (filter?: {
    category?: string;
    search?: string;
    sortBy?: 'popular' | 'price-low' | 'price-high' | 'freshness';
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> => {
    let result = [...products];

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
          // Prioritize items with dawn fresh badge
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
    return products.find((p) => p.id === id);
  },

  // Get daily specials / dawn picks
  getMandiSpecials: async (): Promise<Product[]> => {
    return products.filter((p) => p.isMandiSpecial);
  },

  // Get related products in same category
  getRelatedProducts: async (productId: string, limit = 4): Promise<Product[]> => {
    const current = products.find((p) => p.id === productId);
    if (!current) return products.slice(0, limit);
    return products
      .filter((p) => p.id !== productId && p.category === current.category)
      .slice(0, limit);
  },

  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    return categories;
  },

  // Get Kolkata locations
  getLocations: async (): Promise<KolkataLocality[]> => {
    return locations;
  },
};
