"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from "react";
import api from "../lib/axios";
import {
    setAccessToken,
    removeToken,
    hasValidToken,
} from "../lib/token.service";
import { useRouter } from "next/navigation";

interface LoginCredentials {
    email: string;
    password: string;
}

interface AuthState {
    user: any;
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const clearError = useCallback(() => setError(null), []);

    // Verify user each time the component mounts
    const verifyUser = useCallback(async () => {
        try {
            // If no valid token, then return
            // if (!hasValidToken()) {
            //     setUser(null);
            //     setError(null);
            //     return;
            // }

            // If user has valid token, then get user data
            const { data } = await api.get("/users/me");
            const serverUser = data.data.user;

            setUser(serverUser);
            setError(null);
        } catch (error: any) {
            handleVerificationError(error);
        }
    }, []);

    // Handler for verification error
    const handleVerificationError = useCallback((err: any) => {
        const status = err.response?.status;
        if (status === 429) {
            setError("Too many requests. Please wait a moment.");
        } else if (status === 401) {
            setUser(null);
            removeToken();
            setError(null);
        } else if (status >= 500) {
            setError("Server error. Please try again later.");
        } else {
            setUser(null);
            removeToken();
            setError("Authentication failed. Please login again.");
        }
    }, []);

    // Refresh User Data
    const refreshUserData = useCallback(async () => {
        setIsLoading(true);
        await verifyUser();
        setIsLoading(false);
    }, [verifyUser]);


    // Initialize auth state
    useEffect(() => {
        const initializeAuth = async () => {
            // Show loading modal until user is verified or some error shown
            setIsLoading(true);

            await verifyUser();
            setIsLoading(false);
            setIsInitialized(true);
        };

        initializeAuth();
    }, [verifyUser]);

    // Handle visibility state change
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (
                document.visibilityState === "visible" &&
                user &&
                hasValidToken()
            ) {
                verifyUser();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () =>
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
    }, [user, verifyUser]);

    const login = async (credentials: LoginCredentials) => {
        try {
            setIsLoading(true);
            setError(null);

            // Retrieve data on successful login
            const { data } = await api.post("/auth/login", credentials);
            const message = data.message;
            const { accessToken, user: userData } = data.data;

            // Set those data on the temporary memory
            setAccessToken(accessToken);
            setUser(userData);

            router.push("/dashboard");
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 429)
                setError("Too many login attempts. Please wait.");
            else if (status === 401) setError("Invalid email or password.");
            else if (status >= 500) setError("Server error. Try again later.");
            else setError("Login failed. Please check your credentials.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await api.post("/auth/logout");

        } catch (err: any) {
            if (err.response?.status !== 429)
                console.error("Logout error:", err);
        } finally {
            setUser(null);
            removeToken();
            setError(null);
            setIsLoading(false);

            router.push("/login");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
                isInitialized,
                login,
                logout,
                clearError,
                refreshUserData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthState => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
