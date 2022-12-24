export const ironConfig = {
  cookieName: "pc-session-cookie",
  password: process.env.COOKIE_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}
