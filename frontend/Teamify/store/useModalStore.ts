// store/modalStore.js
import { create } from 'zustand';

const useModalStore = create((set) => ({
  isModalVisible: false,
  toggleModal: () => set((state) => ({ isModalVisible: !state.isModalVisible })),
}));

export default useModalStore;