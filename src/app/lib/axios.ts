// @/app/lib/axios.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken, clearToken } from "@/app/lib/token.service";
import { toast } from "react-hot-toast";

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
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

        if (error.response?.status === 401 && originalRequest?.url !== "/auth/refresh-token" && !originalRequest?._retry) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    if (originalRequest.headers) {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    }
                    return api(originalRequest);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshApi = axios.create({
                    baseURL: api.defaults.baseURL,
                    withCredentials: true,
                    timeout: 10000
                });

                const { data } = await refreshApi.post("/auth/refresh-token");
                const { accessToken: newAccessToken, expiresIn } = data.data;

                const tokenExpirySeconds = expiresIn || 900;
                setAccessToken(newAccessToken, tokenExpirySeconds);
                processQueue(null, newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                }
                return api(originalRequest);

            } catch (refreshError: any) {
                const authError = new Error("Your session has expired. Please log in again.");
                processQueue(authError, null);
                clearToken();

                if (refreshError.response?.status) {
                    toast.error("Session expired. Please log in.");
                }

                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }

                return Promise.reject(authError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;