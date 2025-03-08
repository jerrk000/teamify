import { create } from "zustand";

interface ListStore {
  items: string[];
  setItems: (items: string[]) => void;
}

export const useListStore = create<ListStore>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
