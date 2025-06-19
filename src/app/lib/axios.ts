import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import dotenv from "dotenv";
dotenv.config();

import { getAccessToken, setAccessToken, removeToken } from "./token.service";

interface FailedRequestQueueItem {
    onSuccess: (token: string) => void;
    onFailure: (error: AxiosError) => void;
}

let isRefreshing = false;
let failedRequestQueue: FailedRequestQueueItem[] = [];

// Axios Instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor - This adds the access token to every request
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Response interceptor - This handles token expiry and refresh logic
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        // Only handle 401 errors that are not from the refresh token endpoint itself
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };
        const refreshTokenEndpoint = originalRequest.url?.endsWith(
            "/auth/refresh-token",
        );
        console.log(refreshTokenEndpoint);

        if (
            error.response?.status === 401 &&
            originalRequest._retry !== true &&
            !refreshTokenEndpoint
        ) {
            if (!isRefreshing) {
                isRefreshing = true;
                originalRequest._retry = true;

                try {
                    // Refresh the token
                    const { data } = await axios
                        .create({
                            baseURL: process.env.NEXT_PUBLIC_API_URL,
                            withCredentials: true,
                        })
                        .post("/auth/refresh-token", {});

                    const { accessToken } = data.data;

                    setAccessToken(accessToken);

                    // Retry all failed request in the queue with this new token
                    failedRequestQueue.forEach((request) =>
                        request.onSuccess(accessToken),
                    );
                    failedRequestQueue = [];

                    // Retry the original request
                    if (originalRequest.headers) {
                        originalRequest.headers["Authorization"] =
                            `Bearer ${accessToken}`;
                    }
                    return api(originalRequest);
                } catch (refreshError) {
                    // If refresh fails, log out the user
                    failedRequestQueue.forEach((request) =>
                        request.onFailure(refreshError as AxiosError),
                    );
                    failedRequestQueue = [];

                    // Clear memory token
                    removeToken();

                    // Redirect to login page
                    if (typeof window !== "undefined") {
                        window.location.href = "/login";
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

        return Promise.reject(error);
    },
);

export default api;
