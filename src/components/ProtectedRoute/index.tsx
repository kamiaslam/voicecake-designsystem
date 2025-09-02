"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import Loader from '@/components/Loader';

interface ProtectedRouteProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    fallback 
}) => {
    const { isAuthenticated, token, user } = useAuth();
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

    // Show fallback or loading state while checking authentication
    if (isChecking || (!isAuthenticated && !token && !user)) {
        return fallback || (
            <div className="min-h-screen bg-b-surface1 flex items-center justify-center">
                <div className="text-center">
                    <Loader text="Checking authentication..." />
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
