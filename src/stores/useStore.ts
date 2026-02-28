import { create } from 'zustand';

interface QuoteDraft {
  deviceId: string | null;
  deviceName: string | null;
  storage: string | null;
  color: string | null;
  carrier: string | null;
  planType: string | null;
  tradeInDevice: string | null;
  tradeInCondition: string | null;
  additionalNotes: string | null;
}

interface AppState {
  // Unread counts
  unreadNotifications: number;
  unreadChats: number;
  setUnreadNotifications: (count: number) => void;
  setUnreadChats: (count: number) => void;

  // Quote request draft (for multi-step form)
  quoteDraft: QuoteDraft;
  setQuoteDraft: (draft: Partial<QuoteDraft>) => void;
  resetQuoteDraft: () => void;
}

const DEFAULT_DRAFT: QuoteDraft = {
  deviceId: null,
  deviceName: null,
  storage: null,
  color: null,
  carrier: null,
  planType: null,
  tradeInDevice: null,
  tradeInCondition: null,
  additionalNotes: null,
};

export const useStore = create<AppState>((set) => ({
  // Unread counts
  unreadNotifications: 0,
  unreadChats: 0,
  setUnreadNotifications: (count) => set({ unreadNotifications: count }),
  setUnreadChats: (count) => set({ unreadChats: count }),

  // Quote request draft
  quoteDraft: { ...DEFAULT_DRAFT },
  setQuoteDraft: (draft) =>
    set((state) => ({
      quoteDraft: { ...state.quoteDraft, ...draft },
    })),
  resetQuoteDraft: () => set({ quoteDraft: { ...DEFAULT_DRAFT } }),
}));
