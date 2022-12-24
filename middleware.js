import { getIronSession } from "iron-session/edge";
import { NextResponse } from "next/server"
import { ironConfig } from "lib/config"

export async function middleware(req) {
    const res = NextResponse.next()

    const session = await getIronSession(req, res, ironConfig)
    const { user } = session
    //console.log({user})

    if (!user?.isLoggedIn) {
        const url = req.nextUrl.clone()
        url.pathname = "/login"
        return NextResponse.rewrite(url)
    }

    return res
}
export const config = {
    matcher: [
        /*
         * Matches all request paths except for the ones starting with:
         * - /api/auth (AUTH routes)
         * - /login & /signup 
         * - _next/static (static files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth|login|signup|_next/static|favicon).*)',
    ]
}