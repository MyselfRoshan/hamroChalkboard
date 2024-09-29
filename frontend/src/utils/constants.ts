// baseUrl.ts
// export const apiHost = process.env.PUBLIC_API_HOST || "localhost";
// export const apiPort = process.env.PUBLIC_API_PORT || "3333";
// export const apiVersion = process.env.PUBLIC_API_VERSION || "v1";
// export const apiPrefix = process.env.PUBLIC_API_PREFIX || "/api";

export const apiHost = process.env.PUBLIC_API_HOST || "localhost";
export const apiPort = process.env.PUBLIC_API_PORT || "3333";
export const apiVersion = process.env.PUBLIC_API_VERSION || "v1";
export const apiPrefix = process.env.PUBLIC_API_PREFIX || "/api";

export const BASE_URL = `http://${apiHost}:${apiPort}`;
export const REGISTER_URL = `${BASE_URL}/register`;
export const AUTH_URL = `${BASE_URL}/auth`;
export const API_URL = `${BASE_URL}${apiPrefix}/${apiVersion}`;
export const TOKEN_URL = `${API_URL}/token`;
export const DEAUTH_URL = `${API_URL}/auth`;
// export const ROOM_URL = `${API_URL}/room`;
export const ROOM_URL = `${API_URL}/room`;
