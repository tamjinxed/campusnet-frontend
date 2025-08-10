// @/app/lib/token.service.ts

import axios from "axios";

class TokenService {
    private accessToken: string | null = null;
    private tokenExpiry: number | null = null;
    private readonly TOKEN_KEY = "access_token";
    private readonly EXPIRY_KEY = "token_expiry";
    private readonly BUFFER_TIME = 60000; // 1 minute buffer
    private readonly REFRESH_THRESHOLD = 120000; // Refresh 2 minutes before expiry
    private refreshTimer: NodeJS.Timeout | null = null;
    private isRefreshing = false;

    constructor() {
        this.restoreToken();
        if (typeof window !== "undefined") {
            window.addEventListener("storage", this.handleStorageChange.bind(this));
            this.scheduleTokenRefresh();
        }
    }

    private handleStorageChange(event: StorageEvent): void {
        if (event.key === this.TOKEN_KEY || event.key === this.EXPIRY_KEY) {
            this.restoreToken();
            this.scheduleTokenRefresh();
        }
    }

    private scheduleTokenRefresh(): void {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }

        if (!this.tokenExpiry) return;

        const now = Date.now();
        const timeUntilRefresh = this.tokenExpiry - now - this.REFRESH_THRESHOLD;

        if (timeUntilRefresh > 0) {
            this.refreshTimer = setTimeout(() => {
                this.proactiveRefresh();
            }, timeUntilRefresh);
        } else {
            this.proactiveRefresh();
        }
    }

    private async proactiveRefresh(): Promise<void> {
        if (this.isRefreshing) {
            return;
        }

        this.isRefreshing = true;

        try {
            const refreshApi = axios.create({
                baseURL: process.env.NODE_ENV === 'production'
                    ? process.env.NEXT_PUBLIC_API_URL
                    : "http://localhost:4000/api/v1",
                withCredentials: true,
                timeout: 10000
            });

            const { data } = await refreshApi.post("/auth/refresh-token");
            const { accessToken: newAccessToken, expiresIn } = data.data;

            this.setAccessToken(newAccessToken, expiresIn || 900);

            if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent('tokenRefreshed', { detail: { token: newAccessToken } }));
            }

        } catch (error: any) {
            this.clearToken();
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        } finally {
            this.isRefreshing = false;
        }
    }

    setAccessToken(token: string, expiresIn: number = 900): void {
        if (!token) return;

        this.accessToken = token;
        this.tokenExpiry = Date.now() + expiresIn * 1000;

        if (typeof window !== "undefined") {
            localStorage.setItem(this.TOKEN_KEY, this.accessToken);
            localStorage.setItem(this.EXPIRY_KEY, this.tokenExpiry.toString());
        }

        this.scheduleTokenRefresh();
    }

    getAccessToken(): string | null {
        if (this.isTokenValid()) {
            return this.accessToken;
        }

        this.restoreToken();
        return this.isTokenValid() ? this.accessToken : null;
    }

    private isTokenValid(): boolean {
        return !!(this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry - this.BUFFER_TIME);
    }

    restoreToken(): void {
        if (typeof window === "undefined") return;

        const storedToken = localStorage.getItem(this.TOKEN_KEY);
        const storedExpiry = localStorage.getItem(this.EXPIRY_KEY);

        if (storedToken && storedExpiry) {
            const expiry = parseInt(storedExpiry, 10);
            if (Date.now() < expiry - this.BUFFER_TIME) {
                this.accessToken = storedToken;
                this.tokenExpiry = expiry;
                this.scheduleTokenRefresh();
            } else {
                this.clearToken();
            }
        } else {
            this.clearToken();
        }
    }

    clearToken(): void {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }

        this.accessToken = null;
        this.tokenExpiry = null;

        if (typeof window !== "undefined") {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.EXPIRY_KEY);
        }
    }

    hasToken(): boolean {
        return this.getAccessToken() !== null;
    }
}

const tokenService = new TokenService();

export const { setAccessToken, getAccessToken, clearToken, hasToken } = {
    setAccessToken: tokenService.setAccessToken.bind(tokenService),
    getAccessToken: tokenService.getAccessToken.bind(tokenService),
    clearToken: tokenService.clearToken.bind(tokenService),
    hasToken: tokenService.hasToken.bind(tokenService),
};