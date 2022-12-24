import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

export const ironConfig = {
  cookieName: "pc-session-cookie",
  password: "complex_password_at_least_32_characters_long_TODO",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}

export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, ironConfig);
}

export function withSessionSsr(handler) {
  return withIronSessionSsr(handler, ironConfig);
}
