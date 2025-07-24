// @/app/lib/token.service.ts

class TokenService {
    private accessToken: string | null = null;
    private tokenExpiry: number | null = null;
    private readonly TOKEN_KEY = "access_token";
    private readonly EXPIRY_KEY = "token_expiry";
    private readonly BUFFER_TIME = 5000; // 5-second buffer for safety

    constructor() {
        this.restoreToken();
        // Sync token across tabs
        if (typeof window !== "undefined") {
            window.addEventListener("storage", this.handleStorageChange.bind(this));
        }
    }

    private handleStorageChange(event: StorageEvent): void {
        if (event.key === this.TOKEN_KEY || event.key === this.EXPIRY_KEY) {
            this.restoreToken();
        }
    }

    setAccessToken(token: string, expiresIn: number = 900): void { // Default 15 mins
        if (!token) return;
        this.accessToken = token;
        this.tokenExpiry = Date.now() + expiresIn * 1000;

        if (typeof window !== "undefined") {
            localStorage.setItem(this.TOKEN_KEY, this.accessToken);
            localStorage.setItem(this.EXPIRY_KEY, this.tokenExpiry.toString());
        }
    }

    getAccessToken(): string | null {
        if (this.isTokenValid()) {
            return this.accessToken;
        }
        // If in-memory token is invalid, try restoring from localStorage
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
            } else {
                this.clearToken();
            }
        } else {
            this.clearToken();
        }
    }

    clearToken(): void {
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

// Export bound methods to ensure `this` context is correct
export const { setAccessToken, getAccessToken, clearToken, hasToken } = {
    setAccessToken: tokenService.setAccessToken.bind(tokenService),
    getAccessToken: tokenService.getAccessToken.bind(tokenService),
    clearToken: tokenService.clearToken.bind(tokenService),
    hasToken: tokenService.hasToken.bind(tokenService),
};