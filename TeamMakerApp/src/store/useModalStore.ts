// store/modalStore.js
// store/modalStore.ts
import { create } from "zustand"

interface ModalStore {
  isModalVisible: boolean
  openModal: () => void
  closeModal: () => void
  toggleModal: () => void
}

const useModalStore = create<ModalStore>((set) => ({
  isModalVisible: false,
  openModal: () => set({ isModalVisible: true }),
  closeModal: () => set({ isModalVisible: false }),
  toggleModal: () => set((state) => ({ isModalVisible: !state.isModalVisible })),
}))

export default useModalStore
