import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setError: (error: Error | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
}

// Create a Zustand store for managing auth state
export const useAuthStore = create<AuthState>(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: true,
      error: null,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
      clearAuth: () => set({ user: null, session: null, error: null }),
    }),
    {
      name: "aunoma-auth-storage",
    }
  )
);
