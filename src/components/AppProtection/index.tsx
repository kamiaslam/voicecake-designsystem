"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useFinance } from "@/context/financeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import SubscriptionProtectedRoute from "@/components/SubscriptionProtectedRoute";
import Loader from "@/components/Loader";

interface AppProtectionProps {
  children: React.ReactNode;
}

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/auth/signin", "/auth/signup"];

// Routes that require authentication but not subscription
const AUTH_ONLY_ROUTES = ["/plan-selection", "/purchase-plan"];

export default function AppProtection({ children }: AppProtectionProps) {
  const pathname = usePathname();
  const { isAuthenticated, token, user } = useAuth();
  const { hasActiveSubscription, subscriptionsLoaded, requiresPlan } = useFinance();

  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  
  // Check if current route only requires authentication (not subscription)
  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.includes(pathname);

  // Show loading while checking authentication and subscription status
  if (!isPublicRoute && (!isAuthenticated || !subscriptionsLoaded)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader text="Loading..." />
        </div>
      </div>
    );
  }

  // Public routes - no protection needed
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Auth-only routes - only require authentication
  if (isAuthOnlyRoute) {
    return (
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    );
  }

  // All other routes - require both authentication and subscription
  return (
    <SubscriptionProtectedRoute requireSubscription={true}>
      {children}
    </SubscriptionProtectedRoute>
  );
}
