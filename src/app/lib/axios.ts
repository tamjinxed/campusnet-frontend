import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import dotenv from "dotenv";
dotenv.config();

import { getAccessToken, setAccessToken, removeToken } from "./token.service";

interface FailedRequestQueueItem {
    onSuccess: (token: string) => void;
    onFailure: (error: AxiosError) => void;
}

// Security utility functions
const generateRequestId = () => Math.random().toString(36).substring(2, 15);

// State management for refresh logic
let isRefreshing = false;
let failedRequestQueue: FailedRequestQueueItem[] = [];

// Axios Instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

// Utility function to wait

// Request Interceptor : adds the access token to every request
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        // Add request ID for tracking
        config.headers["X-Request-ID"] = generateRequestId();

        // Add timestamp to prevent replay attacks
        config.headers["X-Timestamp"] = Date.now().toString();

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
            _retryCount?: number;
        };

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const isRefreshTokenEndpoint = originalRequest.url?.endsWith(
            "/auth/refresh-token",
        );
        const isLoginEndpoint = originalRequest.url?.endsWith("/auth/login");

        // Handle 401 errors (unauthorized) - Token refresh logic
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isRefreshTokenEndpoint &&
            !isLoginEndpoint
        ) {
            if (!isRefreshing) {
                isRefreshing = true;
                originalRequest._retry = true;

                try {
                    console.log(
                        "Access token expired or invalid. Attempting refresh...",
                    );

                    // Create a separate axios instance for refresh to avoid interceptor loops
                    const refreshAxios = axios.create({
                        baseURL: process.env.NEXT_PUBLIC_API_URL,
                        withCredentials: true,
                    });

                    const { data } = await refreshAxios.post(
                        "/auth/refresh-token",
                        {},
                    );
                    const { accessToken } = data.data;

                    // Set the new token with expiry information
                    setAccessToken(accessToken);

                    console.log("Token refreshed successfully");

                    // Retry all failed requests in the queue with the new token
                    failedRequestQueue.forEach((request) =>
                        request.onSuccess(accessToken),
                    );
                    failedRequestQueue = [];

                    // Retry the original request with new token
                    if (originalRequest.headers) {
                        originalRequest.headers["Authorization"] =
                            `Bearer ${accessToken}`;
                    }
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);

                    // Handle rate limiting on refresh endpoint
                    if (refreshError.response?.status === 429) {
                        console.log(
                            "Refresh endpoint rate limited. User will need to login again.",
                        );
                    }

                    // Notify all queued requests of failure
                    failedRequestQueue.forEach((request) =>
                        request.onFailure(refreshError as AxiosError),
                    );
                    failedRequestQueue = [];

                    // Clear the token and redirect to login
                    removeToken();

                    // Redirect to login page (client-side only)
                    if (typeof window !== "undefined") {
                        // Add a small delay to prevent immediate redirect during multiple failed requests
                        setTimeout(() => {
                            window.location.href = "/login";
                        }, 100);
                    }

                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            // If a refresh is already in progress, queue the failed request
            return new Promise((resolve, reject) => {
                failedRequestQueue.push({
                    onSuccess: (token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers["Authorization"] =
                                `Bearer ${token}`;
                        }
                        resolve(api(originalRequest));
                    },
                    onFailure: (error) => {
                        reject(error);
                    },
                });
            });
        }

        // Handle other error types
        if (error.response?.status === 403) {
            console.error(
                "Access forbidden. User may not have required permissions.",
            );
        } else if (error.response?.status === 500) {
            console.error("Server error. Please try again later.");
        }

        return Promise.reject(error);
    },
);

export default api;
