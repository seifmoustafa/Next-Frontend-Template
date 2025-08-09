export const API_ENDPOINTS = {
  AUTH_LOGIN: "/admin/auth/login",
  AUTH_LOGOUT: "/admin/auth/logout",
  AUTH_REFRESH: "/admin/auth/refresh",
  ADMINS_ME: "/admins/me",
  ADMINS_ME_PASSWORD: "/admins/me/password",
} as const;

export type ApiEndpointKey = keyof typeof API_ENDPOINTS;
