class TokenService {
    private accessToken: string | null = null;
    private tokenExpiry: number | null = null;
    private readonly TOKEN_KEY = "access_token";
    private readonly EXPIRY_KEY = "token_expiry";
    private readonly BUFFER_TIME = 60000; // 1 minute buffer
    private readonly REFRESH_THRESHOLD = 900000; // 15 minutes - when to proactively refresh

    constructor() {
        this.restoreToken();

        // Listen for storage changes across tabs
        if (typeof window !== "undefined") {
            window.addEventListener(
                "storage",
                this.handleStorageChange.bind(this),
            );
        }
    }

    // Handle storage changes from other tabs
    private handleStorageChange(event: StorageEvent) {
        if (event.key === this.TOKEN_KEY || event.key === this.EXPIRY_KEY) {
            console.log("Token updated in another tab, syncing...");
            this.restoreToken();
        }
    }

    // Set accessToken
    setAccessToken(token: string, expiresIn?: number): void {
        if (!token || token.length < 10) return;

        this.accessToken = token;
        this.tokenExpiry = Date.now() + (expiresIn || 900) * 1000; // ExpireIn or 15 Mins

        // Set accessToken in localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem(this.TOKEN_KEY, this.accessToken);
            localStorage.setItem(this.EXPIRY_KEY, this.tokenExpiry.toString());
        }
    }

    // Get accessToken
    getAccessToken(): string | null {
        // If we don't have a token in memory, try to restore from storage first
        if (!this.accessToken) {
            this.restoreToken();
        }

        // Check if accessToken is valid
        if (
            this.accessToken &&
            this.tokenExpiry &&
            Date.now() < this.tokenExpiry - this.BUFFER_TIME
        ) {
            return this.accessToken;
        }

        this.restoreToken();

        // Check if accessToken is valid after restoration
        if (
            this.accessToken &&
            this.tokenExpiry &&
            Date.now() < this.tokenExpiry - this.BUFFER_TIME
        ) {
            return this.accessToken;
        }

        this.clearToken();
        return null;
    }

    // Check if token should be proactively refreshed
    shouldRefreshToken(): boolean {
        if (!this.tokenExpiry) return false;
        const timeLeft = this.tokenExpiry - Date.now();
        return timeLeft > 0 && timeLeft < this.REFRESH_THRESHOLD;
    }

    // Restore token from local storage
    restoreToken(): void {
        if (typeof window === "undefined") return;

        const storedToken = localStorage.getItem(this.TOKEN_KEY);
        const storedExpiry = localStorage.getItem(this.EXPIRY_KEY);

        // Check if stored token and expiry are valid
        if (storedToken && storedExpiry) {
            const expiry = parseInt(storedExpiry);
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

    // Clear token from local storage
    clearToken(): void {
        this.accessToken = null;
        this.tokenExpiry = null;
        if (typeof window !== "undefined") {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.EXPIRY_KEY);
        }
    }

    isTokenExpired(): boolean {
        return this.getAccessToken() === null;
    }

    // Get time left for token to expire
    getTokenTimeLeft(): number {
        if (!this.tokenExpiry) return 0;
        return Math.max(0, this.tokenExpiry - Date.now());
    }

    // Check if token exists
    hasToken(): boolean {
        return this.getAccessToken() !== null;
    }
}

const tokenService = new TokenService();

export const setAccessToken = tokenService.setAccessToken.bind(tokenService);
export const getAccessToken = tokenService.getAccessToken.bind(tokenService);
export const removeToken = tokenService.clearToken.bind(tokenService);
export const isTokenExpired = tokenService.isTokenExpired.bind(tokenService);
export const getTokenTimeLeft =
    tokenService.getTokenTimeLeft.bind(tokenService);
export const hasValidToken = tokenService.hasToken.bind(tokenService);
export const shouldRefreshToken =
    tokenService.shouldRefreshToken.bind(tokenService);
