// @/app/components/ProtectedRoutes.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { hasToken } from "../lib/token.service";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, isInitialized } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isInitialized) {
            return;
        }

        if (!user && !hasToken()) {
            router.push("/login");
        }
    }, [user, isInitialized, router]);

    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-3 text-gray-600 text-sm">Loading...</p>
            </div>
        );
    }

    return (user || hasToken()) ? <>{children}</> : null;
};

export default ProtectedRoute;