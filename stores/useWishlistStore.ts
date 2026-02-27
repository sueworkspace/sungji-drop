import { create } from 'zustand';

interface WishlistStore {
  wishlistIds: string[];
  addToWishlist: (dealId: string) => void;
  removeFromWishlist: (dealId: string) => void;
  isWishlisted: (dealId: string) => boolean;
  toggleWishlist: (dealId: string) => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlistIds: [],

  addToWishlist: (dealId) =>
    set((state) => ({
      wishlistIds: state.wishlistIds.includes(dealId)
        ? state.wishlistIds
        : [...state.wishlistIds, dealId],
    })),

  removeFromWishlist: (dealId) =>
    set((state) => ({
      wishlistIds: state.wishlistIds.filter((id) => id !== dealId),
    })),

  isWishlisted: (dealId) => get().wishlistIds.includes(dealId),

  toggleWishlist: (dealId) => {
    const { isWishlisted, addToWishlist, removeFromWishlist } = get();
    if (isWishlisted(dealId)) {
      removeFromWishlist(dealId);
    } else {
      addToWishlist(dealId);
    }
  },
}));
