import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { ironConfig } from "lib/config";

export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, ironConfig);
}

export function withSessionSsr(handler) {
  return withIronSessionSsr(handler, ironConfig);
}
