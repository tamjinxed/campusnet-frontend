"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface ProtectedRoutesProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

const ProtectedRoutes = ({
    children,
    requireAuth = true,
}: ProtectedRoutesProps) => {
    const { user, isLoading, error, isInitialized, clearError } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isInitialized) return;

        // Clear any previous auth errors
        clearError();

        if (requireAuth && !isLoading && !user && !error) {
            router.push("/login");
        }
    }, [
        user,
        isLoading,
        error,
        requireAuth,
        router,
        isInitialized,
        clearError,
    ]);

    if (!isInitialized || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-3 text-gray-600 text-sm">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-lg font-semibold text-red-600 mb-2">
                    Authentication Issue
                </h2>
                <p className="text-sm text-red-700 mb-4">{error}</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            clearError();
                            router.refresh();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                        Retry
                    </button>
                    <button
                        onClick={() => {
                            clearError();
                            router.push("/login");
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoutes;
