"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "../../../lib/supabaseClient";

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { registerWithBackend } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Fetch the session from Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data?.session?.user) {
          // Register the user with your backend
          await registerWithBackend(data.session.user);
          
          // Redirect to the home page or dashboard
          router.push("/dashboard");
        } else {
          setError("No user session found");
          setTimeout(() => router.push("/login"), 3000);
        }
      } catch (error) {
        console.error("Error during auth callback:", error);
        setError(error instanceof Error ? error.message : "Authentication failed");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    handleAuthCallback();
  }, [router, registerWithBackend]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {error ? (
        <div className="text-red-500">
          <p>{error}</p>
          <p>Redirecting to login page...</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4">Completing your sign-in...</p>
        </div>
      )}
    </div>
  );
}