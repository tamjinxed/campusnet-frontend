// @/app/lib/axios.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken, clearToken } from "@/app/lib/token.service";
import { toast } from "react-hot-toast"; // Example: for user feedback

let isRefreshing = false;
let failedQueue: Array<(token: string) => void> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom(Promise.reject(error));
        } else {
            prom(token!);
        }
    });
    failedQueue = [];
};

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL : "http://localhost:4000/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Attach the token to every request
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle token expiry and refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Only handle 401 errors that are not from the refresh token endpoint itself
        if (error.response?.status === 401 && originalRequest.url !== "/auth/refresh-token" && !originalRequest._retry) {

            if (isRefreshing) {
                // If a refresh is already in progress, queue the request
                return new Promise((resolve, reject) => {
                    failedQueue.push((token: string) => {
                        originalRequest.headers!["Authorization"] = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Use a separate, clean Axios instance for the refresh call to avoid interceptor loops
                const refreshApi = axios.create({ baseURL: api.defaults.baseURL, withCredentials: true });
                const { data } = await refreshApi.post("/auth/refresh-token");
                const newAccessToken = data.data.accessToken;

                setAccessToken(newAccessToken);
                processQueue(null, newAccessToken);

                originalRequest.headers!["Authorization"] = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                const authError = new Error("Your session has expired. Please log in again.");
                processQueue(authError, null);
                clearToken();
                toast.error("Session expired. Please log in.");

                // Redirect to login page
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }

                return Promise.reject(authError);
            } finally {
                isRefreshing = false;
            }
        }

        // For all other errors, just reject the promise
        return Promise.reject(error);
    }
);

export default api;