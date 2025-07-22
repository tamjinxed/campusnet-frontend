// Implement a request queue in Axios interceptors
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken, removeToken } from "@/app/lib/token.service";

// Define structure of a retry queue item
interface RetryQueueItem {
    resolve: (value?: any) => void;
    reject: (value?: any) => void;
    config: AxiosRequestConfig
}

// Security utility functions
const generateRequestId = () => Math.random().toString(36).substring(2, 15);


// Create a list to hold the request queue
const refreshAndRetryQueue: RetryQueueItem[] = [];

// Flag to prevent multiple token refresh requests
let isRefreshing = false;

// Axios Instance
const api = axios.create({
    baseURL:
        process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_URL
            : "http://localhost:4000/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest: AxiosRequestConfig = error.config;

        if (error.response && error.response.status === 401) {
            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    // Refresh the access token
                    const { data } = await api.post("/auth/refresh-token");
                    const { accessToken } = data.data;

                    // Set the new token with expiry information
                    setAccessToken(accessToken);

                    // Update the request headers with the new access token
                    error.config.headers["Authorization"] = `Bearer ${accessToken}`;

                    // Retry all requests in the queue with the new token
                    refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
                        api
                            .request(config)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                    });

                    // Clear the queue
                    refreshAndRetryQueue.length = 0;

                    // Retry the original request
                    return api(originalRequest);
                } catch (refreshError) {
                    // Handle token refresh error
                    // Clear the token and redirect to login
                    removeToken();

                    throw refreshError;
                } finally {
                    isRefreshing = false;
                }
            }

            // Add the original request to the queue
            return new Promise<void>((resolve, reject) => {
                refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
            });
        }

        return Promise.reject(error);
    }
)

export default api;


