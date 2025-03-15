import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";
import { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (provider: "google" | "github" | "twitter") => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    try {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        const { data: userData } = await supabase.auth.getUser();
        set({
          user: userData.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  login: async (provider) => {
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },
}));
