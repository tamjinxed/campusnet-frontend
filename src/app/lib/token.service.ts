// In-memory access token. Will be lost when browser refreshes

let accessToken = null;

export const setAccessToken = (token: string) => {
    accessToken = token;
}

export const getAccessToken = () => {
    return accessToken;
}

export const removeToken = () => {
    accessToken = null;
}