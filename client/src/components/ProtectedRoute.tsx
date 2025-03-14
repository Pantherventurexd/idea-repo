"use client";
import { useEffect, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router, isMounted]);

  if (status === "loading") {
    return <div>Loading...</div>; 
  }

  return session ? children : null;
};

export default ProtectedRoute;
