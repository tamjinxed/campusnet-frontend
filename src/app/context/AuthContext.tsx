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
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();

    const fetchUser = useCallback(async () => {
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
        } catch (error: any) {
            if (error.response?.status !== 401) {
                setUser(null);
            }
        } finally {
            setIsLoading(false);
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const { data } = await api.post("/auth/login", credentials);
            const { accessToken, user: userData, expiresIn } = data.data;

            const tokenExpirySeconds = expiresIn || 900;
            setAccessToken(accessToken, tokenExpirySeconds);
            setUser(userData);

            toast.success("Login successful!");
            router.push("/dashboard");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
            toast.error(errorMessage);
            throw err;
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