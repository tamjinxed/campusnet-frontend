// @/app/context/AuthContext.tsx

"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from "react";
import { useRouter } from "next/navigation";
import api from "../lib/axios";
import { setAccessToken, clearToken, hasToken } from "../lib/token.service";
import { toast } from "react-hot-toast";

// Interfaces
interface LoginCredentials {
    email: string;
    password: string;
}

interface AuthState {
    user: object | null;
    isLoading: boolean;
    isInitialized: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<object | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false); // Tracks initial user load
    const router = useRouter();

    const fetchUser = useCallback(async () => {
        // Only fetch user if a token exists
        if (!hasToken()) {
            setUser(null);
            setIsInitialized(true);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await api.get("/users/me");
            setUser(data.data.user);
        } catch (error) {
            // Error is handled by the interceptor, which will clear the token and redirect if needed.
            // Here, we just ensure the local user state is cleared.
            setUser(null);
            console.error("Failed to fetch user:", error);
        } finally {
            setIsLoading(false);
            setIsInitialized(true);
        }
    }, []);

    // Initial load: check for user
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const { data } = await api.post("/auth/login", credentials);
            const { accessToken, user: userData } = data.data;

            setAccessToken(accessToken);
            setUser(userData);

            toast.success("Login successful!");
            setTimeout(() => {
                router.push("/dashboard");
            }, 3000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
            toast.error(errorMessage);
            throw err; // Re-throw for form handling if needed
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout failed on server, proceeding with client-side cleanup.", error);
        } finally {
            clearToken();
            setUser(null);
            setIsLoading(false);
            toast.success("You have been logged out.");
            router.push("/login");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isInitialized,
                login,
                logout,
                refreshUserData: fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthState => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};