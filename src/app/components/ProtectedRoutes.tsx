"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If loading is finished and there's no user
        // Then redirect to login page
        console.log(isLoading);
        console.log(user);
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    // While loading, show loading screen
    if (isLoading) {
        return <div style={{ color: "red" }}>Loading....</div>;
    }

    // If user is authenticated, render the protected content
    if (user) {
        return <>{children}</>;
    }

    return null;
};

export default ProtectedRoutes;
