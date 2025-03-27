"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { useAuthStore } from "../../store/authStore";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState({
    google: false,
    github: false,
    twitter: false,
  });
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const isOAuthFlow = searchParams?.get("provider");
    const authError = searchParams?.get("authError");

    if (authError === "supabase") {
      setError("Authentication failed with identity provider");
    } else if (authError === "backend") {
      setError("User registration failed. Please try again.");
    } else if (authError === "connection") {
      setError("Connection to server failed. Please try again.");
    }
    else if (isAuthenticated && !authLoading && !isOAuthFlow) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router, searchParams]);

  const handleLogin = async (provider: "google" | "github" | "twitter") => {
    setIsLoading({ ...isLoading, [provider]: true });
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {},
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading({ ...isLoading, [provider]: false });
    }
  };

  const socialButtons = [
    {
      provider: "google",
      name: "Continue with Google",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          <path fill="none" d="M1 1h22v22H1z"/>
        </svg>
      ),
    },
    {
      provider: "github",
      name: "Continue with GitHub",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
    },
    {
      provider: "twitter",
      name: "Continue with Twitter",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1DA1F2">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className=" max-w-2xl w-full space-y-8 bg-white shadow-2xl rounded-2xl p-10 transform transition-all duration-300 hover:scale-[1.02]">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Sign in to continue to your account
          </p>
        </div>

        <div className="space-y-6">
          {socialButtons.map(({ provider, name, icon }) => (
            <button
              key={provider}
              onClick={() => handleLogin(provider as "google" | "github" | "twitter")}
              disabled={isLoading[provider as keyof typeof isLoading]}
              className={`
                w-full flex justify-center items-center gap-3 
                px-4 py-3 rounded-lg 
                border border-gray-300 
                text-gray-700 font-semibold
                hover:bg-gray-50 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-all duration-300
                ${isLoading[provider as keyof typeof isLoading] ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'}
              `}
            >
              {isLoading[provider as keyof typeof isLoading] ? (
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900"></div>
              ) : (
                <>
                  {icon}
                  <span>{name}</span>
                </>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center space-x-3 animate-shake">
            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}