// import axios, { AxiosError, AxiosRequestConfig } from "axios";
//
// import { getAccessToken, setAccessToken, removeToken } from "./token.service";
// import {router} from "next/client";
//
// interface FailedRequestQueueItem {
//     onSuccess: (token: string) => void;
//     onFailure: (error: AxiosError) => void;
// }
//
// // Security utility functions
// const generateRequestId = () => Math.random().toString(36).substring(2, 15);
//
// // State management for refresh logic
// let isRefreshing = false;
// let failedRequestQueue: FailedRequestQueueItem[] = [];
// let hasRefreshFailed = false;
//
// // Helper function to redirect to login
// const redirectToLogin = () => {
//     // Check if we're in browser environment
//     if (typeof window !== 'undefined') {
//         // Clear any existing tokens
//         removeToken();
//
//         // Redirect to login page
//         window.location.href = '/login'; // Adjust path as needed
//
//         // Alternative: Use Next.js router if available in context
//         // router.push('/login');
//     }
// };
//
//
// // Axios Instance
// const api = axios.create({
//     baseURL:
//         process.env.NODE_ENV === "production"
//             ? process.env.NEXT_PUBLIC_API_URL
//             : "http://localhost:4000/api/v1",
//     withCredentials: true,
//     headers: {
//         "Content-Type": "application/json",
//         "X-Requested-With": "XMLHttpRequest",
//     },
// });
//
// // Request Interceptor : adds the access token to every request
// api.interceptors.request.use(
//     (config: InternalAxiosRequestConfig) => {
//         const token = getAccessToken();
//         if (token) {
//             config.headers["Authorization"] = `Bearer ${token}`;
//         }
//
//         // Add request ID for tracking
//         config.headers["X-Request-ID"] = generateRequestId();
//
//         // Add timestamp to prevent replay attacks
//         config.headers["X-Timestamp"] = Date.now().toString();
//
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     },
// );
//
// // Response interceptor
// api.interceptors.response.use(
//     (response) => response,
//     async (error: AxiosError) => {
//         const originalRequest = error.config as InternalAxiosRequestConfig & {
//             _retry?: boolean;
//             _retryCount?: number;
//         };
//
//         if (!originalRequest) {
//             return Promise.reject(error);
//         }
//
//         const isRefreshTokenEndpoint = originalRequest.url?.endsWith(
//             "/auth/refresh-token",
//         );
//         const isLoginEndpoint = originalRequest.url?.endsWith("/auth/login");
//
//         // Handle 401 errors (unauthorized) - Token refresh logic
//         if (
//             error.response?.status === 401 &&
//             !originalRequest._retry &&
//             !isRefreshTokenEndpoint &&
//             !isLoginEndpoint &&
//             !hasRefreshFailed
//         ) {
//             if (!isRefreshing) {
//                 isRefreshing = true;
//                 originalRequest._retry = true;
//
//                 try {
//                     console.log("Access token expired or invalid. Attempting refresh...");
//
//                     // Create a separate axios instance for refresh to avoid interceptor loops
//                     const refreshAxios = axios.create({
//                         baseURL: process.env.NODE_ENV === "production"
//                             ? process.env.NEXT_PUBLIC_API_URL
//                             : "http://localhost:4000/api/v1",
//                         withCredentials: true,
//                     });
//
//                     const { data } = await refreshAxios.post(
//                         "/auth/refresh-token"
//                     );
//
//                     if (!data?.data?.accessToken) {
//                         throw new Error('Invalid refresh response format');
//                     }
//
//
//                     const { accessToken } = data.data;
//
//                     // Set the new token with expiry information
//                     setAccessToken(accessToken);
//
//                     console.log("Token refreshed successfully");
//
//                     // Retry all failed requests in the queue with the new token
//                     failedRequestQueue.forEach((request) =>
//                         request.onSuccess(accessToken),
//                     );
//                     failedRequestQueue = [];
//
//                     // Retry the original request with new token
//                     if (originalRequest.headers) {
//                         originalRequest.headers["Authorization"] =
//                             `Bearer ${accessToken}`;
//                     }
//                     return api(originalRequest);
//                 } catch (refreshError) {
//                     console.error("Token refresh failed:", refreshError);
//
//                     // Mark refresh as failed to prevent further attempts
//                     hasRefreshFailed = true;
//
//                     // Handle rate limiting on refresh endpoint
//                     if (refreshError.response?.status === 429) {
//                         console.log(
//                             "Refresh endpoint rate limited. User will need to login again.",
//                         );
//                     }
//
//                     // Notify all queued requests of failure
//                     failedRequestQueue.forEach((request) =>
//                         request.onFailure(refreshError as AxiosError),
//                     );
//                     failedRequestQueue = [];
//
//                     // Clear the token and redirect to login
//                     removeToken();
//
//                     // Redirect to login page
//                     redirectToLogin();
//
//                     // Create a user-friendly error
//                     const authError = new Error('Session expired. Please login again.');
//                     (authError as any).shouldRedirect = true;
//
//                     return Promise.reject(authError);
//                 } finally {
//                     isRefreshing = false;
//                 }
//             }
//
//             // If refresh has failed, don't queue requests - just reject them
//             if (hasRefreshFailed) {
//                 return Promise.reject(new Error('Token refresh has failed. Please login again.'));
//             }
//
//             // If a refresh is already in progress, queue the failed request
//             return new Promise((resolve, reject) => {
//                 failedRequestQueue.push({
//                     onSuccess: (token) => {
//                         if (originalRequest.headers) {
//                             originalRequest.headers["Authorization"] =
//                                 `Bearer ${token}`;
//                         }
//                         resolve(api(originalRequest));
//                     },
//                     onFailure: (error) => {
//                         reject(error);
//                     },
//                 });
//             });
//         }
//
//         // Handle other error types
//         if (error.response?.status === 401) {
//             return Promise.reject(new Error('Authentication failed. Please login again.'));
//         }
//
//         if (error.response?.status === 400) {
//             return Promise.reject(new Error("Invalid refresh token."))
//         }
//
//         if (error.response?.status === 403) {
//             console.error(
//                 "Access forbidden. User may not have required permissions.",
//             );
//         } else if (error.response?.status === 500) {
//             console.error("Server error. Please try again later.");
//         }
//
//         return Promise.reject(error);
//     },
// );
//
// export const resetRefreshState = () => {
//     hasRefreshFailed = false;
//     isRefreshing = false;
//     failedRequestQueue = [];
// };
//
//
// export default api;
