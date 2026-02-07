import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { storage } from "@/utils/storage"

type AuthStore = {
  authToken?: string
  authEmail: string
  setAuthToken: (token?: string) => void
  setAuthEmail: (email: string) => void
  logout: () => void
}

const AUTH_STORAGE_KEY = "auth-store"

export function getAuthValidationError(email: string): string {
  if (!email || email.length === 0) return "can't be blank"
  if (email.length < 6) return "must be at least 6 characters"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "must be a valid email address"
  return ""
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      authToken: undefined,
      authEmail: "",
      setAuthToken: (token) => set({ authToken: token }),
      setAuthEmail: (email) => set({ authEmail: email }),
      logout: () => set({ authToken: undefined, authEmail: "" }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => ({
        getItem: (name) => storage.getString(name) ?? null,
        setItem: (name, value) => storage.set(name, value),
        removeItem: (name) => storage.delete(name),
      })),
      partialize: (state) => ({
        authToken: state.authToken,
        authEmail: state.authEmail,
      }),
    },
  ),
)

