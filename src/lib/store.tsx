import { create } from 'zustand'

interface AuthState {
    isSignUp: boolean
    setIsSignUp: (isSignUp: boolean) => void
    toggleAuthMode: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    isSignUp: true,
    setIsSignUp: (isSignUp) => set({ isSignUp }),
    toggleAuthMode: () => set((state) => ({ isSignUp: !state.isSignUp })),
}))