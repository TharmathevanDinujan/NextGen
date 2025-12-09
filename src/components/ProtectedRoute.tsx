"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, UserRole } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: UserRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication on client side
    const checkAuth = () => {
      const authenticated = isAuthenticated(requiredRole);
      
      if (!authenticated) {
        // Redirect to login with return URL
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}&role=${requiredRole}`);
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [requiredRole, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-teal-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

