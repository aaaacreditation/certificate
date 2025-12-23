import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isAdminRoute = nextUrl.pathname.startsWith("/admin")
    const isLoginPage = nextUrl.pathname === "/login"
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
    const isPublicCertificateRoute = nextUrl.pathname.startsWith("/certificate/")

    // Allow public routes
    if (isApiAuthRoute || isPublicCertificateRoute) {
        return NextResponse.next()
    }

    // Redirect authenticated users away from login
    if (isLoginPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/admin", nextUrl))
    }

    // Protect admin routes
    if (isAdminRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
}
