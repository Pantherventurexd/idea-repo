"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { supabase } from "../../lib/supabaseClient";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        useAuthStore.setState({
          user: session.user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // Call backend API to register user
        try {
          await useAuthStore.getState().registerWithBackend(session.user);
        } catch (error) {
          console.error('Failed to register with backend after authentication', error);
          // You might want to handle this error (show notification, etc.)
        }
      } else if (event === "SIGNED_OUT") {
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });
  
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
