import { create } from "zustand";

type Item = {
  id: string;
  name: string;
};
 
interface ListStore {
  items: Item[];
  setItems: (items: Item[]) => void;
 
}
 
export const useListStore = create<ListStore>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
