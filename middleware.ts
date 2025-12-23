import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Define route types
    const isAdminRoute = pathname.startsWith("/admin")
    const isLoginPage = pathname === "/login"
    const isApiAuthRoute = pathname.startsWith("/api/auth")
    const isPublicCertificateRoute = pathname.startsWith("/certificate/")
    const isPublicApiRoute = pathname.startsWith("/api/certificates") && req.method === "GET"

    // Allow public routes
    if (isApiAuthRoute || isPublicCertificateRoute || isPublicApiRoute) {
        return NextResponse.next()
    }

    // Check for session token
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    })
    const isLoggedIn = !!token

    // Redirect authenticated users away from login
    if (isLoginPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/admin", req.url))
    }

    // Protect admin routes
    if (isAdminRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/login",
        "/api/certificates/:path*"
    ],
}
