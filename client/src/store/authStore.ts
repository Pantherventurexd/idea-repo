import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";
import { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authCode: string | null;
  initialize: () => Promise<void>;
  login: (provider: "google" | "github" | "twitter") => Promise<void>;
  logout: () => Promise<void>;
  setAuthCode: (code: string | null) => void;
  registerWithBackend: (userData: User) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  authCode: null,

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
      set({
        user: null,
        isAuthenticated: false,
        authCode: null,
      });
      localStorage.clear();
      
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  setAuthCode: (code: string | null) => set({ authCode: code }),
  registerWithBackend: async (userData) => {
    try {
      const { data } = await supabase.auth.getSession();

      if (!data.session?.access_token) {
        throw new Error("No access token available");
      }

      // Determine API URL based on environment
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";
      const apiEndpoint = `${apiBaseUrl}/api/users/create_user`;

      // Log the token for debugging (remove in production)
      console.log("Using access token:", data.session.access_token);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({
          email: userData.email,
          // Don't include the access token in the body, only in the header
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend registration error:", errorData);
        throw new Error(
          errorData.message || "Failed to register user with backend"
        );
      }

      console.log("User registered with backend successfully");
    } catch (error) {
      console.error("Error registering user with backend:", error);
      throw error;
    }
  },
}));
