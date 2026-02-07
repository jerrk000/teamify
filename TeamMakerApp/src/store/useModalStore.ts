// store/modalStore.js
// store/modalStore.ts
import { create } from 'zustand';

interface ModalStore {
  isModalVisible: boolean;
  toggleModal: () => void;
}

const useModalStore = create<ModalStore>((set) => ({
  isModalVisible: false,
  toggleModal: () => set((state) => ({ isModalVisible: !state.isModalVisible })),
}));

export default useModalStore;
