import { create } from 'zustand';
import { Deal, WishlistItem, deals as mockDeals } from '../data/mock';

interface AppState {
  // Filters
  selectedBrand: string | null;
  selectedSort: 'discount' | 'price' | 'recent' | 'popular';
  setSelectedBrand: (brand: string | null) => void;
  setSelectedSort: (sort: 'discount' | 'price' | 'recent' | 'popular') => void;

  // Wishlist
  wishlist: WishlistItem[];
  addToWishlist: (deviceId: string, currentPrice: number) => void;
  removeFromWishlist: (deviceId: string) => void;
  isWishlisted: (deviceId: string) => boolean;
  setTargetPrice: (deviceId: string, price: number) => void;

  // Notifications
  unreadCount: number;
  setUnreadCount: (count: number) => void;

  // User
  points: number;
  addPoints: (amount: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Filters
  selectedBrand: null,
  selectedSort: 'discount',
  setSelectedBrand: (brand) => set({ selectedBrand: brand }),
  setSelectedSort: (sort) => set({ selectedSort: sort }),

  // Wishlist
  wishlist: [],
  addToWishlist: (deviceId, currentPrice) =>
    set((state) => ({
      wishlist: [
        ...state.wishlist,
        {
          id: `w-${deviceId}`,
          deviceId,
          addedAt: new Date().toISOString(),
          priceAtAdd: currentPrice,
        },
      ],
    })),
  removeFromWishlist: (deviceId) =>
    set((state) => ({
      wishlist: state.wishlist.filter((w) => w.deviceId !== deviceId),
    })),
  isWishlisted: (deviceId) => get().wishlist.some((w) => w.deviceId === deviceId),
  setTargetPrice: (deviceId, price) =>
    set((state) => ({
      wishlist: state.wishlist.map((w) =>
        w.deviceId === deviceId ? { ...w, targetPrice: price } : w
      ),
    })),

  // Notifications
  unreadCount: 3,
  setUnreadCount: (count) => set({ unreadCount: count }),

  // User
  points: 780,
  addPoints: (amount) => set((state) => ({ points: state.points + amount })),
}));
