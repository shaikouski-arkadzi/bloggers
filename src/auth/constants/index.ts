export const AUTH_PATH = "/auth";

export const AUTH_ROUTES = {
  ROOT: "",
  LOGIN: "/login",
  ME: "/me",
  REGISTRATION: "/registration",
  REGISTRATION_EMAIL_RESENDING: "/registration-email-resending",
  REGISTRATION_CONFIRMATION: "/registration-confirmation",
  REFRESH_TOKEN: "/refresh-token",
  LOGOUT: "/logout",
} as const;

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  secure: true,
  httpOnly: true,
};
