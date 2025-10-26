import { create } from 'zustand'

interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

interface UIState {
  toasts: ToastMessage[]
  isModalOpen: boolean
  modalContent: React.ReactNode | null
  showToast: (type: ToastMessage['type'], message: string) => void
  removeToast: (id: string) => void
  openModal: (content: React.ReactNode) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  isModalOpen: false,
  modalContent: null,

  showToast: (type, message) => {
    const id = Math.random().toString(36).substring(7)
    const toast: ToastMessage = { id, type, message }

    set((state) => ({
      toasts: [...state.toasts, toast],
    }))

    // Auto-remove after 3 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, 3000)
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },

  openModal: (content) => {
    set({ isModalOpen: true, modalContent: content })
  },

  closeModal: () => {
    set({ isModalOpen: false, modalContent: null })
  },
}))
