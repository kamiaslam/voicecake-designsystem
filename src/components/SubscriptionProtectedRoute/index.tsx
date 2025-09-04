"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { useFinance } from '@/context/financeContext';
import Loader from '@/components/Loader';

interface SubscriptionProtectedRouteProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    requireSubscription?: boolean;
    botType?: 'conversa' | 'empath';
}

const SubscriptionProtectedRoute: React.FC<SubscriptionProtectedRouteProps> = ({ 
    children, 
    fallback,
    requireSubscription = true,
    botType
}) => {
    const { isAuthenticated, token, user } = useAuth();
    const { 
        hasActiveSubscription, 
        subscriptionsLoaded, 
        requiresPlan, 
        hasValidPlan,
        getRequiredPlanRedirect 
    } = useFinance();
    const router = useRouter();
    const [redirectTo, setRedirectTo] = useState('/dashboard');
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Get redirect parameter from URL without useSearchParams
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        if (redirect) {
            setRedirectTo(redirect);
        }
    }, []);

    useEffect(() => {
        // Add a small delay to ensure auth state is properly loaded
        const timer = setTimeout(() => {
            setIsChecking(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Only redirect if we're not checking and definitely not authenticated
        if (!isChecking && !isAuthenticated && !token && !user) {
            router.push(`/auth/signin?redirect=${encodeURIComponent(redirectTo)}`);
        }
    }, [isAuthenticated, token, user, router, redirectTo, isChecking]);

    useEffect(() => {
        // Check subscription status after subscriptions are loaded and user is authenticated
        if (!isChecking && isAuthenticated && subscriptionsLoaded && requireSubscription) {
            if (requiresPlan) {
                // User needs a plan
                const redirectUrl = getRequiredPlanRedirect();
                router.push(redirectUrl);
            } else if (botType && !hasValidPlan(botType)) {
                // User needs a specific bot type plan
                const redirectUrl = getRequiredPlanRedirect();
                router.push(`${redirectUrl}?bot=${botType}`);
            }
        }
    }, [
        isChecking, 
        isAuthenticated, 
        subscriptionsLoaded, 
        requireSubscription, 
        requiresPlan, 
        botType, 
        hasValidPlan, 
        getRequiredPlanRedirect, 
        router
    ]);

    // Show fallback or loading state while checking authentication
    if (isChecking || (!isAuthenticated && !token && !user)) {
        return fallback || (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader text="Checking authentication..." />
                </div>
            </div>
        );
    }

    // Show loading state while checking subscription
    if (isAuthenticated && !subscriptionsLoaded) {
        return fallback || (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader text="Loading subscription status..." />
                </div>
            </div>
        );
    }

    // Show redirect message if subscription is required but not available
    if (isAuthenticated && subscriptionsLoaded && requireSubscription && requiresPlan) {
        return fallback || (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-4 text-lg">Redirecting to plan selection...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default SubscriptionProtectedRoute;
