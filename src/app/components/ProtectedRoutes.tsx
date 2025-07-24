// @/app/components/ProtectedRoutes.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, isInitialized } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Wait until the initial authentication check is complete
        if (!isInitialized) {
            return;
        }

        // If auth check is done and there's no user, redirect to login
        if (!user) {
            router.push("/login");
        }
    }, [user, isInitialized, router]);

    // While checking auth, show a loader
    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-3 text-gray-600 text-sm">Loading...</p>
            </div>
        );
    }

    // If there is a user, render the children
    // The redirect in useEffect will handle the case where user is null
    return user ? <>{children}</> : null;
};

export default ProtectedRoute;