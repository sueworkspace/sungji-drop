import { create } from 'zustand';
import { StoreDeal, mockDeals } from '../data/mockDeals';

interface DealsStore {
  deals: StoreDeal[];
  isLoading: boolean;
  selectedCarrier: string | null;
  selectedPlanType: string | null;
  setFilter: (carrier: string | null, planType: string | null) => void;
  getFilteredDeals: () => StoreDeal[];
  refreshDeals: () => void;
}

export const useDealsStore = create<DealsStore>((set, get) => ({
  deals: mockDeals,
  isLoading: false,
  selectedCarrier: null,
  selectedPlanType: null,

  setFilter: (carrier, planType) =>
    set({ selectedCarrier: carrier, selectedPlanType: planType }),

  getFilteredDeals: () => {
    const { deals, selectedCarrier, selectedPlanType } = get();
    return deals.filter((deal) => {
      if (selectedCarrier && deal.carrier !== selectedCarrier) return false;
      if (selectedPlanType && deal.planType !== selectedPlanType) return false;
      return true;
    });
  },

  refreshDeals: () => {
    set({ isLoading: true });
    // Simulate API call
    setTimeout(() => {
      set({ deals: mockDeals, isLoading: false });
    }, 1000);
  },
}));
