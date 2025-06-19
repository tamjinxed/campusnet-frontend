"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import api from "../lib/axios";
import {
    getAccessToken,
    setAccessToken,
    removeToken,
} from "../lib/token.service";
import { useRouter } from "next/navigation";

interface AuthState {
    user;
    isLoading: boolean;
    login: (credentials) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Run an initial app load to check for an existing session
    useEffect(() => {
        const verifyUser = async () => {
            // If an access token already exists in memory, then assume user is logged in
            if (getAccessToken()) {
                try {
                    const { data } = await api.get("/users/me");
                    console.log(data.data.user);
                    setUser(data.data.user);
                } catch (error) {
                    console.log(error);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        verifyUser();
    }, []);

    const login = async (credentials) => {
        try {
            const { data } = await api.post("/auth/login", credentials);
            const { accessToken, user } = data.data;
            setAccessToken(accessToken);
            setUser(user);

            router.push("/dashboard");
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error(error);
        } finally {
            setUser(null);
            removeToken();
            router.push("/login");
        }
    };

    const authContextValue = {
        user,
        isLoading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
